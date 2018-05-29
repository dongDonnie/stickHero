var Utils = require("Utils");
cc.Class({
    extends: cc.Component,
    properties: {
        stagePrefab:cc.Prefab,
    },

    onLoad: function () {
        this.Obj = Utils.bindNode(this.node);
        this.Obj.sticklen = 50;
        this.Obj.alive = true;
        this.playerScript = this.Obj.player._player;
        this.stickScript = this.Obj.stick._stick;
        this.playerScript.setMgr(this.Obj);
        this.stickScript.setMgr(this.Obj);
        this.node.on("touchstart", this.touchstart, this);
        this.node.on("touchend", this.touchend, this);
        this.node.on("touchcancel", this.touchend, this);
        this.createStage();
        this.Obj.end._Node.active = false;
    },

    start: function (){
        this.playerScript.init();
    },

    touchstart: function () {
        this.stickScript.growUp();
    },

    touchend: function () {
        this.stickScript.rotation();
    },

    createStage: function (){
        var len = Utils.getRandomFrom(50, 150);
        this.Obj.stagelen = len;
        var item = cc.instantiate(this.stagePrefab);
        item.parent = this.node.getChildByName("stages");
        item.width = len;
        item.setPosition(0, -267);
        this.Obj.lastPos = item.getPosition();
    },

    stopWalk: function () {
        var endpos = new cc.Vec2(-273, 0);
        for (let i = 0; i < this.Obj.stages._Node.childrenCount; i++) {
            var stage = this.Obj.stages._Node.children[i];
            if (stage.x > -400) {
                stage.runAction(cc.moveBy(1,endpos));
            } else {
                stage.removeFromParent();
            }
        }
        setTimeout(() => {
            this.createStage();
        }, 1200);
    },

    restart: function (){
        cc.director.loadScene("test1");
    },
});