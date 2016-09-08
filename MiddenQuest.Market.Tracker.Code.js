// ==UserScript==
// @name         MidenQuest - Market Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.3
// @description  MidenQuest - Market Tracker
// @author       Altizar
// @require      https://code.highcharts.com/highcharts.js
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Market.Tracker.Code.js
// @updateURL    https://altizar.github.io/MiddenQuest.Market.Tracker.Code.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*
MQO_MarketPricesTracker = {
    target: document.getElementById('ContentLoad'),
    config: {attributes: true, childList: true, characterData: true},
    hasStarted: false,
    prices: {},
    logText: function (text) {
        console.log(text);
    },
    save: function () {
        localStorage.setItem('MQO_MarketPricesTracker_Save', JSON.stringify(MQO_MarketPricesTracker.prices));
        MQO_MarketPricesTracker.logText('Data Saved');
    },
    load: function () {
        var retrievedObject = localStorage.getItem('MQO_MarketPricesTracker_Save');
        var retrievedObject = JSON.parse(localStorage.getItem('MQO_MarketPricesTracker_Save'));
        if (retrievedObject != undefined && retrievedObject.ore_1 != undefined) {
            MQO_MarketPricesTracker.prices = retrievedObject;
            MQO_MarketPricesTracker.logText('loaded Data');
        } else {
            MQO_MarketPricesTracker.prices = {
                ore_1: {},
                ore_2: {},
                ore_3: {},
                ore_4: {},
                ore_5: {},
                plants_1: {},
                plants_2: {},
                plants_3: {},
                plants_4: {},
                plants_5: {},
                wood_1: {},
                wood_2: {},
                wood_3: {},
                wood_4: {},
                wood_5: {},
                fish_1: {},
                fish_2: {},
                fish_3: {},
                fish_4: {},
                fish_5: {},
                magic: {},
                relics: {},
                gems: {},
                orbs: {},
                scrolls: {}
            };
            MQO_MarketPricesTracker.logText('Data Load Failed');
        }
    },
    message_parser: function (message) {
        var date = MQO_MarketPricesTracker.current_date();
        MQO_MarketPricesTracker.prices.ore_1[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes1_1', message).text());
        MQO_MarketPricesTracker.prices.ore_2[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes1_2', message).text());
        MQO_MarketPricesTracker.prices.ore_3[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes1_3', message).text());
        MQO_MarketPricesTracker.prices.ore_4[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes1_4', message).text());
        MQO_MarketPricesTracker.prices.ore_5[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes1_5', message).text());
        MQO_MarketPricesTracker.prices.plants_1[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes2_1', message).text());
        MQO_MarketPricesTracker.prices.plants_2[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes2_2', message).text());
        MQO_MarketPricesTracker.prices.plants_3[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes2_3', message).text());
        MQO_MarketPricesTracker.prices.plants_4[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes2_4', message).text());
        MQO_MarketPricesTracker.prices.plants_5[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes2_5', message).text());
        MQO_MarketPricesTracker.prices.wood_1[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes3_1', message).text());
        MQO_MarketPricesTracker.prices.wood_2[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes3_2', message).text());
        MQO_MarketPricesTracker.prices.wood_3[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes3_3', message).text());
        MQO_MarketPricesTracker.prices.wood_4[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes3_4', message).text());
        MQO_MarketPricesTracker.prices.wood_5[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes3_5', message).text());
        MQO_MarketPricesTracker.prices.fish_1[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes4_1', message).text());
        MQO_MarketPricesTracker.prices.fish_2[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes4_2', message).text());
        MQO_MarketPricesTracker.prices.fish_3[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes4_3', message).text());
        MQO_MarketPricesTracker.prices.fish_4[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes4_4', message).text());
        MQO_MarketPricesTracker.prices.fish_5[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes4_5', message).text());
        MQO_MarketPricesTracker.prices.magic[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes3', message).text());
        MQO_MarketPricesTracker.prices.relics[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes4', message).text());
        MQO_MarketPricesTracker.prices.gems[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes5', message).text());
        MQO_MarketPricesTracker.prices.orbs[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes6', message).text());
        MQO_MarketPricesTracker.prices.scrolls[date] = MQO_MarketPricesTracker.parse_value(jQuery('#ShortcutRes7', message).text());
        MQO_MarketPricesTracker.save();
    },
    parse_value: function (text) {
        var num = parseInt(text);
        if (text.indexOf('k') !== -1) {
            num *= 1e3;
        }
        if (text.indexOf('m') !== -1) {
            num *= 1e6;
        }
        return num;
    },
    current_date: function () {
        var theDate = new Date();
        theDate.setSeconds(0);
        theDate.setMilliseconds(0);
        theDate.setMinutes(theDate.getMinutes() - (theDate.getMinutes() % 5));
        return theDate.getTime() / 1000;
    },
    drawChart: function () {
        if (jQuery('#container').length === 0) {
            jQuery('body').append('<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
        }
        graphData = [];
        for (var key in MQO_MarketPricesTracker.prices) {
            graphData.push({
                name: key,
                data: []
            });
            for (var timestamp in MQO_MarketPricesTracker.prices[key]) {
                graphData[graphData.length - 1].data.push([timestamp * 10000, MQO_MarketPricesTracker.prices[key][timestamp]]);
            }
        }
        jQuery('#container').highcharts({
            title: {
                text: 'Resource Price',
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                type: 'datetime'
            },
            series: graphData,
        });
    },
    trackMessage: function () {
        var message = event.data.split('|');
        if (message[0] === "LOADPAGE") {
            var hasMarket = jQuery('#ShortcutRes1_1', this.target).length;
            if (hasMarket === 1) {
                MQO_MarketPricesTracker.message_parser(this.target);
            }
        }
        MQO_MarketPricesTracker.orginalMessageCode(event);
    },
    start: function () {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    MQO_MarketPricesTracker.trackMessage();
                }
            });
        });
        observer.observe(target, config);
    }
};
MQO_MarketPricesTracker.start();
