"use strict";
cc._RF.push(module, 'e1b90/rohdEk4SdmmEZANaD', 'GlobeController');
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
        _this.CityLabelOffsetH = 0;
        _this.CityLabelOffsetV = 50;
        _this.CityLabelOffsetV_MAX = 50;
        _this.LBS_TAG_SCALE_MAX = 1.3;
        _this.CAM = null;
        _this.RTXT = null;
        _this.MapSwitchThreshold = 200;
        _this.CityNodeList1 = new Array();
        _this.CityNodeList2 = new Array();
        _this.CityLabelList = new Array();
        _this.GlobeAutoSpinning = true;
        _this.GLOBE_AUTO_SPIN_SPEED = 90;
        _this.TouchingPoints = new Array();
        return _this;
        //#endregion
    }
    //#endregion
    //#region Lifecycle
    GlobeController.prototype.onLoad = function () {
        cc.game.addPersistRootNode(this.node);
        this.RegisterTouchEvent();
    };
    GlobeController.prototype.start = function () {
        // this.SF = this.FullWorldMap.spriteFrame;
        // this.TX = this.globe.dragonAtlasAsset.texture;
        // this.CaptureArea.setPosition(this.FullWorldMap.node.position);
        this.WorldMaps.scaleY = -1;
        this.LoadCity();
    };
    GlobeController.prototype.update = function (dt) {
        if (this.GlobeAutoSpinning) {
            var delta = this.GLOBE_AUTO_SPIN_SPEED * dt;
            this.DragMap(delta);
        }
    };
    //#endregion
    //#region Globe
    GlobeController.prototype.DragMap = function (delta_x) {
        this.WorldMaps.setPosition(this.WorldMaps.position.x + delta_x, 0);
        this.UpdateFullWorldMap();
    };
    GlobeController.prototype.UpdateFullWorldMap = function () {
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
        this.UpdateCities();
    };
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
        data.atlasJson = "\n            {\"width\":2000,\"height\":1000,\n            \"SubTexture\":[{\"name\":\"WorldMap\",\"x\":1,\"y\":1,\"width\":1000,\"height\":1000}],\n            \"name\":\"WorldMapDragon\",\"imagePath\":\"WorldMap.jpg\"}\n            ";
        this.globe.dragonAtlasAsset = data;
    };
    GlobeController.prototype.UpdateCities = function () {
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
                var distance_H_1 = Math.sin(angle_H) * radius;
                var scale = (1 + Math.abs(Math.cos(angle_H))) / 2;
                var offsetV = this.CityLabelOffsetV * scale;
                node.setPosition(distance_H_1 + this.CityLabelOffsetH, distance_V + offsetV);
                node.setScale(scale);
                node.opacity = scale * (opacity > 0 ? scale * 255 : 0);
                break;
            }
        }
    };
    GlobeController.prototype.OptimizeLBSTagSize = function (scale) {
        var proper_scale = this.LBS_TAG_SCALE_MAX / scale;
        if (scale > this.LBS_TAG_SCALE_MAX) {
            for (var _i = 0, _a = this.CityNodeList1; _i < _a.length; _i++) {
                var city = _a[_i];
                var wrapper = city.getChildByName("wrapper");
                wrapper.setScale(proper_scale);
            }
            for (var _b = 0, _c = this.CityNodeList2; _b < _c.length; _b++) {
                var city = _c[_b];
                var wrapper = city.getChildByName("wrapper");
                wrapper.setScale(proper_scale);
            }
            this.CityLabelOffsetV = this.CityLabelOffsetV_MAX * proper_scale;
            for (var _d = 0, _e = this.CityLabelList; _d < _e.length; _d++) {
                var city = _e[_d];
                var wrapper = city.getChildByName("wrapper");
                wrapper.setScale(proper_scale);
            }
        }
        else {
            // this.CityLabelOffsetV = this.CityLabelOffsetV_MAX;
        }
    };
    GlobeController.prototype.GlobeZoom = function (scale) {
        this.GlobePanel.setScale(scale);
        this.OptimizeLBSTagSize(scale);
    };
    //#endregion
    //#region City
    GlobeController.prototype.LoadCity = function () {
        this.AddCityNode("北京", 100, 200);
        this.AddCityNode("斐济", 300, -100);
        this.AddCityNode("东京", 0, 0);
        this.AddCityNode("Las Vagas", -100, -200);
        this.AddCityNode("布宜诺斯艾利斯", 400, 300);
        this.AddCityNode("Stockholm", -400, 100);
        this.AddCityNode("莫斯科", 500, 200);
        this.AddCityNode("巴厘岛", -500, 0);
        this.AddCityNode("Shenmi Island", 600, -100);
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
        city = cc.instantiate(this.CityLabelTemplate);
        var label = city.getComponentInChildren(cc.Label);
        label.string = cityName;
        city.name = cityName;
        this.CityLabelPanel.addChild(city);
        city.opacity = 0;
        this.CityLabelList.push(city);
    };
    GlobeController.prototype.CityTapped = function (city) {
        this.debug_label.string = city.name;
    };
    //#endregion
    //#region Touch Event
    GlobeController.prototype.RegisterTouchEvent = function () {
        var _this = this;
        // touch start
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            _this.GlobeAutoSpinning = false;
            // this.debug_label.string = "start" + e.getID().toString();
            _this.TrackTouchPoint(e.touch);
        }, this);
        // touch move
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var delta = e.touch.getDelta();
            if (_this.TouchingPoints.length == 1) {
                _this.DragMap(delta.x);
            }
            else if (_this.TouchingPoints.length == 2) {
                _this.TouchZoom();
            }
        }, this);
        // touch end
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
            _this.GlobeAutoSpinning = true;
            // this.debug_label.string = "end " + e.getID().toString();
            _this.TryRemoveTouchingPoint(e.touch);
        }, this);
        // touch cancel
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            _this.GlobeAutoSpinning = true;
            // this.debug_label.string = "cancel " + e.getID().toString();
            _this.TryRemoveTouchingPoint(e.touch);
        }, this);
    };
    GlobeController.prototype.TrackTouchPoint = function (touch) {
        this.TouchingPoints.push(touch);
    };
    GlobeController.prototype.TryRemoveTouchingPoint = function (touch) {
        var touch_id = touch.getID();
        var idx = 0;
        while (idx < this.TouchingPoints.length) {
            var id = this.TouchingPoints[idx].getID();
            if (id == touch_id) {
                this.TouchingPoints.splice(idx, 1);
                break;
            }
            else {
                idx++;
            }
        }
    };
    GlobeController.prototype.TouchZoom = function () {
        if (this.TouchingPoints.length == 2) {
            var old_location_1 = this.TouchingPoints[0].getPreviousLocation();
            var old_location_2 = this.TouchingPoints[1].getPreviousLocation();
            var new_location_1 = this.TouchingPoints[0].getLocation();
            var new_location_2 = this.TouchingPoints[1].getLocation();
            var x1 = old_location_1.x - old_location_2.x;
            var y1 = old_location_1.y - old_location_2.y;
            var x2 = new_location_1.x - new_location_2.x;
            var y2 = new_location_1.y - new_location_2.y;
            var old_area = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
            var new_area = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
            var factor = new_area / old_area;
            factor = 1 + (factor - 1) * 0.5;
            // this.debug_label.string = (new_area/old_area).toString();
            var scale = this.GlobePanel.scale * factor;
            this.GlobeZoom(scale);
        }
    };
    //#endregion
    //#region Test
    GlobeController.prototype.Test2 = function () {
        // let delta:cc.Vec2 = new cc.Vec2(-190,0);
        // this.DragMap(delta.x);
        this.GlobeZoom(this.GlobePanel.scale - 0.1);
    };
    GlobeController.prototype.Test3 = function () {
        this.GlobeZoom(this.GlobePanel.scale + 0.1);
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
        property(cc.Node)
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