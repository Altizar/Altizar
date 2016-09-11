// ==UserScript==
// @name         MidenQuest - Expo Send Highlighter
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.2
// @description  MidenQuest - Expo Send Highlighter
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Expo.Button.Highlighter.js
// @updateURL    https://altizar.github.io/MiddenQuest.Expo.Button.Highlighter.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var MQO_Expo_Button_Highlighter = {
    target: document.getElementById('ContentLoad'),
    expo_count: 4,
    config: {
        attributes: true,
        childList: true,
        characterData: true
    },
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
    updateButtons: function () {
        var hasMarket = jQuery('#btnSendExp', this.target).length;
        if (hasMarket === 0) {
            return;
        }
        this.parseStock();
        jQuery('#ContentLoad button').each(function () {
            var text = jQuery(this).text().match(/([^T]*)[T]([0-5])[ ](\w*)/);
            if (text !== null) {
                var name = text[3] + '_' + text[2];
                var stockNeed = MQO_Expo_Button_Highlighter.parse_value(text[1]);
                var stockOwn = MQO_Expo_Button_Highlighter.stock[name];
                if (stockOwn < (stockNeed * this.expo_count)) {
                    jQuery(this).removeClass("ui-state-default").removeClass("darkBtn").addClass("ui-state-secondary");
                }
                if (stockOwn < stockNeed) {
                    jQuery(this).removeClass("ui-state-secondary").addClass("ui-state-error").unbind('click');
                }
            }
        });
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
        this.stock.Plants_5 = this.getValue('T5GatherDesc');
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
    start: function () {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    MQO_Expo_Button_Highlighter.updateButtons();
                }
            });
        });
        observer.observe(this.target, this.config);
    }
};
MQO_Expo_Button_Highlighter.start();
