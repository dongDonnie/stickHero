var websocket = require("websocket");
var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        btn: cc.Button,
        btn2: cc.Button,
    },

    ctor: function () {
        cc.CMD = ["configs", "login", "tuser"];
    },

    onLoad() {
        cc.webUrl = "ws://mj.uat.deecent.com:9070/config_service/websocket";
        // var url = "http://chessgame.gamezoo.cn:18081";
        this.hallNetworker = new websocket();
        this.hallNetworker.connect(cc.webUrl);

        this.hallNetworker.addHandler("configs", this.configsback, this);
        this.hallNetworker.addHandler("login", this.loginback, this);
        var obj = Utils.bindNode(this.node,this.name);
        cc.log(obj);
    },

    configsback: function (data) {
        // cc.log(data);
        if (data._IsS) {
            cc.webUrl = "ws://mj.uat.deecent.com:9066/fight_service/websocket";
            this.hallNetworker.close();
            this.hallNetworker.connect(cc.webUrl);
        }
    },

    loginback: function (data) {
        // cc.log(data);
    },

    onDestroy: function () {
        this.hallNetworker.removeHandler("configs", this);
        this.hallNetworker.removeHandler("login", this);
    },

    clickbtn: function () {
        var data = {
            "_Cmd": "tuser",
            "_Data": null,
            "_PID": "80016995"
        }
        this.hallNetworker.sendRequest(data);
    },

    clickbtn2: function () {
        var data = {
            "_Cmd": "configs",
            "_Data": {
                "_Version": "v_1.2"
            }
        }
        this.hallNetworker.sendRequest(data);
    },

});