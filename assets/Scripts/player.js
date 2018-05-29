var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.startpos = this.node.getPosition();
        this.Obj.stop = true;
    },

    setMgr(obj) {
        this.Obj = obj;
    },

    init: function () {
        var endpos = new cc.Vec2(this.startpos.x, -250);
        var action1 = cc.moveTo(0.5, endpos);
        this.node.stopAllActions();
        this.node.runAction(action1);
    },

    walk: function () {
        cc.log(this.Obj.sticklen);
        if (!this.Obj.stop) return;
        this.Obj.stop = false;
        var stoppos = this.Obj.sticklen+5;
        if ((this.Obj.sticklen + this.Obj.stagelen) >= 273 && this.Obj.sticklen <= 273) {
            stoppos = 273;
        }
        var endpos = new cc.Vec2(stoppos, 0);
        var action1 = cc.moveBy(1, endpos);
        var action2 = cc.callFunc(() => {
            this.stopWalk();
        })
        var seq = cc.sequence(action1, action2);
        this.node.stopAllActions();
        this.node.runAction(seq);
    },

    stopWalk: function () {
        this.Obj.stop = true;
        var endpos = new cc.Vec2(-273, 0);
        this.node.stopAllActions();
        setTimeout(() => {
            if (this.Obj.alive) {
                this.node.runAction(cc.moveBy(1, endpos));
                this.Obj.stick._stick.stopWalk();
                this.Obj._gamemanager.stopWalk();
            } else {
                this.dropOut();
            }
        }, 500);
    },

    dropOut: function () {
        this.Obj.end._Node.active = true;
    },

    update: function (dt) {
        if (this.Obj.stop && this.Obj.sticklen > 50 && this.node.x > -293 && this.Obj.alive) {
            if ((this.Obj.sticklen - 273) < -this.Obj.stagelen||this.Obj.sticklen>273) {
                cc.log('掉了');
                cc.log(this.Obj.sticklen + this.Obj.stagelen + "<273,   " + this.Obj.sticklen + ">273");
                this.Obj.alive = false;
            }
        }
    },
});