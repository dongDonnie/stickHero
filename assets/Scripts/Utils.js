var Utils = function () {
    /**
     * 同一父节点下的多个节点,不能用相同的节点名称
     * 所有的组件名称都加"_"
     * 获取到的脚本组件可以拿到组件内的全局变量
     * 不能将bindNode返回的值转换成string
     */
    var bindNode = function (node) {
        var obj = {};
        obj._Node = node;
        var _getComps = function (obj, node) {
            var _comp = null;
            for (let i = 0; i < node._components.length; i++) {
                _comp = node._components[i];
                var nm = _comp.name;
                if (_comp.name.indexOf("<") !== -1) {
                    nm = _comp.name.split("<")[1];
                    nm = nm.slice(0, nm.length - 1);
                }
                obj["_" + nm] = _comp;
            }
        };

        var _getChildNode = function (obj, node) {
            obj[node.name] = {};
            obj[node.name]._Node = node;
            _getComps(obj[node.name], node);
            for (let i = 0; i < node.childrenCount; i++) {
                _getChildNode(obj[node.name], node.children[i]);
            }
        };

        _getComps(obj, node);
        for (let i = 0; i < node.childrenCount; i++) {
            _getChildNode(obj, node.children[i]);
        }
        return obj;
    };

    /**
     * 注册点击事件
     */
    var addClickEvent = function (node, _EventList, _EventData, _EventID) {
        // var _EventList = [{
        //     _targetObj: this.node, //事件所在节点
        //     _targetName: "shop", //事件所在脚本名称
        //     _handlerName: "bugGold", //事件名
        // }];
        _EventID = isNaN(_EventID) ? 0 : _EventID;
        if (node._Button) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = _EventList[_EventID]._targetObj;
            clickEventHandler.component = _EventList[_EventID]._targetName;
            clickEventHandler.handler = _EventList[_EventID]._handlerName;
            clickEventHandler.customEventData = _EventData;
            node._Button.clickEvents.push(clickEventHandler);
        }
    };

    /**
     * 判断数组、字符串、对象是否为空
     */
    var isEmpty = function (json) {
        if (json === null || json === undefined) return true;
        else if (json === "null" || json === "undefined") return true;
        else if (json instanceof Array) return json.length === 0;
        else if (typeof (json) === 'string') return json.length === 0;
        else if (typeof (json) === 'object') {
            for (var key in json) return false;
        }
        return false;
    };

    /**
     * 记录日志
     */
    var logList = [];
    var pushLog = function (str) {
        if (str == null || !str.length) return;
        if (logList.length > 80) {
            logList.shift();
        }
        logList.push(str);
    };
    /**
     * 打印日志
     */
    var consoleList = function () {
        let str = '';
        for (let i = logList.length - 1; i >= 0; i--) {
            str += '\n【' + i + '】' + logList[i];
        }
        return str;
    };

    /**
     * 根据英文字符粗略省略方式(一个中文算两个英文宽)
     * str 要处理的字符串
     * lens (英文)字符个数
     * strEnd 超出该宽度时后面追加的结尾字符串
     */
    var interceptStr = function (str, lens, strEnd) {
        if (str == null)
            return '';
        if (strEnd == undefined) strEnd = '';
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c >= 0 && c <= 128)
                len++;
            else
                len += 2;
            if (len > lens)
                return str.substr(0, i) + strEnd;
        }
        return str;
    };

    /**
     * isnet 是否是远程资源
     */
    var urlLoadImage = function (url, node, isnet) {
        if (isnet) {
            cc.loader.load(url, function (err, texture) {
                if (err) {
                    cc.log("加载图片失败");
                    return;
                }
                var frame = new cc.SpriteFrame(texture);
                node.getComponent(cc.Sprite).spriteFrame = frame;
            });
        } else {
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log("加载图片失败");
                    return;
                }
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    };

    /**
     * 将不同的对象列表整合到一起 
     * 例: combineList({"a":1,"b":2}, {"c":3}, {"d":4}) ==> {"a":1,"b":2,"c":3,"d":4}
     */
    var combineList = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (i > 0) {
                for (var p in arguments[i]) {
                    if (arguments[i].hasOwnProperty(p) && (!arguments[0].hasOwnProperty(p)))
                        arguments[0][p] = arguments[i][p];
                }
            }
        }
        if (arguments.length > 0) {
            return arguments[0];
        }
    };

    /**
     * 获取一个len长度的随机数
     */
    var getRandomNum = function (len) {
        var str = "";
        for (let i = 0; i < len; i++) {
            str += Math.round(Math.random() * 9);
        }
        return str;
    };

    /**
     * 获取范围内的随机值
     */
    var getRandomFrom = function (n1, n2) {
        let min = 0,
            max = 1000;

        if (n1 == undefined) {
            return Math.floor(Math.random() * max);
        }

        if (n1 === n2) return n1;

        if (n2 == undefined)
            n2 = 0;

        if (n1 < n2) {
            min = n1;
            max = n2;
        } else {
            min = n2;
            max = n1;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var onContinueClick = function () {
        let nowTime = (new Date()).getTime();
        if (this._debugLastClickTime == undefined) {
            this._debugLastClickTime = nowTime;
            this._clickDebugCount = 1;
        } else {
            if (nowTime - this._debugLastClickTime > 1000) {
                this._debugLastClickTime = nowTime;
                this._clickDebugCount = 1;
            } else if (++this._clickDebugCount === 10) {
                this._clickDebugCount = 0;
                cc.log("连续点击");
            }
            this._debugLastClickTime = nowTime;
        }
    };

    return {
        bindNode: bindNode,
        isEmpty: isEmpty,
        pushLog: pushLog,
        consoleList: consoleList,
        interceptStr: interceptStr,
        urlLoadImage: urlLoadImage,
        combineList: combineList,
        getRandomNum: getRandomNum,
        getRandomFrom: getRandomFrom,
        onContinueClick: onContinueClick,
    }
}()
module.exports = Utils;