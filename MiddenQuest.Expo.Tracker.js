// ==UserScript==
// @name         MidenQuest - Expo Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.9.3
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
    updatePerkTimeoutEvent: 0,
    message: "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getExpedition.aspx?null='); fightengaged = 0;\">Check Now</div>",
    message_2: "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">Check Now</div>",
    message_3: "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getEventShop.aspx?null='); fightengaged = 0;\">Check Now</div>",
    message_4: "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getInfoPerk.aspx?null='); fightengaged = 0;\">Check Perks</div>",
    target: document.getElementById('ContentLoad'),
    config: {attributes: true, childList: true, characterData: true},
    perks: {},
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
    calcTimeout: function (timeleft) {
        var toReturn = "";
        var curTime = jQuery.now();
        var myDate = new Date(null);
        var timeLeft = Math.ceil((timeleft - curTime) / 1000);
        myDate.setUTCHours(0);
        myDate.setUTCSeconds(timeLeft);
        var showTime = false;
        if (myDate.getUTCDate() > 2) {
            toReturn += myDate.getUTCDate() - 1 + "days ";
            showTime = true;
        } else if (myDate.getUTCDate() === 2) {
            toReturn += myDate.getUTCDate() - 1 + "day ";
            showTime = true;
        }
        if (myDate.getUTCHours() === 1) {
            toReturn += myDate.getUTCHours() + "hr ";
        } else if (myDate.getUTCHours() > 0 || showTime) {
            toReturn += myDate.getUTCHours() + "hrs ";
        }
        if (myDate.getUTCMinutes() <= 1) {
            toReturn += myDate.getUTCMinutes() + "min";
        } else {
            toReturn += myDate.getUTCMinutes() + "mins";
        }
        return toReturn;
    },
    parseStock: function () {
        MiddenQuest_Expo_Tracker.stock.Ore_1 = MiddenQuest_Expo_Tracker.getValue('T1OreDesc');
        MiddenQuest_Expo_Tracker.stock.Ore_2 = MiddenQuest_Expo_Tracker.getValue('T2OreDesc');
        MiddenQuest_Expo_Tracker.stock.Ore_3 = MiddenQuest_Expo_Tracker.getValue('T3OreDesc');
        MiddenQuest_Expo_Tracker.stock.Ore_4 = MiddenQuest_Expo_Tracker.getValue('T4OreDesc');
        MiddenQuest_Expo_Tracker.stock.Ore_5 = MiddenQuest_Expo_Tracker.getValue('T5OreDesc');
        MiddenQuest_Expo_Tracker.stock.Plant_1 = MiddenQuest_Expo_Tracker.getValue('T1GatherDesc');
        MiddenQuest_Expo_Tracker.stock.Plant_2 = MiddenQuest_Expo_Tracker.getValue('T2GatherDesc');
        MiddenQuest_Expo_Tracker.stock.Plant_3 = MiddenQuest_Expo_Tracker.getValue('T3GatherDesc');
        MiddenQuest_Expo_Tracker.stock.Plant_4 = MiddenQuest_Expo_Tracker.getValue('T4GatherDesc');
        MiddenQuest_Expo_Tracker.stock.Plant_5 = MiddenQuest_Expo_Tracker.getValue('T5GatherDesc');
        MiddenQuest_Expo_Tracker.stock.Wood_1 = MiddenQuest_Expo_Tracker.getValue('T1WoodDesc');
        MiddenQuest_Expo_Tracker.stock.Wood_2 = MiddenQuest_Expo_Tracker.getValue('T2WoodDesc');
        MiddenQuest_Expo_Tracker.stock.Wood_3 = MiddenQuest_Expo_Tracker.getValue('T3WoodDesc');
        MiddenQuest_Expo_Tracker.stock.Wood_4 = MiddenQuest_Expo_Tracker.getValue('T4WoodDesc');
        MiddenQuest_Expo_Tracker.stock.Wood_5 = MiddenQuest_Expo_Tracker.getValue('T5WoodDesc');
        MiddenQuest_Expo_Tracker.stock.Fish_1 = MiddenQuest_Expo_Tracker.getValue('T1FishDesc');
        MiddenQuest_Expo_Tracker.stock.Fish_2 = MiddenQuest_Expo_Tracker.getValue('T2FishDesc');
        MiddenQuest_Expo_Tracker.stock.Fish_3 = MiddenQuest_Expo_Tracker.getValue('T3FishDesc');
        MiddenQuest_Expo_Tracker.stock.Fish_4 = MiddenQuest_Expo_Tracker.getValue('T4FishDesc');
        MiddenQuest_Expo_Tracker.stock.Fish_5 = MiddenQuest_Expo_Tracker.getValue('T5FishDesc');
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
        jQuery(copyArea).append(MiddenQuest_Expo_Tracker.buildText());
        MiddenQuest_Expo_Tracker.selectText('ContentLoadExtra');
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
        var range;
        if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    },
    buildText: function () {
        return "\n<div class='col-md-3' id='T1Ore'>" + MiddenQuest_Expo_Tracker.stock.Ore_1 + "</div>" +
                "<div class='col-md-3' id='T2Ore'>" + MiddenQuest_Expo_Tracker.stock.Ore_2 + "</div>" +
                "<div class='col-md-3' id='T3Ore'>" + MiddenQuest_Expo_Tracker.stock.Ore_3 + "</div>" +
                "<div class='col-md-3' id='T4Ore'>" + MiddenQuest_Expo_Tracker.stock.Ore_4 + "</div>" +
                "<div class='col-md-3' id='T5Ore'>" + MiddenQuest_Expo_Tracker.stock.Ore_5 + "</div>" +
                "<div class='col-md-3' id='T1Gather'>" + MiddenQuest_Expo_Tracker.stock.Plant_1 + "</div>" +
                "<div class='col-md-3' id='T2Gather'>" + MiddenQuest_Expo_Tracker.stock.Plant_2 + "</div>" +
                "<div class='col-md-3' id='T3Gather'>" + MiddenQuest_Expo_Tracker.stock.Plant_3 + "</div>" +
                "<div class='col-md-3' id='T4Gather'>" + MiddenQuest_Expo_Tracker.stock.Plant_4 + "</div>" +
                "<div class='col-md-3' id='T5Gather'>" + MiddenQuest_Expo_Tracker.stock.Plant_5 + "</div>" +
                "<div class='col-md-3' id='T1Wood'>" + MiddenQuest_Expo_Tracker.stock.Wood_1 + "</div>" +
                "<div class='col-md-3' id='T2Wood'>" + MiddenQuest_Expo_Tracker.stock.Wood_2 + "</div>" +
                "<div class='col-md-3' id='T3Wood'>" + MiddenQuest_Expo_Tracker.stock.Wood_3 + "</div>" +
                "<div class='col-md-3' id='T4Wood'>" + MiddenQuest_Expo_Tracker.stock.Wood_4 + "</div>" +
                "<div class='col-md-3' id='T5Wood'>" + MiddenQuest_Expo_Tracker.stock.Wood_5 + "</div>" +
                "<div class='col-md-3' id='T1Fish'>" + MiddenQuest_Expo_Tracker.stock.Fish_1 + "</div>" +
                "<div class='col-md-3' id='T2Fish'>" + MiddenQuest_Expo_Tracker.stock.Fish_2 + "</div>" +
                "<div class='col-md-3' id='T3Fish'>" + MiddenQuest_Expo_Tracker.stock.Fish_3 + "</div>" +
                "<div class='col-md-3' id='T4Fish'>" + MiddenQuest_Expo_Tracker.stock.Fish_4 + "</div>" +
                "<div class='col-md-3' id='T5Fish'>" + MiddenQuest_Expo_Tracker.stock.Fish_5 + "</div>" +
                "<br style='clear: both'/><br style='clear: both'/><br style='clear: both'/>";
    },
    setExpoTimeout: function () {
        var timeDiv = jQuery('#ContentLoad > div:last-child > div > div:nth-child(2) > div > div > div > div:contains("min. left")').text();
        if (timeDiv === "") {
            return;
        }
        time = timeDiv.match('[0-9]*')[0];
        var curTime = jQuery.now();
        if (time !== "") {
            MiddenQuest_Expo_Tracker.expo_finished = (parseInt(time) * 60 * 1000) + curTime;
            MiddenQuest_Expo_Tracker.updateExpoTimeout();
            if (MiddenQuest_Expo_Tracker.updateExpoTimeoutEvent === 0) {
                MiddenQuest_Expo_Tracker.updateExpoTimeoutEvent = setInterval(function () {
                    MiddenQuest_Expo_Tracker.updateExpoTimeout();
                }, 15000);
            }
        }
    },
    updateExpoTimeout: function () {
        var curTime = jQuery.now();
        if (curTime < MiddenQuest_Expo_Tracker.expo_finished) {
            MiddenQuest_Expo_Tracker.message = MiddenQuest_Expo_Tracker.calcTimeout(MiddenQuest_Expo_Tracker.expo_finished);
        } else if (MiddenQuest_Expo_Tracker.expo_finished > 0) {
            if (MiddenQuest_Expo_Tracker.updateExpoTimeoutEvent !== 0) {
                clearInterval(MiddenQuest_Expo_Tracker.updateExpoTimeoutEvent);
                MiddenQuest_Expo_Tracker.updateExpoTimeoutEvent = 0;
            }
            MiddenQuest_Expo_Tracker.message = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getExpedition.aspx?null='); fightengaged = 0;\">Finished</div>";
            MiddenQuest_Expo_Tracker.expo_finished = 0;
        }
        jQuery('#expo_timer').html(MiddenQuest_Expo_Tracker.message);
    },
    setExpoNavigateTimeout: function () {
        var text = jQuery('#ContentLoad > div:nth-child(2) > div > div > div > div > div > div:last-child > div:last-child').text().trim();
        if (text === "You have no pending expedition") {
            MiddenQuest_Expo_Tracker.message_2 = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">No Expo</div>";
            jQuery('#expo_timer_2').html(MiddenQuest_Expo_Tracker.message_2);
        } else {
            var time = text.match('[0-9]*')[0];
            var curTime = jQuery.now();
            if (time !== "") {
                MiddenQuest_Expo_Tracker.expo_navigate = (parseInt(time) * 60 * 1000) + curTime;
                MiddenQuest_Expo_Tracker.updateExpoNavigateTimeout();
                if (MiddenQuest_Expo_Tracker.updateExpoNavigateTimeoutEvent === 0) {
                    MiddenQuest_Expo_Tracker.updateExpoNavigateTimeoutEvent = setInterval(function () {
                        MiddenQuest_Expo_Tracker.updateExpoNavigateTimeout();
                    }, 15000);
                }
            }
        }
    },
    updateExpoNavigateTimeout: function () {
        var curTime = jQuery.now();
        if (curTime < MiddenQuest_Expo_Tracker.expo_navigate) {
            MiddenQuest_Expo_Tracker.message_2 = MiddenQuest_Expo_Tracker.calcTimeout(MiddenQuest_Expo_Tracker.expo_navigate);
        } else if (MiddenQuest_Expo_Tracker.expo_finished > 0) {
            if (MiddenQuest_Expo_Tracker.updateExpoNavigateTimeoutEvent !== 0) {
                clearInterval(MiddenQuest_Expo_Tracker.updateExpoNavigateTimeoutEvent);
                MiddenQuest_Expo_Tracker.updateExpoNavigateTimeoutEvent = 0;
            }
            MiddenQuest_Expo_Tracker.message_2 = "<span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getNavigation.aspx?null='); fightengaged = 0;\">Finished</div>";
            MiddenQuest_Expo_Tracker.expo_navigate = 0;
        }
        jQuery('#expo_timer_2').html(MiddenQuest_Expo_Tracker.message_2);
    },
    updatePerkTimes: function () {
        var curTime = jQuery.now();
        jQuery('#ContentLoad > div:last-child > div:last-child > div > div').each(function () {
            if (jQuery('div', this).length !== 2) {
                return;
            }
            var perkName = jQuery('div', this).first().text().trim().match(/(\w+) lvl. (\d+)/);
            var perkValue = jQuery('div', this).last().text().trim().match(/[(](\w+) min[)]/);
            if (perkName === null || perkName.length !== 3) {
                return;
            }
            if (MiddenQuest_Expo_Tracker.perks[perkName[1]] === undefined) {
                MiddenQuest_Expo_Tracker.perks[perkName[1]] = 0;
            }
            if (parseInt(perkValue[1]) > 0) {
                MiddenQuest_Expo_Tracker.perks[perkName[1]] = ((parseInt(perkValue[1]) + 1) * 60 * 1000) + curTime;
            } else {
                MiddenQuest_Expo_Tracker.perks[perkName[1]] = 0;
            }
        });
        MiddenQuest_Expo_Tracker.drawPerkTimers();
    },
    drawPerkTimers: function () {
        var active = false;
        var curTime = jQuery.now();
        MiddenQuest_Expo_Tracker.message_4 = '';
        for (var key in MiddenQuest_Expo_Tracker.perks) {
            MiddenQuest_Expo_Tracker.message_4 += '<div style="margin-bottom: 5px;">' + key + '</div>';
            if (curTime > MiddenQuest_Expo_Tracker.perks[key]) {
                MiddenQuest_Expo_Tracker.perks[key] = 0;
            }
            if (MiddenQuest_Expo_Tracker.perks[key] === 0) {
                MiddenQuest_Expo_Tracker.message_4 += '<div style="margin-bottom: 15px;color: red;">Inactive</div>';
            } else {
                active = true;
                MiddenQuest_Expo_Tracker.message_4 += '<div style="margin-bottom: 15px;color: black;">' + MiddenQuest_Expo_Tracker.calcTimeout(MiddenQuest_Expo_Tracker.perks[key]) + '</div>';
            }
        }
        MiddenQuest_Expo_Tracker.message_4 += "<div><span style='color:blue;cursor: pointer;' onClick=\"sendRequestContentFill('getInfoPerk.aspx?null='); fightengaged = 0;\">Update Perks</span></div>";
        jQuery('#perkStatus').html(MiddenQuest_Expo_Tracker.message_4);
        if (MiddenQuest_Expo_Tracker.updatePerkTimeoutEvent > 0 && active === false) {
            clearInterval(MiddenQuest_Expo_Tracker.updatePerkTimeoutEvent);
            MiddenQuest_Expo_Tracker.updatePerkTimeoutEvent = 0;
        }
        if (active && MiddenQuest_Expo_Tracker.updatePerkTimeoutEvent === 0) {
            MiddenQuest_Expo_Tracker.updatePerkTimeoutEvent = setInterval(function () {
                MiddenQuest_Expo_Tracker.drawPerkTimers();
            }, 15000);
        }
    },
    start: function () {
        jQuery('#TopScreen').prepend('<div id="MQ_Expo_Tracker" style="position: absolute;left: -120px;top: 20px"></div>');
        jQuery('#MQ_Expo_Tracker').append('<div id="expo_timer_parent" style="margin-bottom: 15px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Expedition</div><br/><div><span id="expo_timer">Check Now</span></div></div></div>');
        jQuery('#MQ_Expo_Tracker').append('<div id="expo_copy" style="margin-bottom: 15px;color: black;" class=""><button class="darkBtn ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" style="width:100px; height:45px; font-size: 10pt;" role="button" aria-disabled="false"><span class="ui-button-text">Copy Market</span></button></div>');
        jQuery('#MQ_Expo_Tracker').append('<div id="expo_timer_parent_2" style="margin-bottom: 15px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Navigation</div><br/><div><span id="expo_timer_2">Check Now</span></div></div></div>');
        jQuery('#MQ_Expo_Tracker').append('<div id="expo_sp" style="margin-bottom: 15px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Seafaring</div><br/><div><span id="SeafaringPoints">0 SP</span></div></div></div>');
        jQuery('#MQ_Expo_Tracker').append('<div id="quest_done" style="margin-bottom: 15px;color: black;" class=""><div style="width:100px; height:80px; background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Quest Counter</div><br/><div><span id="QuestCount">No Quest</span></div></div></div>');
        jQuery('#MQ_Expo_Tracker').append('<div id="perk_status" style="margin-bottom: 15px;color: black;" class=""><div style="padding-bottom: 10px;width:100px;background-color:#CCC; text-align: center; border-radius: 5px; border: 1px solid black;"><br/><div>Perks</div><br/><div><span id="perkStatus">Check Now</span></div></div></div>');

        jQuery('#expo_timer_2').html(MiddenQuest_Expo_Tracker.message_2);
        jQuery('#expo_timer').html(MiddenQuest_Expo_Tracker.message);
        jQuery('#perkStatus').html(MiddenQuest_Expo_Tracker.message_4);
        MiddenQuest_Expo_Tracker.copyBtn = document.querySelector('#expo_copy');
        MiddenQuest_Expo_Tracker.copyBtn.addEventListener('click', function (event) {
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
                    if (jQuery('#ContentLoad > div:last-child > div:last-child > div > div:first-child').first().text() === 'Perks') {
                        MiddenQuest_Expo_Tracker.updatePerkTimes();
                    }
                }
            });
        });
        observer.observe(MiddenQuest_Expo_Tracker.target, MiddenQuest_Expo_Tracker.config);
    }
};
MiddenQuest_Expo_Tracker.start();
if (unsafeWindow.MiddenQuest_Expo_Tracker === undefined) {
    unsafeWindow.MiddenQuest_Expo_Tracker = MiddenQuest_Expo_Tracker;
}
