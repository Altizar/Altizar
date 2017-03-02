// ==UserScript==
// @name         MidenQuest - Resource Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      1.4
// @description  MidenQuest - Expo Send Highlighter
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Resource.Tracker.js
// @updateURL    https://altizar.github.io/MiddenQuest.Resource.Tracker.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var MQO_Resource_Tracker = {
    outputItems: true,
    outputTaxes: true,
    outputTiers: true,
    outputQuests: true,
    outputPerks: true,
    printItemDrops: true,
    outputToConsole: false,
    saveLogText: false,

    logText: [],
    tsXPRegex: /(\d+) skill exp/,
    questItemRegex: /(\d+) \/ (\d+)/,
    itemDropCountRegex: /^\[.+\] Found (\d+)/,
    scoutRelicRegex: / (\d+) relics/,
    resourceListId: 'resourceLogList',

    normalAverageMultiplier: 60 / 5 * 60,
    quadAverageMultiplier: 60 / 3 * 60 * 4,
    // results aren't stored under the resource because we aren't tracking tile changes/types
    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    tsResults: {
        actions: 0,
        xp: 0,
        taxedActions: 0,
        items: 0,
        questActive: false,
        questActions: 0,
        questItems: 0,
        1: {drop: 0, total: 0, gained: 0, taxed: 0},
        2: {drop: 0, total: 0, gained: 0, taxed: 0},
        3: {drop: 0, total: 0, gained: 0, taxed: 0},
        4: {drop: 0, total: 0, gained: 0, taxed: 0},
        5: {drop: 0, total: 0, gained: 0, taxed: 0},
        lumber: {
            items: ['Pine', 'Oak', 'Maple', 'Ironwood', 'Yggdrasil'],
            tracker: [/(\d+) Pine/, /(\d+) Oak/, /(\d+) Maple/, /(\d+) Ironwood/, /(\d+) Yggdrasil/]
        },
        ore: {
            items: ['Iron', 'Silver', 'Obsidian', 'Mythril', 'Ethernium'],
            tracker: [/(\d+) Iron/, /(\d+) Silver/, /(\d+) Obsidian/, /(\d+) Mythril/, /(\d+) Ethernium/]
        },
        plant: {
            items: ['Plant Stem', 'Cotton', 'Living Leather', 'Silver Vine', 'Nimbus Fruit'],
            tracker: [/(\d+) Plant Stem/, /(\d+) Cotton/, /(\d+) Living Leather/, /(\d+) Silver Vine/, /(\d+) Nimbus Fruit/]
        },
        fish: {
            items: ['Tuna', 'Salmon', 'Flyfish', 'Marlin', 'Dragonfish'],
            tracker: [/(\d+) Tuna/, /(\d+) Salmon/, /(\d+) Flyfish/, /(\d+) Marlin/, /(\d+) Dragonfish/]
        },
        sales: {
            tracker: /(\d+) gold/,
            total: 0,
            taxed: 0,
            gained: 0
        },
        scouts: {
            tracker: /(\d+) landmark/,
            total: 0,
            taxed: 0,
            gained: 0,
            relicGained: 0,
            relicDouble: 0,
            relicDrop: 0,
            relicTaxedCount: 0,
            relicTaxed: 0
        },
        itemInfo: {
            equipDrop: 0,
            resourceBagDrop: 0,
            keyDrop: 0,
            magicElementsDrop: 0,
            magicElementsTotal: 0,
            goldDrop: 0,
            goldTotal: 0,
            gemDrop: 0,
            relicDrop: 0,
            relicTotal: 0,
            relicDouble: 0
        },
        perks: {
            Drunk: 0,
            Drunk_Scout: 0,
            Drunk_Sell: 0,
            Drunk_Mine: 0,
            Drunk_Gather: 0,
            Drunk_Log: 0,
            Drunk_Fish: 0,
            Enraged: 0,
            Captain: 0,
            Pitied: 0,
            Hoarder: 0,
        }
    },
    cleartsResults: function () {
        console.info('clearing results');
        this.tsResults.actions = 0;
        this.tsResults.items = 0;
        this.tsResults.questActive = false;
        this.tsResults.questActions = 0;
        this.tsResults.questItems = 0;
        this.tsResults.taxedActions = 0;
        this.tsResults.itemInfo = {
            equipDrop: 0,
            resourceBagDrop: 0,
            keyDrop: 0,
            magicElementsDrop: 0,
            magicElementsTotal: 0,
            goldDrop: 0,
            goldTotal: 0,
            gemDrop: 0,
            relicDrop: 0,
            relicTotal: 0,
            relicDouble: 0
        };
        this.tsResults.xp = 0;

        this.tsResults.sales.total = 0;
        this.tsResults.sales.taxed = 0;
        this.tsResults.sales.gained = 0;

        this.tsResults.scouts.total = 0;
        this.tsResults.scouts.taxed = 0;
        this.tsResults.scouts.gained = 0;
        this.tsResults.scouts.relicTaxed = 0;
        this.tsResults.scouts.relicTaxedCount = 0;
        this.tsResults.scouts.relicGained = 0;
        this.tsResults.scouts.relicDouble = 0;
        this.tsResults.scouts.relicDrop = 0;

        for (var i = 1, iLen = 6; i < iLen; i++) {
            this.tsResults[i] = {drop: 0, total: 0, gained: 0, taxed: 0};
        }
        this.updateOutput(this.tsResults, 'data reset complete');
    },
    handleQuestItem: function (msg) {
        var matches = msg.match(this.questItemRegex);
        var current = parseInt(matches[1]);
        var total = parseInt(matches[2]);

        if (current === total) {
            // this message is sent after the channel2 message, so we won't lose an action here
            this.tsResults.questActive = false;
        } else {
            this.tsResults.questActive = true;
            this.tsResults.questItems += 1;
        }
    },
    handleItemDrop: function (msg) {
        this.tsResults.items += 1;
        if (this.printItemDrops) {
            console.info(Date(), msg);
        }

        // TODO better method than this?
        if (msg.indexOf('a resource bag') >= 0) {
            this.tsResults.itemInfo.resourceBagDrop += 1;
        } else if (msg.indexOf('resource bags') >= 0) {
            this.tsResults.itemInfo.resourceBagDrop += 1;
        } else if (msg.indexOf('resources bag') >= 0) {
            this.tsResults.itemInfo.resourceBagDrop += 1;
        } else if (msg.indexOf('a key') >= 0) {
            this.tsResults.itemInfo.keyDrop += 1;
        } else if (msg.indexOf('a gem') >= 0) {
            this.tsResults.itemInfo.gemDrop += 1;
        } else if (msg.indexOf('Found Broken') >= 0) {
            // these will eventually be broken out by tier as well
            this.tsResults.itemInfo.equipDrop += 1;
        } else if (msg.indexOf('Found Basic') >= 0) {
            this.tsResults.itemInfo.equipDrop += 1;
        } else if (msg.indexOf('Found Fine') >= 0) {
            this.tsResults.itemInfo.equipDrop += 1;
        } else if (msg.indexOf('Found Elite') >= 0) {
            this.tsResults.itemInfo.equipDrop += 1;
        } else if (msg.indexOf('Found Master') >= 0) {
            this.tsResults.itemInfo.equipDrop += 1;
            // equips else if(msg.indexOf('a key') >= 0) this.tsResults.itemInfo.keyDrop += 1;
        } else if (msg.indexOf('a relic') >= 0) {
            this.tsResults.itemInfo.relicDrop += 1;
            this.tsResults.itemInfo.relicTotal += 1;
        } else if (msg.indexOf('relics') >= 0) {
            var count = parseInt(msg.match(this.itemDropCountRegex)[1]);
            this.tsResults.itemInfo.relicDrop += 1;
            this.tsResults.itemInfo.relicTotal += count;
        } else if (msg.indexOf('gold coins') >= 0) {
            var count = parseInt(msg.match(this.itemDropCountRegex)[1]);
            this.tsResults.itemInfo.goldDrop += 1;
            this.tsResults.itemInfo.goldTotal += count;
        } else if (msg.indexOf('magic elements') >= 0) {
            var count = parseInt(msg.match(this.itemDropCountRegex)[1]);
            this.tsResults.itemInfo.magicElementsDrop += 1;
            this.tsResults.itemInfo.magicElementsTotal += count;
        }

        if (msg.indexOf('doubled') > -1) {
            this.tsResults.itemInfo.relicDouble += 1;
        }
    },
    parsePrimaryTS: function (msg, tsResults, tsKey, wasTaxed) {
        var patterns = this.tsResults[tsKey].tracker;
        var itemTypes = this.tsResults[tsKey].items;
        for (var i = 0, iLen = itemTypes.length; i < iLen; i++) {
            if (msg.indexOf(itemTypes[i]) >= 0) {
                this.tsResults[i + 1].drop += 1;
                // track total/gained/taxed counts
                var amt = parseInt(msg.match(patterns[i])[1]);
                this.tsResults[i + 1].total += amt;
                if (wasTaxed) {
                    this.tsResults[i + 1].taxed += amt;
                } else {
                    this.tsResults[i + 1].gained += amt;
                }
            }
        }
    },
    parseSales: function (msg, tsResults, wasTaxed) {
        var goldEarned = parseInt(msg.match(this.tsResults.sales.tracker)[1]);
        this.tsResults.sales.total += goldEarned;
        if (wasTaxed)
            this.tsResults.sales.taxed += goldEarned;
        else
            this.tsResults.sales.gained += goldEarned;
    },
    parseScouts: function (msg, tsResults, wasTaxed) {
        var marksEarned = parseInt(msg.match(this.tsResults.scouts.tracker)[1]);
        this.tsResults.scouts.total += marksEarned;
        if (wasTaxed)
            this.tsResults.scouts.taxed += marksEarned;
        else
            this.tsResults.scouts.gained += marksEarned;
    },
    parsePerk: function(msg) {
        if (msg.indexOf('Enraged') >= 0) {
            this.tsResults.perks.Enraged += 1;
        }
        if (msg.indexOf('drunkenly') >= 0) {
            this.tsResults.perks.Drunk += 1;
            if (msg.indexOf('scout') >= 0) {
                this.tsResults.perks.Drunk_Scout += 1;
            }
            if (msg.indexOf('sold') >= 0) {
                this.tsResults.perks.Drunk_Sell += 1;
            }
            if (msg.indexOf('mined') >= 0) {
                this.tsResults.perks.Drunk_Mine += 1;
            }
            if (msg.indexOf('gathered') >= 0) {
                this.tsResults.perks.Drunk_Gather += 1;
            }
            if (msg.indexOf('cut') >= 0) {
                this.tsResults.perks.Drunk_Log += 1;
            }
            if (msg.indexOf('fished') >= 0) {
                this.tsResults.perks.Drunk_Fish += 1;
            }
        }
    },
    parseScoutResourceRelic: function (msg) {
        var count = parseInt(msg.match(this.scoutRelicRegex)[1]);
        // not sure if this one occurs, safety first
        if (msg.indexOf('a relic') >= 0) {
            count = 1;
        }
        // relics can be taxed now
        if (msg.indexOf("taxes") >= 0) {
            this.tsResults.scouts.relicTaxedCount += count;
        } else {
            this.tsResults.scouts.relicGained += count;
        }
        // track the total relic drops for taxes/doubles
        this.tsResults.scouts.relicDrop += 1;
        if (msg.indexOf('double') >= 0) {
            this.tsResults.scouts.relicDouble += 1;
        }
        if (msg.indexOf('taxes') >= 0) {
            this.tsResults.scouts.relicTaxed += 1;
        }
        this.updateOutput(this.tsResults, msg);
    },
    parseTSLog: function (data) {
        var datum = data.data;
        var arr = datum.split('|');
        if (arr[0] !== 'NLOG') {
            return;
        }

        var channel = arr[1];
        var msg = arr[2];

        // save all lines of text if requested
        if (this.saveLogText) {
            this.logText.push(msg);
        }

        // track relic, item, gem, gold drops
        if (channel == 3) {
            // track quest drops separately
            if (msg.indexOf('quest') > 0)
                return this.handleQuestItem(msg);
            return this.handleItemDrop(msg);
        } else if (channel == 2) {
            if (msg.indexOf('**') > -1) {
                return this.parsePerk(msg);
            }
            // skip level up message before counting the action
            if (msg.indexOf('gained a new tradeskill level') > -1) {
                return;
            }
            // scouting's relic gain is in resource log now
            if (msg.indexOf('relic') > -1) {
                return this.parseScoutResourceRelic(msg);
            }
            this.tsResults.actions += 1;
            if (this.tsResults.questActive) {
                this.tsResults.questActions += 1;
            }
            var wasTaxed = msg.indexOf('to taxes') > -1;
            if (wasTaxed) {
                this.tsResults.taxedActions += 1;
            }
            this.tsResults.xp += parseInt(msg.match(this.tsXPRegex)[1]);

            if (msg.indexOf('You cut') >= 0) {
                this.parsePrimaryTS(msg, this.tsResults, 'lumber', wasTaxed);
            } else if (msg.indexOf('You mined') >= 0) {
                this.parsePrimaryTS(msg, this.tsResults, 'ore', wasTaxed);
            } else if (msg.indexOf('You gathered') >= 0) {
                this.parsePrimaryTS(msg, this.tsResults, 'plant', wasTaxed);
            } else if (msg.indexOf('You caught') >= 0) {
                this.parsePrimaryTS(msg, this.tsResults, 'fish', wasTaxed);
            } else if (msg.indexOf('You earned') >= 0) {
                this.parseSales(msg, this.tsResults, wasTaxed);
            } else if (msg.indexOf('You scouted') >= 0) {
                // skip the "didn't find any" message
                if (msg.indexOf('find any') < 0) {
                    this.parseScouts(msg, this.tsResults, wasTaxed);
                }
            }

        }
        this.updateOutput(this.tsResults, msg);
    },
    addTierInfo: function (tsResults, outputArgs) {
        return outputArgs.concat([
            't1%:', (100 * this.tsResults[1].drop / this.tsResults.actions).toFixed(2),
            't2%:', (100 * this.tsResults[2].drop / this.tsResults.actions).toFixed(2),
            't3%:', (100 * this.tsResults[3].drop / this.tsResults.actions).toFixed(2),
            't4%:', (100 * this.tsResults[4].drop / this.tsResults.actions).toFixed(2),
            't5%:', (100 * this.tsResults[5].drop / this.tsResults.actions).toFixed(2),
            '&nbsp;', '&nbsp;',
            '&nbsp;gained', '&nbsp;',

            't1:', this.numberWithCommas(this.tsResults[1].gained),
            't2:', this.numberWithCommas(this.tsResults[2].gained),
            't3:', this.numberWithCommas(this.tsResults[3].gained),
            't4:', this.numberWithCommas(this.tsResults[4].gained),
            't5:', this.numberWithCommas(this.tsResults[5].gained),
            '&nbsp;', '&nbsp;']);
    },
    addItemOutput: function (tsResults, outputArgs) {
        return outputArgs.concat([
            '&nbsp;', '&nbsp;',
            'equip%:', (100 * this.tsResults.itemInfo.equipDrop / this.tsResults.actions).toFixed(4),
            'res. bag%:', (100 * this.tsResults.itemInfo.resourceBagDrop / this.tsResults.actions).toFixed(4),
            'key%:', (100 * this.tsResults.itemInfo.keyDrop / this.tsResults.actions).toFixed(4),
            'gem%:', (100 * this.tsResults.itemInfo.gemDrop / this.tsResults.actions).toFixed(4),
            'ME%:', (100 * this.tsResults.itemInfo.magicElementsDrop / this.tsResults.actions).toFixed(4),
            'gold%:', (100 * this.tsResults.itemInfo.goldDrop / this.tsResults.actions).toFixed(4),
            'relic%:', (100 * this.tsResults.itemInfo.relicDrop / this.tsResults.actions).toFixed(4),

            '&nbsp;', '&nbsp;',
            'avg ME:', this.numberWithCommas((this.tsResults.itemInfo.magicElementsTotal / this.tsResults.itemInfo.magicElementsDrop).toFixed(0)),
            'avg Gold:', this.numberWithCommas((this.tsResults.itemInfo.goldTotal / this.tsResults.itemInfo.goldDrop).toFixed(0)),
            'avg Relics:', this.numberWithCommas((this.tsResults.itemInfo.relicTotal / this.tsResults.itemInfo.relicDrop).toFixed(0)),

            '&nbsp;', '&nbsp;',
            'Total ME:', this.numberWithCommas(this.tsResults.itemInfo.magicElementsTotal),
            'Total Gold:', this.numberWithCommas(this.tsResults.itemInfo.goldTotal),
            'Total Relics:', this.numberWithCommas(this.tsResults.itemInfo.relicTotal),
            '2x Relic %:', (this.tsResults.itemInfo.relicDouble / this.tsResults.itemInfo.relicDrop).toFixed(2),
            '&nbsp;', '&nbsp;']);
    },
    addPerkInfo: function (tsResults, outputArgs) {
        return outputArgs.concat([
            '&nbsp;', '&nbsp;',
            'Enraged %:', (100 * this.tsResults.perks.Enraged / this.tsResults.actions).toFixed(4),
            '&nbsp;', '&nbsp;',
            'Drunk %:', (100 * this.tsResults.perks.Drunk / this.tsResults.actions).toFixed(4),
            'Drunk Scout %:', (100 * this.tsResults.perks.Drunk_Scout / this.tsResults.actions).toFixed(4),
            'Drunk Sell %:', (100 * this.tsResults.perks.Drunk_Sell / this.tsResults.actions).toFixed(4),
            'Drunk Mine %:', (100 * this.tsResults.perks.Drunk_Mine / this.tsResults.actions).toFixed(4),
            'Drunk Gather %:', (100 * this.tsResults.perks.Drunk_Gather / this.tsResults.actions).toFixed(4),
            'Drunk Log %:', (100 * this.tsResults.perks.Drunk_Log / this.tsResults.actions).toFixed(4),
            'Drunk Fish %:', (100 * this.tsResults.perks.Drunk_Fish / this.tsResults.actions).toFixed(4),
//            'Captain %:', (100 * this.tsResults.perks.Captain / this.tsResults.actions).toFixed(4),
//            'Pitied %:', (100 * this.tsResults.perks.Pitied / this.tsResults.actions).toFixed(4),
//            'Hoarder %:', (100 * this.tsResults.perks.Hoarder / this.tsResults.actions).toFixed(4),
            ]);
    },
    addSalesInfo: function (tsResults, outputArgs) {
        var avgSale = this.tsResults.sales.gained / this.tsResults.actions;
        return outputArgs.concat([
            'Sales:', this.numberWithCommas(this.tsResults.sales.gained),
            'Avg Sale:', this.numberWithCommas(avgSale.toFixed(2)),
//            '1x Estimate:', (avgSale * this.normalAverageMultiplier).toFixed(0),
//            '4x Estimate:', (avgSale * this.quadAverageMultiplier).toFixed(0)
        ]);
    },
    addScoutsInfo: function (tsResults, outputArgs) {
        var avgScout = this.tsResults.scouts.gained / this.tsResults.actions;
        return outputArgs.concat([
            'Scouts:', this.numberWithCommas(this.tsResults.scouts.gained),
            'Avg Scout:', this.numberWithCommas(avgScout.toFixed(0)),
            'Scout Relics:', this.numberWithCommas(this.tsResults.scouts.relicGained),
            'Scout 2x Relic%:', this.numberWithCommas((this.tsResults.scouts.relicDouble / this.tsResults.scouts.relicDrop * 100).toFixed(2)),
            'Actions/Relic', (this.tsResults.actions / this.tsResults.scouts.relicGained).toFixed(2),
            'Relics/Action', (this.tsResults.scouts.relicGained / this.tsResults.actions).toFixed(2),
//            '&nbsp;', '&nbsp;',
//            '1x Estimate:', this.numberWithCommas((avgScout * this.normalAverageMultiplier).toFixed(0)),
//            '4x Estimate:', this.numberWithCommas((avgScout * this.quadAverageMultiplier).toFixed(0))
        ]);
    },
    addTaxPercent: function (tsResults, outputArgs) {
        return outputArgs.concat([
            'tax%:', (100 * this.tsResults.taxedActions / this.tsResults.actions).toFixed(2)]);
    },
    addTaxSales: function (tsResults, outputArgs) {
        return outputArgs.concat([
            'sales tax:', this.tsResults.sales.taxed,
            'avg tax:', (this.tsResults.sales.taxed / this.tsResults.taxedActions).toFixed(2)]);
    },
    addTaxScouts: function (tsResults, outputArgs) {
        return outputArgs.concat([
            'Relics Taxed:', this.tsResults.scouts.relicTaxedCount,
            'Avg tax:', (this.tsResults.scouts.relicTaxedCount / this.tsResults.scouts.relicTaxed).toFixed(2),
            'Tax %:', (this.tsResults.scouts.relicTaxed / this.tsResults.scouts.relicDrop * 100).toFixed(2)
        ]);
    },
    addTaxedItems: function (tsResults, outputArgs) {
        return outputArgs.concat([
            '&nbsp;total taxed', '&nbsp;',
            't1:', this.tsResults[1].taxed,
            't2:', this.tsResults[2].taxed,
            't3:', this.tsResults[3].taxed,
            't4:', this.tsResults[4].taxed,
            't5:', this.tsResults[5].taxed]);
    },
    addXP: function (tsResults, outputArgs) {
        return outputArgs.concat([
            'total XP:', this.numberWithCommas(this.tsResults.xp),
            'avg XP:', this.numberWithCommas((this.tsResults.xp / this.tsResults.actions).toFixed(2)),
            '&nbsp;', '&nbsp;']);
    },
    updateOutput: function (results, msg) {
        var outputArgs = ['actions:', this.tsResults.actions, '&nbsp;', '&nbsp;'];
        outputArgs = this.addXP(this.tsResults, outputArgs);
        // don't display tier data if sales is active
        var salesActive = this.tsResults.sales.total > 0;
        var scoutsActive = this.tsResults.scouts.total > 0;

        if (this.outputTiers && !salesActive && !scoutsActive) {
            outputArgs = this.addTierInfo(this.tsResults, outputArgs);
        } else if (this.outputTiers && salesActive && !scoutsActive) {
            outputArgs = this.addSalesInfo(this.tsResults, outputArgs);
        } else if (this.outputTiers && !salesActive && scoutsActive) {
            outputArgs = this.addScoutsInfo(this.tsResults, outputArgs);
        }

        outputArgs = outputArgs.concat(['&nbsp;', '&nbsp;', 'item%:', (100 * this.tsResults.items / this.tsResults.actions).toFixed(2)]);

        if (this.outputItems) {
            outputArgs = this.addItemOutput(this.tsResults, outputArgs);
        }
        if (this.outputQuests) {
            outputArgs = outputArgs.concat(['quest%:', (100 * this.tsResults.questItems / this.tsResults.questActions).toFixed(2)]);
        }
        if (this.outputTaxes) {
            // scouting tax functions differently
            if (!scoutsActive) {
                outputArgs = this.addTaxPercent(this.tsResults, outputArgs);
            }
            if (salesActive) {
                outputArgs = this.addTaxSales(this.tsResults, outputArgs);
            } else if (scoutsActive) {
                outputArgs = this.addTaxScouts(this.tsResults, outputArgs);
            } else {
                outputArgs = this.addTaxedItems(this.tsResults, outputArgs);
            }
        }

        if (this.outputPerks) {
            outputArgs = this.addPerkInfo(this.tsResults, outputArgs);
        }

        outputArgs = outputArgs.concat(['\tmsg:', msg]);

        if (this.outputToConsole) {
            console.info.apply(console, outputArgs);
        }

        // skip posting the message to the UI
        outputArgs.pop();
        outputArgs.pop();
        this.updateUI(outputArgs);
    },
    formatResource: function (label, value) {
        return '<li style="width: 200px;clear: both;"><div style="float: left;">' + label + '</div><div style="float: right;text-align: right;">' + value + '</div></li>';
    },
    updateUI: function (outputArgs) {
        $('#' + this.resourceListId).empty();
        $('#' + this.resourceListId).append('<li><div id="reset_data" style="color:blue;cursor: pointer;">Reset Data</a></div></li>');
        $('#reset_data').on('click', function () {
            MQO_Resource_Tracker.cleartsResults();
        });
        for (var i = 0, iLen = outputArgs.length; i < iLen; i += 2) {
            $('#' + this.resourceListId).append(this.formatResource(outputArgs[i], outputArgs[i + 1]));
        }
    },
    initializeUI: function () {
        $("body").append('<div id="resourceLogContainer" style="position: absolute;top: 0;right: 20px; width: 200px;"><div>Resource Log <div style="float: right;"><a href="javascript:toggleUI();">[Toggle]</a></div></div> <ul id="resourceLogList" style="display"></ul></div>');
    },
    toggleUI: function () {
        $("#resourceLogList").toggle();
    },
    run: function (event) {
        MQO_Resource_Tracker.parseTSLog(event);
    }
};

 if (unsafeWindow.MQO_Resource_Tracker === undefined) {
     unsafeWindow.MQO_Resource_Tracker = MQO_Resource_Tracker;
 }
 MQO_Resource_Tracker.initializeUI();
 if (MQO_WebsocketWrapper === undefined && unsafeWindow.MQO_WebsocketWrapper !== undefined) {
     MQO_WebsocketWrapper = unsafeWindow.MQO_WebsocketWrapper;
 }
 MQO_WebsocketWrapper.addCallback(MQO_Resource_Tracker.run);
