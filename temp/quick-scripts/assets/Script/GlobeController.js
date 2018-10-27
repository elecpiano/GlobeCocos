(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/GlobeController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e1b90/rohdEk4SdmmEZANaD', 'GlobeController', __filename);
// Script/GlobeController.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GlobeController = /** @class */ (function (_super) {
    __extends(GlobeController, _super);
    function GlobeController() {
        //#region Property
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.WorldMaps = null;
        _this.WorldMap1 = null;
        _this.WorldMap2 = null;
        _this.CaptureArea = null;
        _this.MonitorSprite = null;
        _this.globe = null;
        _this.GlobePanel = null;
        _this.debug_label = null;
        _this.CityNodeTemplate = null;
        _this.CityLabelTemplate = null;
        _this.CityNodePanel1 = null;
        _this.CityNodePanel2 = null;
        _this.CityLabelPanel = null;
        _this.CAM = null;
        _this.RTXT = null;
        _this.MapSwitchThreshold = 200;
        _this.CityNodeList1 = new Array();
        _this.CityNodeList2 = new Array();
        _this.CityLabelList = new Array();
        //#endregion
        //#region Touch Event
        _this.TouchStartPosition = new cc.Vec2(0, 0);
        return _this;
        //#endregion
    }
    //#endregion
    //#region Lifecycle
    GlobeController.prototype.onLoad = function () {
        this.RegisterTouchEvent();
    };
    GlobeController.prototype.start = function () {
        // this.SF = this.FullWorldMap.spriteFrame;
        // this.TX = this.globe.dragonAtlasAsset.texture;
        // this.CaptureArea.setPosition(this.FullWorldMap.node.position);
        this.WorldMaps.scaleY = -1;
        this.LoadCity();
    };
    //#endregion
    //#region Globe
    GlobeController.prototype.UpdateGlobe = function () {
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
        var sf = new cc.SpriteFrame(this.RTXT);
        this.MonitorSprite.spriteFrame = sf;
        var data = new dragonBones.DragonBonesAtlasAsset();
        data.texture = this.RTXT;
        data.atlasJson = "\n            {\"width\":960,\"height\":640,\n            \"SubTexture\":[{\"name\":\"WorldMap\",\"x\":100,\"y\":100,\"width\":300,\"height\":300}],\n            \"name\":\"NewProject\",\"imagePath\":\"NewProject_tex.png\"}\n            ";
        this.globe.dragonAtlasAsset = data;
    };
    //#endregion
    //#region City
    GlobeController.prototype.LoadCity = function () {
        this.AddCityNode("city1", 100, 200);
        this.AddCityNode("city2", 300, -100);
        this.AddCityNode("city3", 0, 0);
        this.AddCityNode("city4", -100, -200);
        this.AddCityNode("city5", 400, 300);
        this.AddCityNode("city6", -400, 100);
        this.AddCityNode("city7", 500, 200);
        this.AddCityNode("city8", -500, 0);
        this.AddCityNode("city9", 600, -100);
    };
    GlobeController.prototype.AddCityNode = function (cityName, x, y) {
        var city = cc.instantiate(this.CityNodeTemplate);
        city.name = cityName;
        this.CityNodePanel1.addChild(city);
        city.setPosition(x, y);
        this.CityNodeList1.push(city);
        city = cc.instantiate(this.CityNodeTemplate);
        city.name = cityName;
        this.CityNodePanel2.addChild(city);
        city.setPosition(x, y);
        this.CityNodeList2.push(city);
        city = cc.instantiate(this.CityLabelTemplate.node);
        var label = city.getComponent(cc.Label);
        label.string = cityName;
        city.name = cityName;
        this.CityLabelPanel.addChild(city);
        city.opacity = 0;
        this.CityLabelList.push(city);
    };
    GlobeController.prototype.RegisterTouchEvent = function () {
        var _this = this;
        // touch start
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
        }, this);
        // touch move
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var delta = e.touch.getDelta();
            _this.SetMapPosition(delta);
        }, this);
        // touch end
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
        }, this);
    };
    GlobeController.prototype.SetMapPosition = function (delta) {
        this.WorldMaps.setPosition(this.WorldMaps.position.x + delta.x, 0);
        // this.debug_label.string = this.WorldMaps.position.x.toString();
        var offset = this.WorldMaps.position.x % 2000;
        // this.debug_label.string = this.WorldMaps.position.x.toString() + "\n" + offset.toString();
        this.WorldMaps.setPosition(offset, 0);
        if (offset > this.MapSwitchThreshold) {
            this.WorldMap2.setPosition(this.WorldMap1.position.x - 2000, 0);
        }
        else { //if(offset < 0 - this.MapSwitchThreshold) {
            this.WorldMap2.setPosition(this.WorldMap1.position.x + 2000, 0);
        }
        this.UpdateGlobe();
        this.UpdateCities(delta);
    };
    GlobeController.prototype.UpdateCities = function (delta) {
        // visibility
        var str = "";
        for (var _i = 0, _a = this.CityNodeList1; _i < _a.length; _i++) {
            var city = _a[_i];
            this.UpdateCity(city);
        }
    };
    GlobeController.prototype.UpdateCity = function (city) {
        var opacity = city.opacity;
        // city node list 1
        var worldMap = city.getParent().getParent();
        var distance_H = city.position.x + worldMap.position.x + this.WorldMaps.position.x;
        var angle_H = (distance_H / 1000) * Math.PI;
        var angle_V = (city.position.y / 1000) * Math.PI;
        var distance_V = Math.sin(angle_V) * 320;
        var radius = Math.cos(angle_V) * 320;
        city.opacity = Math.abs(distance_H) > 500 ? 0 : 255;
        // city node list 2
        for (var _i = 0, _a = this.CityNodeList2; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.name == city.name) {
                var worldMap_1 = node.getParent().getParent();
                var distance = node.position.x + worldMap_1.position.x + this.WorldMaps.position.x;
                node.opacity = Math.abs(distance) > 500 ? 0 : 255;
                opacity += node.opacity;
                break;
            }
        }
        // city label list
        for (var _b = 0, _c = this.CityLabelList; _b < _c.length; _b++) {
            var node = _c[_b];
            if (node.name == city.name) {
                var offset_H = Math.sin(angle_H) * radius;
                node.setPosition(offset_H, distance_V);
                var scale = (1 + Math.abs(Math.cos(angle_H))) / 2;
                node.setScale(scale);
                node.opacity = opacity > 0 ? scale * 255 : 0;
                break;
            }
        }
    };
    //#endregion
    //#region Test
    GlobeController.prototype.Test2 = function () {
        var delta = new cc.Vec2(-190, 0);
        this.SetMapPosition(delta);
    };
    GlobeController.prototype.Test3 = function () {
        // this.dragon.dragonAtlasAsset = null;
        this.GlobePanel.setScale(this.GlobePanel.scale + 0.1);
    };
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "WorldMaps", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "WorldMap1", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "WorldMap2", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "CaptureArea", void 0);
    __decorate([
        property(cc.Sprite)
    ], GlobeController.prototype, "MonitorSprite", void 0);
    __decorate([
        property(dragonBones.ArmatureDisplay)
    ], GlobeController.prototype, "globe", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "GlobePanel", void 0);
    __decorate([
        property(cc.Label)
    ], GlobeController.prototype, "debug_label", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "CityNodeTemplate", void 0);
    __decorate([
        property(cc.Label)
    ], GlobeController.prototype, "CityLabelTemplate", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "CityNodePanel1", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "CityNodePanel2", void 0);
    __decorate([
        property(cc.Node)
    ], GlobeController.prototype, "CityLabelPanel", void 0);
    GlobeController = __decorate([
        ccclass
    ], GlobeController);
    return GlobeController;
}(cc.Component));
exports.default = GlobeController;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GlobeController.js.map
        