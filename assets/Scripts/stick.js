var Utils = require("Utils");
cc.Class({
    extends: cc.Component,
    properties: {
        // speed: 10,
    },

    onLoad() {

    },

    setMgr(obj) {
        this.Obj = obj;
    },

    growUp: function () {
        if (!this.Obj.alive||!this.Obj.stop) return
        var that = this;
        var speed = 2;
        this.sI = setInterval(function () {
            that.node.height += speed + 1;
            speed += 0.5;
        }, 30);
    },

    rotation: function () {
        if (!this.Obj.alive || !this.Obj.stop) return;
        clearInterval(this.sI);
        var action = cc.rotateTo(1, 90);
        var action1 = cc.delayTime(0.1);
        var action2 = cc.callFunc(() => {
            this.Obj.player._player.walk();
        })
        this.Obj.sticklen = this.node.height;
        var seq = cc.sequence(action, action1, action2);
        this.node.runAction(seq);
    },

    stopWalk: function () {
        this.node.active = false;
        setTimeout(() => {
            this.node.active = true;
            this.node.rotation = 0;
            this.node.height = 104;
        }, 1000);

    },
});