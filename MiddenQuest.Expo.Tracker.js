// ==UserScript==
// @name         MidenQuest - Expo Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.6.1
// @description  MidenQuest - Market Tracker
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Expo.Tracker.js
// @updateURL    https://altizar.github.io/MiddenQuest.Expo.Tracker.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var expo_finished = 0;
var expo_navigate = 0;
var updateExpoTimeoutEvent = 0;
var updateExpoNavigateTimeoutEvent = 0;
var message = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getExpedition.aspx?null='); fightengaged = 0;\">Check Now</div>";
var message_2 = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">Check Now</div>";
var target = document.getElementById('ContentLoad');
var config = {attributes: true, childList: true, characterData: true};

jQuery('#TopScreen').prepend('<div id="expo_timer_parent" style="position: absolute;left: -120px;top: 40px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Expedition</div><br/><div><span id="expo_timer">Check Now</span></div></div></div>');
jQuery('#TopScreen').prepend('<div id="expo_timer_parent_2" style="position: absolute;left: -120px;top: 140px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Navigation</div><br/><div><span id="expo_timer_2">Check Now</span></div></div></div>');
function setExpoTimeout() {
    var time = jQuery('#ContentLoad > div:last-child > div > div:nth-child(2) > div > div > div > div:contains("min. left")').text().match('[0-9]*')[0];
    var curTime = jQuery.now();
    if (time !== "") {
        expo_finished = (parseInt(time) * 60 * 1000) + curTime;
        updateExpoTimeout();
        if (updateExpoTimeoutEvent === 0) {
            updateExpoTimeoutEvent = setInterval(updateExpoTimeout, 15000);
        }
    }
}
function setExpoNavigateTimeout() {
    var time = jQuery('#ContentLoad > div:nth-child(2) > div > div > div > div > div > div:last-child > div:last-child').text().trim().match('[0-9]*')[0];
    var curTime = jQuery.now();
    if (time !== "") {
        expo_navigate = (parseInt(time) * 60 * 1000) + curTime;
        updateExpoNavigateTimeout();
        if (updateExpoNavigateTimeoutEvent === 0) {
            updateExpoNavigateTimeoutEvent = setInterval(updateExpoNavigateTimeout, 15000);
        }
    }
}
function updateExpoTimeout() {
    var curTime = jQuery.now();
    if (curTime < expo_finished) {
        var myDate = new Date(null);
        var timeLeft = parseInt((expo_finished - curTime) / 1000);
        myDate.setHours(0);
        myDate.setSeconds(timeLeft);
        if (myDate.getHours() > 0) {
            message = myDate.getHours() + 'hr ' + myDate.getMinutes() + 'min';
        } else {
            message = myDate.getMinutes() + 'min';
        }
    } else if (expo_finished > 0) {
        if (updateExpoTimeoutEvent !== 0) {
            clearInterval(updateExpoTimeoutEvent);
            updateExpoTimeoutEvent = 0;
        }
        message = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getExpedition.aspx?null='); fightengaged = 0;\">Finished</div>";
        expo_finished = 0;
    }
    jQuery('#expo_timer').html(message);
}
function updateExpoNavigateTimeout() {
    var curTime = jQuery.now();
    if (curTime < expo_navigate) {
        var myDate = new Date(null);
        var timeLeft = parseInt((expo_navigate - curTime) / 1000);
        myDate.setHours(0);
        myDate.setSeconds(timeLeft);
        if (myDate.getHours() > 0) {
            message_2 = myDate.getHours() + 'hr ' + myDate.getMinutes() + 'min';
        } else {
            message_2 = myDate.getMinutes() + 'min';
        }
    } else if (expo_finished > 0) {
        if (updateExpoNavigateTimeoutEvent !== 0) {
            clearInterval(updateExpoNavigateTimeoutEvent);
            updateExpoNavigateTimeoutEvent = 0;
        }
        message_2 = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">Finished</div>";
        expo_navigate = 0;
    }
    jQuery('#expo_timer_2').html(message_2);
}
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            if (expo_finished === 0) {
                setExpoTimeout();
            }
            if (expo_navigate === 0) {
                setExpoNavigateTimeout();
            }
        }
    });
    jQuery('#expo_timer_2').html(message_2);
    jQuery('#expo_timer').html(message);
});
observer.observe(target, config);

