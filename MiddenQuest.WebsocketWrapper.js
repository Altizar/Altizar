// ==UserScript==
// @name         MidenQuest - WebsocketWrapper
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.7
// @description  MidenQuest - Expo Send Highlighter
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.WebsocketWrapper.js
// @updateURL    https://altizar.github.io/MiddenQuest.WebsocketWrapper.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var MQO_WebsocketWrapper = {
    websocket : null,
    ws : null,
    callbacks : [],
    start : function(websocket) {
        console.log(websocket);
        this.websocket = websocket;
        this.ws = websocket;
        this.callbacks = [];
        this.addCallback(ws.onmessage);
        this.ws.onmessage = this.onMessage;
    },
    addCallback : function(callback) {
        return this.callbacks.push(callback);
    },
    onMessage : function(event) {
        var callback, i, len, ref, results;
        ref = MQO_WebsocketWrapper.callbacks;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            callback = ref[i];
            results.push(callback.call(this, event));
        }
        return results;
    },
    WebSocketLogger : function(data) {
        console.log(data);
    }
};

MQO_WebsocketWrapper.start(ws);
//MQO_WebsocketWrapper.addCallback(MQO_WebsocketWrapper.WebSocketLogger);
if (unsafeWindow.MQO_WebsocketWrapper === undefined) {
    unsafeWindow.MQO_WebsocketWrapper = MQO_WebsocketWrapper;
}

