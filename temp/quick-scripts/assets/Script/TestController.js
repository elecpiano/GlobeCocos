(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/TestController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd2c06/Uv/1NPqyM2zFdMvtm', 'TestController', __filename);
// Script/TestController.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TestController = /** @class */ (function (_super) {
    __extends(TestController, _super);
    function TestController() {
        //#region Property
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.globe = null;
        return _this;
        //#endregion
    }
    //#endregion
    //#region Lifecycle
    TestController.prototype.onLoad = function () {
    };
    // start () {
    // }
    // update (dt) {
    // }
    //#endregion
    //#region Touch Event
    TestController.prototype.Test = function () {
        // this.globe.node.removeComponent(dragonBones.ArmatureDisplay);
        var asset = new dragonBones.DragonBonesAsset();
        asset.dragonBonesJson = "\n        {\"frameRate\":24,\"name\":\"WorldMapDragon\",\n        \"version\":\"5.5\",\"compatibleVersion\":\"5.5\",\n        \"armature\":[{\"type\":\"Armature\",\n            \"frameRate\":24,\"name\":\"Armature\",\n            \"aabb\":{\"x\":-248.8,\"y\":-274.08,\"width\":500,\"height\":500},\n            \"bone\":[{\"name\":\"root\"}],\"slot\":[{\"name\":\"WorldMapHalf\",\"parent\":\"root\"}],\n            \"skin\":[{\"slot\":[{\"name\":\"WorldMapHalf\",\"display\":[{\"type\":\"mesh\",\"name\":\"WorldMapHalf\",\"width\":500,\"height\":500,\n                \"vertices\":[-250,-250,250,-250,-250,250,250,250,-163.95,-160.3,-243.8,-91.35,-150.85,-0.9,-250,81,-142.45,169.45,164,164.2,250,85.5,151,0,250,-83.5,137.5,-162.5,1.85,-185,3.05,250,-110.55,-250,125.75,-250],\n                \"uvs\":[0,0,1,0,0,1,1,1,0,0.178,0,0.332,0,0.499,0,0.662,0,0.841,1,0.828,1,0.671,1,0.501,1,0.333,1,0.161,0.501,0,0.5061,1,0.2789,0,0.7515,0],\n                \"triangles\":[17,14,12,17,12,13,6,15,11,14,6,11,12,14,11,11,15,10,17,13,1,10,15,9,15,3,9,16,5,14,5,6,14,6,7,15,8,2,15,7,8,15,4,5,16,0,4,16],\n                \"edges\":[4,0,5,4,6,5,7,6,2,8,8,7,9,3,10,9,11,10,12,11,1,13,13,12,0,16,16,14,14,17,17,1,3,15,15,2],\n                \"userEdges\":[]}]}]}],\"defaultActions\":[{}]}]}\n        ";
        this.globe.dragonAsset = asset;
    };
    TestController.prototype.Test2 = function () {
        var display = new dragonBones.ArmatureDisplay();
        var asset = new dragonBones.DragonBonesAsset();
        asset.dragonBonesJson = "\n        {\"frameRate\":24,\"name\":\"WorldMapDragon\",\n        \"version\":\"5.5\",\"compatibleVersion\":\"5.5\",\n        \"armature\":[{\"type\":\"Armature\",\n            \"frameRate\":24,\"name\":\"Armature\",\n            \"aabb\":{\"x\":-248.8,\"y\":-274.08,\"width\":500,\"height\":500},\n            \"bone\":[{\"name\":\"root\"}],\"slot\":[{\"name\":\"WorldMapHalf\",\"parent\":\"root\"}],\n            \"skin\":[{\"slot\":[{\"name\":\"WorldMapHalf\",\"display\":[{\"type\":\"mesh\",\"name\":\"WorldMapHalf\",\"width\":500,\"height\":500,\n                \"vertices\":[-250,-250,250,-250,-250,250,250,250,-163.95,-160.3,-243.8,-91.35,-150.85,-0.9,-250,81,-142.45,169.45,164,164.2,250,85.5,151,0,250,-83.5,137.5,-162.5,1.85,-185,3.05,250,-110.55,-250,125.75,-250],\n                \"uvs\":[0,0,1,0,0,1,1,1,0,0.178,0,0.332,0,0.499,0,0.662,0,0.841,1,0.828,1,0.671,1,0.501,1,0.333,1,0.161,0.501,0,0.5061,1,0.2789,0,0.7515,0],\n                \"triangles\":[17,14,12,17,12,13,6,15,11,14,6,11,12,14,11,11,15,10,17,13,1,10,15,9,15,3,9,16,5,14,5,6,14,6,7,15,8,2,15,7,8,15,4,5,16,0,4,16],\n                \"edges\":[4,0,5,4,6,5,7,6,2,8,8,7,9,3,10,9,11,10,12,11,1,13,13,12,0,16,16,14,14,17,17,1,3,15,15,2],\n                \"userEdges\":[]}]}]}],\"defaultActions\":[{}]}]}\n        ";
        display.dragonAsset = asset;
        var atals = new dragonBones.DragonBonesAtlasAsset();
        atals.texture = null;
        atals.atlasJson = "\n            {\"imagePath\":\"WorldMapDragonTest1_tex.png\",\"width\":512,\"name\":\"WorldMapDragonTest1\",\"SubTexture\":[{\"x\":1,\"y\":1,\"width\":500,\"name\":\"WorldMapDragon\",\"height\":500}],\"height\":512}\n            ";
        display.dragonAtlasAsset = atals;
        // if (display.dragonAtlasAsset == null) {
        //     display.dragonAtlasAsset = null;
        //     console.log("xxx - ");
        // }
    };
    __decorate([
        property(dragonBones.ArmatureDisplay)
    ], TestController.prototype, "globe", void 0);
    TestController = __decorate([
        ccclass
    ], TestController);
    return TestController;
}(cc.Component));
exports.default = TestController;

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
        //# sourceMappingURL=TestController.js.map
        