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

    @property(cc.Node)
    CityLabelTemplate: cc.Node = null;

    @property(cc.Node)
    CityNodePanel1: cc.Node = null;

    @property(cc.Node)
    CityNodePanel2: cc.Node = null;

    @property(cc.Node)
    CityLabelPanel: cc.Node = null;
    CityLabelOffsetH:number = 0;
    CityLabelOffsetV:number = 50;
    CityLabelOffsetV_MAX:number = 50;
    CITY_LABEL_SCALE_MAX = 1.3;

    CAM:cc.Camera = null;
    RTXT:cc.RenderTexture = null;
    MapSwitchThreshold:number = 200;

    CityNodeList1 = new Array<cc.Node>();
    CityNodeList2 = new Array<cc.Node>();
    CityLabelList = new Array<cc.Node>();

    GlobeAutoSpinning:boolean = true;
    GLOBE_AUTO_SPIN_SPEED:number = 90;
    //#endregion

    //#region Lifecycle

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.RegisterTouchEvent();
    }

    start () {
        // this.SF = this.FullWorldMap.spriteFrame;
        // this.TX = this.globe.dragonAtlasAsset.texture;
        // this.CaptureArea.setPosition(this.FullWorldMap.node.position);
        
        this.WorldMaps.scaleY = -1;
        this.LoadCity();
    }

    update (dt) {
        if (this.GlobeAutoSpinning) {
            let delta = this.GLOBE_AUTO_SPIN_SPEED * dt;
            this.DragMap(delta);
        }
    }

    //#endregion

    //#region Globe

    DragMap(delta_x:number){
        this.WorldMaps.setPosition(this.WorldMaps.position.x + delta_x, 0);
        this.UpdateFullWorldMap();
    }

    UpdateFullWorldMap(){
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
        this.UpdateCities();
    }

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
            {"width":2000,"height":1000,
            "SubTexture":[{"name":"WorldMap","x":1,"y":1,"width":1000,"height":1000}],
            "name":"WorldMapDragon","imagePath":"WorldMap.jpg"}
            `;
        this.globe.dragonAtlasAsset = data;
    }

    UpdateCities(){
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
                let distance_H = Math.sin(angle_H) * radius;
                let scale = (1 + Math.abs(Math.cos(angle_H))) / 2;
                let offsetV = this.CityLabelOffsetV * scale;
                node.setPosition(distance_H + this.CityLabelOffsetH, distance_V + offsetV);
                node.setScale(scale);
                node.opacity = scale * (opacity > 0 ? scale * 255 : 0);
                break;
            }
        }
    }

    OptimizeLabelFontSize(scale: number){
        if (scale > this.CITY_LABEL_SCALE_MAX) {
            this.CityLabelOffsetV = this.CityLabelOffsetV_MAX * this.CITY_LABEL_SCALE_MAX / scale;
            for (let city of this.CityLabelList) {
                let wrapper = city.getChildByName("label_wrapper");
                wrapper.setScale(this.CITY_LABEL_SCALE_MAX / scale);
            }
        }
        else{
            // this.CityLabelOffsetV = this.CityLabelOffsetV_MAX;
        }
    }

    GlobeZoom(scale:number){
        this.GlobePanel.setScale(scale);
        this.OptimizeLabelFontSize(scale);
    }

    //#endregion

    //#region City

    LoadCity(){
        this.AddCityNode("北京", 100, 200);
        this.AddCityNode("斐济", 300, -100);
        this.AddCityNode("东京", 0, 0);
        this.AddCityNode("Las Vagas", -100, -200);
        this.AddCityNode("布宜诺斯艾利斯", 400, 300);
        this.AddCityNode("Stockholm", -400, 100);
        this.AddCityNode("莫斯科", 500, 200);
        this.AddCityNode("巴厘岛", -500, 0);
        this.AddCityNode("Shenmi Island", 600, -100);

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

        city = cc.instantiate(this.CityLabelTemplate);
        let label = city.getComponentInChildren(cc.Label);
        label.string = cityName;
        city.name = cityName;
        this.CityLabelPanel.addChild(city);
        city.opacity = 0;
        this.CityLabelList.push(city);
    }

    CityTapped(city:cc.Node){
        this.debug_label.string = city.name;
    }

    //#endregion

    //#region Touch Event

    RegisterTouchEvent(){
        // touch start
        this.node.on(cc.Node.EventType.TOUCH_START, 
            (e)=>{
                this.GlobeAutoSpinning = false;
                // this.debug_label.string = "start" + e.getID().toString();
                this.TrackTouchPoint(e.touch);
            }, this);

        // touch move
        this.node.on(cc.Node.EventType.TOUCH_MOVE, 
            (e)=>{
                let delta:cc.Vec2 = e.touch.getDelta();
                if (this.TouchingPoints.length == 1) {
                    this.DragMap(delta.x);                    
                }
                else if (this.TouchingPoints.length == 2) {
                    this.TouchZoom();
                }
            }, this);

        // touch end
        this.node.on(cc.Node.EventType.TOUCH_END, 
            (e)=>{
                this.GlobeAutoSpinning = true;
                // this.debug_label.string = "end " + e.getID().toString();
                this.TryRemoveTouchingPoint(e.touch)
            }, this);

        // touch cancel
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, 
            (e)=>{
                this.GlobeAutoSpinning = true;
                // this.debug_label.string = "cancel " + e.getID().toString();
                this.TryRemoveTouchingPoint(e.touch)
            }, this);

    }

    TouchingPoints = new Array<any>();
    TrackTouchPoint(touch:any){
        this.TouchingPoints.push(touch);
    }

    TryRemoveTouchingPoint(touch:any){
        let touch_id = touch.getID();
        let idx = 0;
        while (idx < this.TouchingPoints.length) {
            let id = this.TouchingPoints[idx].getID();
            if (id == touch_id) {
                this.TouchingPoints.splice(idx,1);
                break;
            }
            else{
                idx++;
            }
        }
    }

    TouchZoom(){
        if (this.TouchingPoints.length == 2) {
            let old_location_1:cc.Vec2 = this.TouchingPoints[0].getPreviousLocation();
            let old_location_2:cc.Vec2 = this.TouchingPoints[1].getPreviousLocation();
            let new_location_1:cc.Vec2 = this.TouchingPoints[0].getLocation();
            let new_location_2:cc.Vec2 = this.TouchingPoints[1].getLocation();

            let x1 = old_location_1.x - old_location_2.x;
            let y1 = old_location_1.y - old_location_2.y;
            let x2 = new_location_1.x - new_location_2.x;
            let y2 = new_location_1.y - new_location_2.y;

            let old_area = Math.sqrt(Math.pow(x1,2) + Math.pow(y1,2));
            let new_area = Math.sqrt(Math.pow(x2,2) + Math.pow(y2,2));
            let factor = new_area/old_area;
            factor = 1 + (factor - 1) * 0.5; 
            // this.debug_label.string = (new_area/old_area).toString();

            let scale = this.GlobePanel.scale * factor;
            this.GlobeZoom(scale);
        }
    }

    //#endregion

    //#region Test

    Test2(){
        // let delta:cc.Vec2 = new cc.Vec2(-190,0);
        // this.DragMap(delta.x);
        this.GlobeZoom(this.GlobePanel.scale - 0.1);
    }

    Test3(){
        this.GlobeZoom(this.GlobePanel.scale + 0.1);
    }

    //#endregion
}
