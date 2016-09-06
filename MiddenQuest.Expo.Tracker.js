// ==UserScript==
// @name         MidenQuest - Expo Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.1
// @description  MidenQuest - Market Tracker
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Expo.Tracker.js
// @updateURL    https://altizar.github.io/MiddenQuest.Expo.Tracker.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var expo_finished = 0;
jQuery('#TopScreen').prepend('<div id="expo_timer_parent" style="position: absolute;left: -120px;top: 40px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><div>Expedition</div><div><span id="expo_timer">Check Now</span></div></div></div>');
function setExpoTimeout() {
    var time = jQuery('#ContentLoad > div:last-child > div > div:nth-child(2) > div > div > div > div:contains("min. left")').text().match('[0-9]*')[0];
    var curTime = jQuery.now();
    if (time !== "") {
        expo_finished = (parseInt(time) * 60 * 1000) + curTime;
        updateExpoTimeout();
    }
}

function updateExpoTimeout() {
    var curTime = jQuery.now();
    var message = "Finished";
    if (curTime < expo_finished) {
        var time = new Date();
        var myDate = new Date(null);
        var timeLeft = parseInt((expo_finished - curTime) / 1000);
        myDate.setHours(0);
        myDate.setSeconds(timeLeft);
        console.log(timeLeft);
        if (myDate.getHours() > 0) {
            message = myDate.getHours() + 'hr ' + myDate.getMinutes() + 'min';
        } else {
            message = myDate.getMinutes() + 1 + 'min';
        }
    }
    jQuery('#expo_timer').text(message);
}
var updateExpoTimeoutEvent = setInterval(updateExpoTimeout, 1000);
var updateExpoTimeoutEvent = setInterval(setExpoTimeout, 15000);