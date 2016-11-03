// ==UserScript==
// @name         MidenQuest - Expo Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.7.0
// @description  MidenQuest - Market Tracker
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Expo.Tracker.js
// @updateURL    https://altizar.github.io/MiddenQuest.Expo.Tracker.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var MiddenQuest_Expo_Tracker = {
    expo_finished: 0,
    expo_navigate: 0,
    updateExpoTimeoutEvent: 0,
    updateExpoNavigateTimeoutEvent: 0,
    message: "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getExpedition.aspx?null='); fightengaged = 0;\">Check Now</div>",
    message_2: "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">Check Now</div>",
    target: document.getElementById('ContentLoad'),
    config: {attributes: true, childList: true, characterData: true},
    stock: {
        Ore_1: 0,
        Ore_2: 0,
        Ore_3: 0,
        Ore_4: 0,
        Ore_5: 0,
        Plant_1: 0,
        Plant_2: 0,
        Plant_3: 0,
        Plant_4: 0,
        Plant_5: 0,
        Wood_1: 0,
        Wood_2: 0,
        Wood_3: 0,
        Wood_4: 0,
        Wood_5: 0,
        Fish_1: 0,
        Fish_2: 0,
        Fish_3: 0,
        Fish_4: 0,
        Fish_5: 0
    },
    parse_value: function (text) {
        var num = parseFloat(text);
        if (text.indexOf('k') !== -1) {
            num *= 1e3;
        }
        if (text.indexOf('m') !== -1) {
            num *= 1e6;
        }
        return num;
    },
    getValue: function (target) {
        return parseInt(jQuery('#' + target).text().replace(' ', '').replace(' ', '').replace(' ', ''));
    },
    parseStock: function () {
        this.stock.Ore_1 = this.getValue('T1OreDesc');
        this.stock.Ore_2 = this.getValue('T2OreDesc');
        this.stock.Ore_3 = this.getValue('T3OreDesc');
        this.stock.Ore_4 = this.getValue('T4OreDesc');
        this.stock.Ore_5 = this.getValue('T5OreDesc');
        this.stock.Plant_1 = this.getValue('T1GatherDesc');
        this.stock.Plant_2 = this.getValue('T2GatherDesc');
        this.stock.Plant_3 = this.getValue('T3GatherDesc');
        this.stock.Plant_4 = this.getValue('T4GatherDesc');
        this.stock.Plant_5 = this.getValue('T5GatherDesc');
        this.stock.Wood_1 = this.getValue('T1WoodDesc');
        this.stock.Wood_2 = this.getValue('T2WoodDesc');
        this.stock.Wood_3 = this.getValue('T3WoodDesc');
        this.stock.Wood_4 = this.getValue('T4WoodDesc');
        this.stock.Wood_5 = this.getValue('T5WoodDesc');
        this.stock.Fish_1 = this.getValue('T1FishDesc');
        this.stock.Fish_2 = this.getValue('T2FishDesc');
        this.stock.Fish_3 = this.getValue('T3FishDesc');
        this.stock.Fish_4 = this.getValue('T4FishDesc');
        this.stock.Fish_5 = this.getValue('T5FishDesc');
    },
    copyTextToClipboard: function (text) {
        var copyArea = document.createElement("copyArea");
        copyArea.style.position = 'fixed';
        copyArea.style.top = 0;
        copyArea.style.left = 0;
        copyArea.style.width = '2em';
        copyArea.style.height = '2em';
        copyArea.style.padding = 0;
        copyArea.style.border = 'none';
        copyArea.style.outline = 'none';
        copyArea.style.boxShadow = 'none';
        copyArea.style.background = 'transparent';
        copyArea.setAttribute("id", "ContentLoadExtra");
        document.body.appendChild(copyArea);
        if (jQuery('#ShortcutRes1_1', '#ContentLoad').length === 1) {
            jQuery(copyArea).append(jQuery('#ContentLoad > div:last-child').html());
        }
        jQuery(copyArea).append(this.buildText());
        this.selectText('ContentLoadExtra');
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        jQuery(copyArea).empty();
        document.body.removeChild(copyArea);
    },
    selectText: function (containerid) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    },
    buildText: function () {
        return "\n<div class='col-md-3' id='T1Ore'>" + this.stock.Ore_1 + "</div>" +
                "<div class='col-md-3' id='T2Ore'>" + this.stock.Ore_2 + "</div>" +
                "<div class='col-md-3' id='T3Ore'>" + this.stock.Ore_3 + "</div>" +
                "<div class='col-md-3' id='T4Ore'>" + this.stock.Ore_4 + "</div>" +
                "<div class='col-md-3' id='T5Ore'>" + this.stock.Ore_5 + "</div>" +
                "<div class='col-md-3' id='T1Gather'>" + this.stock.Plant_1 + "</div>" +
                "<div class='col-md-3' id='T2Gather'>" + this.stock.Plant_2 + "</div>" +
                "<div class='col-md-3' id='T3Gather'>" + this.stock.Plant_3 + "</div>" +
                "<div class='col-md-3' id='T4Gather'>" + this.stock.Plant_4 + "</div>" +
                "<div class='col-md-3' id='T5Gather'>" + this.stock.Plant_5 + "</div>" +
                "<div class='col-md-3' id='T1Wood'>" + this.stock.Wood_1 + "</div>" +
                "<div class='col-md-3' id='T2Wood'>" + this.stock.Wood_2 + "</div>" +
                "<div class='col-md-3' id='T3Wood'>" + this.stock.Wood_3 + "</div>" +
                "<div class='col-md-3' id='T4Wood'>" + this.stock.Wood_4 + "</div>" +
                "<div class='col-md-3' id='T5Wood'>" + this.stock.Wood_5 + "</div>" +
                "<div class='col-md-3' id='T1Fish'>" + this.stock.Fish_1 + "</div>" +
                "<div class='col-md-3' id='T2Fish'>" + this.stock.Fish_2 + "</div>" +
                "<div class='col-md-3' id='T3Fish'>" + this.stock.Fish_3 + "</div>" +
                "<div class='col-md-3' id='T4Fish'>" + this.stock.Fish_4 + "</div>" +
                "<div class='col-md-3' id='T5Fish'>" + this.stock.Fish_5 + "</div>" +
                "<br style='clear: both'/><br style='clear: both'/><br style='clear: both'/>";
    },
    setExpoTimeout: function () {
        var time = jQuery('#ContentLoad > div:last-child > div > div:nth-child(2) > div > div > div > div:contains("min. left")').text().match('[0-9]*')[0];
        var curTime = jQuery.now();
        if (time !== "") {
            this.expo_finished = (parseInt(time) * 60 * 1000) + curTime;
            this.updateExpoTimeout();
            if (this.updateExpoTimeoutEvent === 0) {
                this.updateExpoTimeoutEvent = setInterval(MiddenQuest_Expo_Tracker.updateExpoTimeout, 15000);
            }
        }
    },
    setExpoNavigateTimeout: function () {
        var time = jQuery('#ContentLoad > div:nth-child(2) > div > div > div > div > div > div:last-child > div:last-child').text().trim().match('[0-9]*')[0];
        var curTime = jQuery.now();
        if (time !== "") {
            this.expo_navigate = (parseInt(time) * 60 * 1000) + curTime;
            this.updateExpoNavigateTimeout();
            if (this.updateExpoNavigateTimeoutEvent === 0) {
                this.updateExpoNavigateTimeoutEvent = setInterval(MiddenQuest_Expo_Tracker.updateExpoNavigateTimeout, 15000);
            }
        }
    },
    updateExpoTimeout: function () {
        var curTime = jQuery.now();
        if (curTime < this.expo_finished) {
            var myDate = new Date(null);
            var timeLeft = parseInt((this.expo_finished - curTime) / 1000);
            myDate.setHours(0);
            myDate.setSeconds(timeLeft);
            if (myDate.getHours() > 0) {
                this.message = myDate.getHours() + 'hr ' + myDate.getMinutes() + 'min';
            } else {
                this.message = myDate.getMinutes() + 'min';
            }
        } else if (this.expo_finished > 0) {
            if (this.updateExpoTimeoutEvent !== 0) {
                clearInterval(this.updateExpoTimeoutEvent);
                this.updateExpoTimeoutEvent = 0;
            }
            this.message = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getExpedition.aspx?null='); fightengaged = 0;\">Finished</div>";
            this.expo_finished = 0;
        }
        jQuery('#expo_timer').html(this.message);
    },
    updateExpoNavigateTimeout: function () {
        var curTime = jQuery.now();
        if (curTime < this.expo_navigate) {
            var myDate = new Date(null);
            var timeLeft = parseInt((this.expo_navigate - curTime) / 1000);
            myDate.setHours(0);
            myDate.setSeconds(timeLeft);
            if (myDate.getHours() > 0) {
                this.message_2 = myDate.getHours() + 'hr ' + myDate.getMinutes() + 'min';
            } else {
                this.message_2 = myDate.getMinutes() + 'min';
            }
        } else if (this.expo_finished > 0) {
            if (this.updateExpoNavigateTimeoutEvent !== 0) {
                clearInterval(this.updateExpoNavigateTimeoutEvent);
                this.updateExpoNavigateTimeoutEvent = 0;
            }
            this.message_2 = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">Finished</div>";
            this.expo_navigate = 0;
        }
        jQuery('#expo_timer_2').html(this.message_2);
    },
    start: function () {
        jQuery('#TopScreen').prepend('<div id="expo_timer_parent" style="position: absolute;left: -120px;top: 20px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Expedition</div><br/><div><span id="expo_timer">Check Now</span></div></div></div>');
        jQuery('#TopScreen').prepend('<div id="expo_copy" style="position: absolute;left: -120px;top: 120px;color: black;" class=""><button id="btnSendExp" class="darkBtn ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" style="width:100px; height:45px; font-size: 10pt;" role="button" aria-disabled="false"><span class="ui-button-text">Copy Market</span></button></div>');
        jQuery('#TopScreen').prepend('<div id="expo_timer_parent_2" style="position: absolute;left: -120px;top: 180px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Navigation</div><br/><div><span id="expo_timer_2">Check Now</span></div></div></div>');
        jQuery('#expo_timer_2').html(this.message_2);
        jQuery('#expo_timer').html(this.message);
        this.copyBtn = document.querySelector('#expo_copy');
        this.copyBtn.addEventListener('click', function (event) {
            MiddenQuest_Expo_Tracker.parseStock();
            var text = MiddenQuest_Expo_Tracker.buildText();
            MiddenQuest_Expo_Tracker.copyTextToClipboard(text);
        });
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    if (MiddenQuest_Expo_Tracker.expo_finished === 0) {
                        MiddenQuest_Expo_Tracker.setExpoTimeout();
                    }
                    if (MiddenQuest_Expo_Tracker.expo_navigate === 0) {
                        MiddenQuest_Expo_Tracker.setExpoNavigateTimeout();
                    }
                }
            });
        });
        observer.observe(this.target, this.config);
    }
};
MiddenQuest_Expo_Tracker.start();
