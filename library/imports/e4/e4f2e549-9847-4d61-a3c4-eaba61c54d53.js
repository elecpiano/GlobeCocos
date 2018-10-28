"use strict";
cc._RF.push(module, 'e4f2eVJmEdNYaPE6rphxU1T', 'CityController');
// Script/CityController.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GlobeController_1 = require("./GlobeController");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CityController = /** @class */ (function (_super) {
    __extends(CityController, _super);
    function CityController() {
        //#region Property
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.globe_controller = null;
        return _this;
        //#endregion
    }
    //#endregion
    //#region Lifecycle
    CityController.prototype.onLoad = function () {
        var canvas = cc.director.getScene().getChildByName("Canvas");
        this.globe_controller = canvas.getComponent(GlobeController_1.default);
        this.RegisterTouchEvent();
    };
    // start () {
    // }
    // update (dt) {
    // }
    //#endregion
    //#region Touch Event
    CityController.prototype.RegisterTouchEvent = function () {
        var _this = this;
        // touch start
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            _this.globe_controller.CityTapped(_this.node.getParent());
        }, this);
        // touch end
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
        }, this);
        // touch cancel
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
        }, this);
    };
    CityController = __decorate([
        ccclass
    ], CityController);
    return CityController;
}(cc.Component));
exports.default = CityController;

cc._RF.pop();