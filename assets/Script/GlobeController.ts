const {ccclass, property} = cc._decorator;

@ccclass
export default class GlobeController extends cc.Component {

    //#region Property

    @property(cc.Node)
    WorldMaps: cc.Node = null;
    @property(cc.Node)
    WorldMap1: cc.Node = null;
    @property(cc.Node)
    WorldMap2: cc.Node = null;

    @property(cc.Node)
    CaptureArea: cc.Node = null;

    @property(cc.Sprite)
    MonitorSprite: cc.Sprite = null;

    @property(dragonBones.ArmatureDisplay)
    globe: dragonBones.ArmatureDisplay = null;
    
    @property(cc.Node)
    GlobePanel: cc.Node = null;

    @property(cc.Label)
    debug_label: cc.Label = null;

    @property(cc.Node)
    CityNodeTemplate: cc.Node = null;

    @property(cc.Label)
    CityLabelTemplate: cc.Label = null;

    @property(cc.Node)
    CityNodePanel1: cc.Node = null;

    @property(cc.Node)
    CityNodePanel2: cc.Node = null;

    @property(cc.Node)
    CityLabelPanel: cc.Node = null;

    CAM:cc.Camera = null;
    RTXT:cc.RenderTexture = null;

    MapSwitchThreshold:number = 200;

    CityNodeList1 = new Array<cc.Node>();
    CityNodeList2 = new Array<cc.Node>();
    CityLabelList = new Array<cc.Node>();

    //#endregion

    //#region Lifecycle

    onLoad () {
        this.RegisterTouchEvent();
    }

    start () {
        // this.SF = this.FullWorldMap.spriteFrame;
        // this.TX = this.globe.dragonAtlasAsset.texture;
        // this.CaptureArea.setPosition(this.FullWorldMap.node.position);
        
        this.WorldMaps.scaleY = -1;
        this.LoadCity();
    }

    //#endregion

    //#region Globe

    UpdateGlobe(){
        // this.FullWorldMap.node.setPosition(this.FullWorldMap.node.position.x + 30, this.FullWorldMap.node.position.y);
        
        if (this.RTXT == null) {
            this.RTXT = new cc.RenderTexture();
            this.RTXT.initWithSize(1000, 1000);
        }
        
        if (this.CAM == null) {
            this.CAM = this.CaptureArea.addComponent(cc.Camera);
        }
        this.CAM.targetTexture = this.RTXT;
        this.CAM.render(this.WorldMaps);

        let sf = new cc.SpriteFrame(this.RTXT);
        this.MonitorSprite.spriteFrame = sf;

        let data = new dragonBones.DragonBonesAtlasAsset();
        data.texture = this.RTXT;
        data.atlasJson =  `
            {"width":960,"height":640,
            "SubTexture":[{"name":"WorldMap","x":100,"y":100,"width":300,"height":300}],
            "name":"NewProject","imagePath":"NewProject_tex.png"}
            `;
        this.globe.dragonAtlasAsset = data;
    }

    //#endregion

    //#region City

    LoadCity(){
        this.AddCityNode("city1", 100, 200);
        this.AddCityNode("city2", 300, -100);
        this.AddCityNode("city3", 0, 0);
        this.AddCityNode("city4", -100, -200);
        this.AddCityNode("city5", 400, 300);
        this.AddCityNode("city6", -400, 100);
        this.AddCityNode("city7", 500, 200);
        this.AddCityNode("city8", -500, 0);
        this.AddCityNode("city9", 600, -100);

    }

    AddCityNode(cityName:string, x:number, y:number){
        let city = cc.instantiate(this.CityNodeTemplate);
        city.name = cityName;
        this.CityNodePanel1.addChild(city);
        city.setPosition(x,y);
        this.CityNodeList1.push(city);

        city = cc.instantiate(this.CityNodeTemplate);
        city.name = cityName;
        this.CityNodePanel2.addChild(city);
        city.setPosition(x,y);
        this.CityNodeList2.push(city);

        city = cc.instantiate(this.CityLabelTemplate.node);
        let label = city.getComponent(cc.Label);
        label.string = cityName;
        city.name = cityName;
        this.CityLabelPanel.addChild(city);
        city.opacity = 0;
        this.CityLabelList.push(city);

    }

    //#endregion

    //#region Touch Event

    TouchStartPosition:cc.Vec2 = new cc.Vec2(0,0);

    RegisterTouchEvent(){
        // touch start
        this.node.on(cc.Node.EventType.TOUCH_START, 
            (e)=>{
                
            }, this);

        // touch move
        this.node.on(cc.Node.EventType.TOUCH_MOVE, 
            (e)=>{
                let delta:cc.Vec2 = e.touch.getDelta();
                this.SetMapPosition(delta);
            }, this);

        // touch end
        this.node.on(cc.Node.EventType.TOUCH_END, 
            (e)=>{
            }, this);
    }

    SetMapPosition(delta:cc.Vec2){
        this.WorldMaps.setPosition(this.WorldMaps.position.x + delta.x, 0);
        // this.debug_label.string = this.WorldMaps.position.x.toString();

        let offset = this.WorldMaps.position.x % 2000;

        // this.debug_label.string = this.WorldMaps.position.x.toString() + "\n" + offset.toString();

        this.WorldMaps.setPosition(offset,0);
        if (offset > this.MapSwitchThreshold) {
            this.WorldMap2.setPosition(this.WorldMap1.position.x - 2000, 0);
        }
        else {//if(offset < 0 - this.MapSwitchThreshold) {
            this.WorldMap2.setPosition(this.WorldMap1.position.x + 2000, 0);
        }

        this.UpdateGlobe();
        this.UpdateCities(delta);
    }

    UpdateCities(delta:cc.Vec2){
        // visibility
        let str = "";
        for (let city of this.CityNodeList1) {
            this.UpdateCity(city);
        }
    }

    UpdateCity(city:cc.Node){
        let opacity = city.opacity;

        // city node list 1
        let worldMap = city.getParent().getParent();
        let distance_H = city.position.x + worldMap.position.x + this.WorldMaps.position.x;
        let angle_H = (distance_H / 1000) * Math.PI;
        let angle_V = (city.position.y / 1000) * Math.PI;
        let distance_V = Math.sin(angle_V) * 320;
        let radius = Math.cos(angle_V) * 320;
        city.opacity = Math.abs(distance_H) > 500 ? 0 : 255;

        // city node list 2
        for (let node of this.CityNodeList2) {
            if (node.name == city.name) {
                let worldMap = node.getParent().getParent();
                let distance = node.position.x + worldMap.position.x + this.WorldMaps.position.x;
                node.opacity = Math.abs(distance) > 500 ? 0 : 255;
                opacity += node.opacity;
                break;
            }
        }

        // city label list
        for (let node of this.CityLabelList) {
            if (node.name == city.name) {
                let offset_H = Math.sin(angle_H) * radius;
                node.setPosition(offset_H, distance_V);
                let scale = (1 + Math.abs(Math.cos(angle_H))) / 2;
                node.setScale(scale);
                node.opacity = opacity > 0 ? scale * 255 : 0;
                break;
            }
        }
    }

    //#endregion

    //#region Test

    Test2(){
        let delta:cc.Vec2 = new cc.Vec2(-190,0);
        this.SetMapPosition(delta);
    }

    Test3(){
        // this.dragon.dragonAtlasAsset = null;
        this.GlobePanel.setScale(this.GlobePanel.scale + 0.1);
    }

    //#endregion
}
