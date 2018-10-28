import GlobeController from "./GlobeController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CityController extends cc.Component {

    //#region Property

    globe_controller: GlobeController = null;
    
    //#endregion

    //#region Lifecycle

    onLoad () {
        let canvas = cc.director.getScene().getChildByName("Canvas");
        this.globe_controller = canvas.getComponent(GlobeController);
        this.RegisterTouchEvent();
    }

    // start () {
    // }

    // update (dt) {
    // }

    //#endregion

    //#region Touch Event

    RegisterTouchEvent(){
        // touch start
        this.node.on(cc.Node.EventType.TOUCH_START, 
            (e)=>{
                this.globe_controller.CityTapped(this.node.getParent());
            }, this);

        // touch end
        this.node.on(cc.Node.EventType.TOUCH_END, 
            (e)=>{
            }, this);

        // touch cancel
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, 
            (e)=>{
            }, this);

    }


    //#endregion

}
