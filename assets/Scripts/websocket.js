// cc.Class({
//     extends: cc.Component,
//     properties: {},

//     onLoad: function(){

//     },

//     openConnect: function () {
//         this._wsObj = new WebSocket("ws://" + cc.webUrl);
//         // console.log(this._wsObj);
//         this._wsObj.opopen = function (evt) {
//             cc.log(evt);
//         }
//         this._wsObj.onmessage = function (evt) {
//             var CMD = cc.CMD;
//             var data = evt.data;
//             data = JSON.parse(data);
//             if (CMD.indexOf(data._Cmd) !== -1) {
//                 this.target.node.emit(data._Cmd+"_S", data);
//             }
//         }.bind(this);
//         this._wsObj.onclose = function (evt) {
//             cc.log(evt);
//         }
//     },

//     sendRequest: function (data, target) {
//         var CMD = cc.CMD;
//         if (CMD.indexOf(data._Cmd) !== -1) {
//             this.target = target;
//             var data = JSON.stringify(data);
//             this._wsObj.send(data);
//         } else {
//             cc.alert.msg("未注册事件");
//         }
//     },

//     isOpen: function () {
//         return (this._wsObj && this._wsObj.readyState == WebSocket.OPEN);
//     },
// });

var netWork = function () {
    var _socket = null;
    var _states = 0;
    var _listenerMap = [];

    var _connect = function (url) {
        _socket = new WebSocket(url);
        _socket.onopen = _onopen;
        _socket.onmessage = _onmessage;
        _socket.onerror = _onerror;
        _socket.onclose = _onclose;
        _states = 1;
    };
    
    var _onopen = function () {
        _states = 2;
    };
    var _onmessage = function (evt) {
        try {
            //todo 心跳重置
            var msgStr = evt.data;
            var message = JSON.parse(msgStr);
            var opcode = message._Cmd;
            cc.log("【RECEIVE】 " + msgStr);
            for (let i = 0; i < _listenerMap.length; i++) {
                if (opcode === _listenerMap[i].Code) {
                    _listenerMap[i].cb.call(_listenerMap[i].target, message);
                    break;
                }
            }
        } catch (e) {
            cc.error(e.name + ": " + e.message);
        }
    };
    var _onerror = function (evt) {
        cc.error("websocket error！");
        _states = 3;
    };
    var _onclose = function (evt) {
        _states = 4;
        _socket = null;
    };

    var _sendRequest = function (data) {
        if (_states !== 2) {
            cc.error("websocket is not connected, connect states : " + _states);
            return;
        }
        data = data || {};
        if (typeof data != 'object') {
            cc.error("data is error");
            return;
        }
        var msg = JSON.stringify(data);
        cc.log("【SEND】 " + msg);
        _socket.send(msg);
    };

    var _addHandler = function (msgCode, selector, handleTarget) {
        let map = {
            "Code": msgCode,
            "cb": selector,
            "target": handleTarget
        };
        _listenerMap.push(map);
    };

    var _removeHandler = function (msgCode, handleTarget) {
        for (let i = 0; i < _listenerMap.length; i++) {
            if (_listenerMap[i].Code === msgCode) {
                _listenerMap.splice(i, 1);
                break;
            }
        }
    }
    return {
        connect: _connect,
        close:_onclose,
        addHandler: _addHandler,
        removeHandler: _removeHandler,
        sendRequest: _sendRequest,
    }
}

module.exports = netWork;