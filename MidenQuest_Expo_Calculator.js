var start = Date.now();
var MQO_Expo_Calc = {
    loadState: 0,
    expos: [],
    table: null,
    table_2: null,
    table_3: null,
    best_short: null,
    best_long: null,
    best_long_2: null,
    expo_tiers: {},
    resource_names: ['Ore', 'Plants', 'Wood', 'Fish'],
    key_relic: 38.8,
    key_gem: 0.27,
    key_magic: 587.5,
    user_input: {
        gem_level: 0,
        relic_level: 0,
        key_level: 0,
        orb_level: 0,
        scroll_level: 0,
        time_level: 0,
        king_inns: 31,
        min_expo: 1,
        min_time: 60,
        expo_slots: 4,
        adv_level: 20,
        tiers: 5432,
        long_run: 1,
        short_run: 6,
        long_type: 1
    },
    prices: {
        ore_1: 0,
        ore_2: 0,
        ore_3: 0,
        ore_4: 0,
        ore_5: 0,
        plants_1: 0,
        plants_2: 0,
        plants_3: 0,
        plants_4: 0,
        plants_5: 0,
        wood_1: 0,
        wood_2: 0,
        wood_3: 0,
        wood_4: 0,
        wood_5: 0,
        fish_1: 0,
        fish_2: 0,
        fish_3: 0,
        fish_4: 0,
        fish_5: 0,
        magic: 0,
        relics: 0,
        gems: 0,
        orbs: 0,
        scrolls: 0,
        keys: 0
    },
    resources: {
        rez_ore_1: 1,
        rez_ore_2: 0,
        rez_ore_3: 0,
        rez_ore_4: 0,
        rez_ore_5: 0,
        rez_plants_1: 0,
        rez_plants_2: 0,
        rez_plants_3: 0,
        rez_plants_4: 0,
        rez_plants_5: 0,
        rez_wood_1: 3,
        rez_wood_2: 0,
        rez_wood_3: 0,
        rez_wood_4: 0,
        rez_wood_5: 0,
        rez_fish_1: 0,
        rez_fish_2: 0,
        rez_fish_3: 0,
        rez_fish_4: 0,
        rez_fish_5: 0
    },
    logText: function (text) {
        console.log(text);
    },
    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    db: null,
    initDB: function () {
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        request = window.indexedDB.open("MQO_Expo_Calc", 5);
        request.onerror = function (event) {
            //            MQO_Expo_Calc.db.createObjectStore("save", {
            //                keyPath: "id"
            //            });
        };
        request.onsuccess = function (event) {
            MQO_Expo_Calc.db = event.target.result;
            MQO_Expo_Calc.load();
        };
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("save", {
                keyPath: "id"
            });
        };
        request.notfound = function (event) {
        };
    },
    load_data: function (current, loaded) {
        for (var key in loaded) {
            current[key] = loaded[key];
        }
        return current;
    },
    save: function () {
        if (this.db === null) {
            this.logText('DB not loaded for saving');
            return false;
        }
        this.db.transaction(["save"], "readwrite")
                .objectStore("save")
                .put({
                    id: "user_input",
                    data: this.user_input
                });
        this.db.transaction(["save"], "readwrite")
                .objectStore("save")
                .put({
                    id: "prices",
                    data: this.prices
                });
        this.db.transaction(["save"], "readwrite")
                .objectStore("save")
                .put({
                    id: "resources",
                    data: this.resources
                });
        MQO_Expo_Calc.update_prices();
        MQO_Expo_Calc.update_inputs();
        MQO_Expo_Calc.update_resources();
    },
    load: function () {
        if (this.db === null) {
            this.logText('DB not loaded for loading');
            return false;
        }
        this.logText('Loading');
        var objectStore = this.db.transaction("save").objectStore("save");
        var request = objectStore.get("prices");
        request.onsuccess = function (event) {
            if (request.result !== undefined) {
                MQO_Expo_Calc.prices = MQO_Expo_Calc.load_data(MQO_Expo_Calc.prices, request.result.data);
                MQO_Expo_Calc.loadState += 1;
                MQO_Expo_Calc.doWork();
            }
        };
        request.onerror = function (event) {
            MQO_Expo_Calc.logText('Price Data Missing');
        };
        var request2 = objectStore.get("user_input");
        request2.onsuccess = function (event) {
            if (request2.result !== undefined) {
                MQO_Expo_Calc.user_input = MQO_Expo_Calc.load_data(MQO_Expo_Calc.user_input, request2.result.data);
                MQO_Expo_Calc.loadState += 1;
                MQO_Expo_Calc.doWork();
            }
        };
        request2.onerror = function (event) {
            MQO_Expo_Calc.logText('User Input Data Missing');
        };
        var request3 = objectStore.get("resources");
        request3.onsuccess = function (event) {
            if (request3.result !== undefined) {
                MQO_Expo_Calc.resources = MQO_Expo_Calc.load_data(MQO_Expo_Calc.resources, request3.result.data);
                MQO_Expo_Calc.loadState += 1;
                MQO_Expo_Calc.doWork();
            }
        };
        request3.onerror = function (event) {
            MQO_Expo_Calc.logText('User Resource Data Missing');
        };
    },
    update_prices: function () {
        this.prices.keys = Math.floor(this.prices.gems * this.key_gem + this.prices.relics * this.key_relic + this.prices.magic * this.key_magic);
        jQuery('input.price').each(function () {
            var id = jQuery(this).prop('id');
            if (MQO_Expo_Calc.prices[id] !== undefined) {
                jQuery(this).val((MQO_Expo_Calc.prices[id]));
            }
        });
    },
    update_resources: function () {
        jQuery('.resources').each(function () {
            var id = jQuery(this).prop('id');
            if (MQO_Expo_Calc.resources[id] !== undefined) {
                jQuery(this).val((MQO_Expo_Calc.resources[id]));
            }
        });
        jQuery('.best_res_1').text("T" + MQO_Expo_Calc.expo_tiers[0]);
        jQuery('#best_res_1').text(this.resource_names[MQO_Expo_Calc.lowestPriceType(MQO_Expo_Calc.expo_tiers[0])]);
        jQuery('.best_res_2').text("T" + MQO_Expo_Calc.expo_tiers[1]);
        jQuery('#best_res_2').text(this.resource_names[MQO_Expo_Calc.lowestPriceType(this.expo_tiers[1])]);
        jQuery('.best_res_3').text("T" + MQO_Expo_Calc.expo_tiers[2]);
        jQuery('#best_res_3').text(this.resource_names[MQO_Expo_Calc.lowestPriceType(this.expo_tiers[2])]);
        jQuery('.best_res_4').text("T" + MQO_Expo_Calc.expo_tiers[3]);
        jQuery('#best_res_4').text(this.resource_names[MQO_Expo_Calc.lowestPriceType(this.expo_tiers[3])]);
    },
    update_inputs: function () {
        jQuery('.user_input').each(function () {
            var id = jQuery(this).prop('id');
            if (MQO_Expo_Calc.user_input[id] !== undefined) {
                jQuery(this).val(MQO_Expo_Calc.user_input[id]);
                if (jQuery("#" + id + "_multi").length > 0) {
                    var key = id.match(/[a-z]*/)[0];
                    var value = expoRates[MQO_Expo_Calc.user_input[id]][key].toFixed(3);
                    jQuery("#" + id + "_multi").text(value);
                }
            }
        });
        // 52
        this.expo_tiers = this.user_input['tiers'].toString().match(/([0-9])/g);
    },
    import_prices: function () {
        if (jQuery('#ShortcutRes1_1', '#price_modal').length === 0) {
            MQO_Expo_Calc.logText("missing prices");
            return false;
        }
        if (jQuery('#ShortcutRes7', '#price_modal').length === 0) {
            MQO_Expo_Calc.logText("missing prices");
            return false;
        }

        this.prices.ore_1 = this.parse_value(jQuery('#ShortcutRes1_1', '#price_modal').text());
        this.prices.ore_2 = this.parse_value(jQuery('#ShortcutRes1_2', '#price_modal').text());
        this.prices.ore_3 = this.parse_value(jQuery('#ShortcutRes1_3', '#price_modal').text());
        this.prices.ore_4 = this.parse_value(jQuery('#ShortcutRes1_4', '#price_modal').text());
        this.prices.ore_5 = this.parse_value(jQuery('#ShortcutRes1_5', '#price_modal').text());
        this.prices.plants_1 = this.parse_value(jQuery('#ShortcutRes2_1', '#price_modal').text());
        this.prices.plants_2 = this.parse_value(jQuery('#ShortcutRes2_2', '#price_modal').text());
        this.prices.plants_3 = this.parse_value(jQuery('#ShortcutRes2_3', '#price_modal').text());
        this.prices.plants_4 = this.parse_value(jQuery('#ShortcutRes2_4', '#price_modal').text());
        this.prices.plants_5 = this.parse_value(jQuery('#ShortcutRes2_5', '#price_modal').text());
        this.prices.wood_1 = this.parse_value(jQuery('#ShortcutRes3_1', '#price_modal').text());
        this.prices.wood_2 = this.parse_value(jQuery('#ShortcutRes3_2', '#price_modal').text());
        this.prices.wood_3 = this.parse_value(jQuery('#ShortcutRes3_3', '#price_modal').text());
        this.prices.wood_4 = this.parse_value(jQuery('#ShortcutRes3_4', '#price_modal').text());
        this.prices.wood_5 = this.parse_value(jQuery('#ShortcutRes3_5', '#price_modal').text());
        this.prices.fish_1 = this.parse_value(jQuery('#ShortcutRes4_1', '#price_modal').text());
        this.prices.fish_2 = this.parse_value(jQuery('#ShortcutRes4_2', '#price_modal').text());
        this.prices.fish_3 = this.parse_value(jQuery('#ShortcutRes4_3', '#price_modal').text());
        this.prices.fish_4 = this.parse_value(jQuery('#ShortcutRes4_4', '#price_modal').text());
        this.prices.fish_5 = this.parse_value(jQuery('#ShortcutRes4_5', '#price_modal').text());
        this.prices.magic = this.parse_value(jQuery('#ShortcutRes3', '#price_modal').text());
        this.prices.relics = this.parse_value(jQuery('#ShortcutRes4', '#price_modal').text());
        this.prices.gems = this.parse_value(jQuery('#ShortcutRes5', '#price_modal').text());
        this.prices.orbs = this.parse_value(jQuery('#ShortcutRes6', '#price_modal').text());
        this.prices.scrolls = this.parse_value(jQuery('#ShortcutRes7', '#price_modal').text());
        this.prices.keys = Math.floor(this.prices.gems * this.key_gem + this.prices.relics * this.key_relic + this.prices.magic * this.key_magic);
        this.save();
        this.buildExpos();
    },
    parse_value: function (text) {
        var num = parseFloat(text);
        if (text.indexOf('k') !== -1) {
            num *= 1e3;
        }
        if (text.indexOf('m') !== -1) {
            num *= 1e6;
        }
        return Math.round(num);
    },
    parse_resources: function () {
        if (jQuery('#T1Ore', '#resources_modal').length === 0) {
            MQO_Expo_Calc.logText("missing resources");
            return false;
        }
        if (jQuery('#T2Ore', '#resources_modal').length === 0) {
            MQO_Expo_Calc.logText("missing resources");
            return false;
        }
        this.resources.rez_ore_1 = this.parse_value(jQuery('#T1Ore', '#resources_modal').text());
        this.resources.rez_ore_2 = this.parse_value(jQuery('#T2Ore', '#resources_modal').text());
        this.resources.rez_ore_3 = this.parse_value(jQuery('#T3Ore', '#resources_modal').text());
        this.resources.rez_ore_4 = this.parse_value(jQuery('#T4Ore', '#resources_modal').text());
        this.resources.rez_ore_5 = this.parse_value(jQuery('#T5Ore', '#resources_modal').text());
        this.resources.rez_plants_1 = this.parse_value(jQuery('#T1Gather', '#resources_modal').text());
        this.resources.rez_plants_2 = this.parse_value(jQuery('#T2Gather', '#resources_modal').text());
        this.resources.rez_plants_3 = this.parse_value(jQuery('#T3Gather', '#resources_modal').text());
        this.resources.rez_plants_4 = this.parse_value(jQuery('#T4Gather', '#resources_modal').text());
        this.resources.rez_plants_5 = this.parse_value(jQuery('#T5Gather', '#resources_modal').text());
        this.resources.rez_wood_1 = this.parse_value(jQuery('#T1Wood', '#resources_modal').text());
        this.resources.rez_wood_2 = this.parse_value(jQuery('#T2Wood', '#resources_modal').text());
        this.resources.rez_wood_3 = this.parse_value(jQuery('#T3Wood', '#resources_modal').text());
        this.resources.rez_wood_4 = this.parse_value(jQuery('#T4Wood', '#resources_modal').text());
        this.resources.rez_wood_5 = this.parse_value(jQuery('#T5Wood', '#resources_modal').text());
        this.resources.rez_fish_1 = this.parse_value(jQuery('#T1Fish', '#resources_modal').text());
        this.resources.rez_fish_2 = this.parse_value(jQuery('#T2Fish', '#resources_modal').text());
        this.resources.rez_fish_3 = this.parse_value(jQuery('#T3Fish', '#resources_modal').text());
        this.resources.rez_fish_4 = this.parse_value(jQuery('#T4Fish', '#resources_modal').text());
        this.resources.rez_fish_5 = this.parse_value(jQuery('#T5Fish', '#resources_modal').text());
        this.save();
        this.buildExpos();
    },
    buildExpos: function () {
        var start = Date.now();
        this.expos = [];
        for (var expoLevel in expoBase) {
            // var expoLevel = expoBase[expoLevel];
            var levels = expoLevel.match(/([0-9]+)/g);
            if (Math.min.apply(Math, levels) < this.user_input.min_expo) {
                continue;
            }
            var expo = expoBase[expoLevel];
            expo['res_1'] = resourceCosts[this.expo_tiers[0]][levels[0]]['TotalCost'];
            expo['res_2'] = resourceCosts[this.expo_tiers[1]][levels[1]]['TotalCost'];
            expo['res_3'] = resourceCosts[this.expo_tiers[2]][levels[2]]['TotalCost'];
            expo['res_4'] = resourceCosts[this.expo_tiers[3]][levels[3]]['TotalCost'];

            expo['res_1_cost'] = expo['res_1'] * this.lowestPrice(this.expo_tiers[0]);
            expo['res_2_cost'] = expo['res_2'] * this.lowestPrice(this.expo_tiers[1]);
            expo['res_3_cost'] = expo['res_3'] * this.lowestPrice(this.expo_tiers[2]);
            expo['res_4_cost'] = expo['res_4'] * this.lowestPrice(this.expo_tiers[3]);
            expo['res_4_price'] = this.lowestPrice(this.expo_tiers[3]);

            expo['cost'] = expo['res_1_cost'] + expo['res_2_cost'] + expo['res_3_cost'] + expo['res_4_cost'] + 50000;

            expo['time'] = Math.ceil(expoCost['time'][expo['time_key']][MQO_Expo_Calc.user_input.time_level] * Math.pow(0.975, MQO_Expo_Calc.user_input.king_inns));
            if (expo['time'] < this.user_input.min_time) {
                continue;
            }
            expo['hourly'] = (expo['time'] / 60);
            expo['key_max'] = expoCost['key'][expo['key_key']][MQO_Expo_Calc.user_input.key_level];
            expo['key_min'] = Math.floor(expo['key_max'] * 0.3);
            expo['key_average'] = (expo['key_max'] + expo['key_min']) / 2;

            expo['gem_max'] = expoCost['gem'][expo['gem_key']][MQO_Expo_Calc.user_input.gem_level];
            expo['gem_min'] = Math.floor(expo['gem_max'] * 0.3);
            expo['gem_average'] = (expo['gem_max'] + expo['gem_min']) / 2;

            expo['relic_max'] = expoCost['relic'][expo['relic_key']][MQO_Expo_Calc.user_input.relic_level];
            expo['relic_min'] = Math.floor(expo['relic_max'] * 0.3);
            expo['relic_average'] = (expo['relic_max'] + expo['relic_min']) / 2;

            expo['orb_max'] = expoCost['orb'][expo['orb_key']][MQO_Expo_Calc.user_input.orb_level];
            expo['orb_min'] = Math.floor(expo['orb_max'] * 0.3);
            expo['orb_average'] = (expo['orb_max'] + expo['orb_min']) / 2;

            expo['scroll_max'] = expoCost['scroll'][expo['scroll_key']][MQO_Expo_Calc.user_input.scroll_level];
            expo['scroll_min'] = Math.floor(expo['scroll_max'] * 0.3);
            expo['scroll_average'] = (expo['scroll_max'] + expo['scroll_min']) / 2;

            expo['income'] = (expo['key_average'] * this.prices.keys) + (expo['gem_average'] * this.prices.gems) + (expo['relic_average'] * this.prices.relics) + (expo['orb_average'] * this.prices.orbs) + (expo['scroll_average'] * this.prices.scrolls);

            expo['profit'] = expo['income'] - expo['cost'];

            expo['gem_current'] = MQO_Expo_Calc.user_input.gem_level;
            expo['gem_break'] = expoCost['gem'][expo['gem_key']].lastIndexOf(expoCost['gem'][expo['gem_key']][MQO_Expo_Calc.user_input.gem_level]) + 1;
            if (expo['gem_break'] === -1 || expo['gem_break'] > 40) {
                expo['gem_break'] = 'Never';
                expo['gem_increase'] = 'Never';
            } else {
                expo['gem_increase'] = expoCost['gem'][expo['gem_key']][expo['gem_break']] - expoCost['gem'][expo['gem_key']][MQO_Expo_Calc.user_input.gem_level]
            }


            expo['relic_current'] = MQO_Expo_Calc.user_input.relic_level;
            expo['relic_break'] = expoCost['relic'][expo['relic_key']].lastIndexOf(expoCost['relic'][expo['relic_key']][MQO_Expo_Calc.user_input.relic_level]) + 1;
            if (expo['relic_break'] === -1 || expo['relic_break'] > 40) {
                expo['relic_break'] = 'Never';
                expo['relic_increase'] = 'Never';
            } else {
                expo['relic_increase'] = expoCost['relic'][expo['relic_key']][expo['relic_break']] - expoCost['relic'][expo['relic_key']][MQO_Expo_Calc.user_input.relic_level]
            }

            expo['orb_current'] = MQO_Expo_Calc.user_input.orb_level;
            expo['orb_break'] = expoCost['orb'][expo['orb_key']].lastIndexOf(expoCost['orb'][expo['orb_key']][MQO_Expo_Calc.user_input.orb_level]) + 1;
            if (expo['orb_break'] === -1 || expo['orb_break'] > 40) {
                expo['orb_break'] = 'Never';
                expo['orb_increase'] = 'Never';
            } else {
                expo['orb_increase'] = expoCost['orb'][expo['orb_key']][expo['orb_break']] - expoCost['orb'][expo['orb_key']][MQO_Expo_Calc.user_input.orb_level]
            }

            expo['scroll_current'] = MQO_Expo_Calc.user_input.scroll_level;
            expo['scroll_break'] = expoCost['scroll'][expo['scroll_key']].lastIndexOf(expoCost['scroll'][expo['scroll_key']][MQO_Expo_Calc.user_input.scroll_level]) + 1;
            if (expo['scroll_break'] === -1 || expo['scroll_break'] > 40) {
                expo['scroll_break'] = 'Never';
                expo['scroll_increase'] = 'Never';
            } else {
                expo['scroll_increase'] = expoCost['scroll'][expo['scroll_key']][expo['scroll_break']] - expoCost['scroll'][expo['scroll_key']][MQO_Expo_Calc.user_input.scroll_level]
            }

            expo['key_current'] = MQO_Expo_Calc.user_input.key_level;
            expo['key_break'] = expoCost['key'][expo['key_key']].lastIndexOf(expoCost['key'][expo['key_key']][MQO_Expo_Calc.user_input.key_level]) + 1;
            if (expo['key_break'] === -1 || expo['key_break'] > 40) {
                expo['key_break'] = 'Never';
                expo['key_increase'] = 'Never';
            } else {
                expo['key_increase'] = expoCost['key'][expo['key_key']][expo['key_break']] - expoCost['key'][expo['key_key']][MQO_Expo_Calc.user_input.key_level]
            }

            expo['time_current'] = MQO_Expo_Calc.user_input.time_level;
            expo['time_break'] = expoCost['time'][expo['time_key']].lastIndexOf(expoCost['time'][expo['time_key']][MQO_Expo_Calc.user_input.time_level]) + 1;
            if (expo['time_break'] === -1 || expo['time_break'] > 40) {
                expo['time_break'] = 'Never';
                expo['time_increase'] = 'Never';
            } else {
                expo['time_increase'] = expoCost['time'][expo['time_key']][expo['time_break']] - expoCost['time'][expo['time_key']][MQO_Expo_Calc.user_input.time_level]
            }

            if (expo['profit'] < 0) {
                continue;
            }
            expo['profit_hourly'] = expo['profit'] / expo['hourly'];

            this.expos.push(expo);
        }
        this.table.clear();
        this.table_2.clear();
        this.table_3.clear();
        var slice = [];
        this.expos.sort(function (a, b) {
            return b.profit_hourly - a.profit_hourly;
        });
        slice = this.expos.slice(0, 100);
        for (var i = 0; i < slice.length; i++) {
            var expo = slice[i];
            if (i === 0) {
                this.best_short = expo;
            }
            this.table.row.add(this.buildExpoRow(expo));
        }
        this.expos.sort(function (a, b) {
            return b.profit - a.profit;
        });
        slice = this.expos.slice(0, 100);
        for (var i = 0; i < slice.length; i++) {
            var expo = slice[i];
            if (i === 0) {
                this.best_long = expo;
            }
            this.table_2.row.add(this.buildExpoRow(expo));
        }
        this.expos.sort(function (a, b) {
            if (b.time === a.time) {
                return b.profit_hourly - a.profit_hourly;
            }
            return b.time - a.time;
        });
        slice = this.expos.slice(0, 100);
        slice.sort(function (a, b) {
            return b.profit_hourly - a.profit_hourly;
        });
        for (var i = 0; i < slice.length; i++) {
            var expo = slice[i];
            if (i === 0) {
                this.best_long_2 = expo;
            }
            this.table_3.row.add(this.buildExpoRow(expo));
        }
        this.table.draw();
        this.table_2.draw();
        this.table_3.draw();
        this.calcuateNeededResources();
        var end = Date.now();
//        console.log((end - start));
    },
    buildExpoRow: function (expo) {
        return [
            this.buildTableExtra(expo),
            '<div class="btn tableExtra"><span class="glyphicon glyphicon-plus-sign"></span></div>',
            expo['name'],
            expo['time'],
            this.numberWithCommas(expo['cost']),
            this.numberWithCommas(expo['income']),
            this.numberWithCommas(Math.round(expo['profit'])),
            this.numberWithCommas(Math.round(expo['profit_hourly'])),
            Math.round(expo['gem_average'] + this.key_gem * expo['key_average']) + " (" + Math.round((expo['gem_average'] + this.key_gem * expo['key_average']) / expo['time'] * 60) + ")",
            Math.round(expo['relic_average'] + this.key_relic * expo['key_average']) + " (" + Math.round((expo['relic_average'] + this.key_relic * expo['key_average']) / expo['time'] * 60) + ")",
            Math.round(expo['orb_average']) + " (" + Math.round((expo['orb_average']) / expo['time'] * 60) + ")",
            Math.round(expo['scroll_average']) + " (" + Math.round((expo['scroll_average']) / expo['time'] * 60) + ")",
            expo['res_1'],
            expo['res_2'],
            expo['res_3'],
            expo['res_4']];
    },
    formatExtra: function (d) {
        return d[0];
    },
    buildTableExtra: function (expo) {
        // `d` is the original data object for the row
        return '<table class="table alert alert-info col-md-12">' +
                '<tr>' +
                '<th>Item</th>' +
                '<th>Current</th>' +
                '<th>Next</th>' +
                '<th>Increase</th>' +
                '<th>Item</th>' +
                '<th>Current</th>' +
                '<th>Next</th>' +
                '<th>Increase</th>' +
                '<th>Item</th>' +
                '<th>Current</th>' +
                '<th>Next</th>' +
                '<th>Increase</th>' +
                '</tr>' +
                '<tr>' +
                '<td>Gem</td>' +
                '<td>' + expo.gem_current + '</td>' +
                '<td>' + expo.gem_break + '</td>' +
                '<td>' + expo.gem_increase + '</td>' +
                '<td>Relic</td>' +
                '<td>' + expo.relic_current + '</td>' +
                '<td>' + expo.relic_break + '</td>' +
                '<td>' + expo.relic_increase + '</td>' +
                '<td>Orb</td>' +
                '<td>' + expo.orb_current + '</td>' +
                '<td>' + expo.orb_break + '</td>' +
                '<td>' + expo.orb_increase + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Scroll</td>' +
                '<td>' + expo.scroll_current + '</td>' +
                '<td>' + expo.scroll_break + '</td>' +
                '<td>' + expo.scroll_increase + '</td>' +
                '<td>Key</td>' +
                '<td>' + expo.key_current + '</td>' +
                '<td>' + expo.key_break + '</td>' +
                '<td>' + expo.key_increase + '</td>' +
                '<td>Time</td>' +
                '<td>' + expo.time_current + '</td>' +
                '<td>' + expo.time_break + '</td>' +
                '<td>' + expo.time_increase + '</td>' +
                '</tr>' +
                '</table>';
    },
    calcuateNeededResources: function () {
        var best_long = this.best_long;
        if (this.user_input.long_type === 2) {
            best_long = this.best_long_2;
        }
        var res_type_1 = this.resource_names[this.lowestPriceType(this.expo_tiers[0])].toLowerCase() + "_" + this.expo_tiers[0];
        var res_type_2 = this.resource_names[this.lowestPriceType(this.expo_tiers[1])].toLowerCase() + "_" + this.expo_tiers[1];
        var res_type_3 = this.resource_names[this.lowestPriceType(this.expo_tiers[2])].toLowerCase() + "_" + this.expo_tiers[2];
        var res_type_4 = this.resource_names[this.lowestPriceType(this.expo_tiers[3])].toLowerCase() + "_" + this.expo_tiers[3];
        jQuery('#res_short_name').text(this.best_short.name);
        jQuery('#res_long_name').text(best_long.name);
        var needRes = {};
        needRes["res_short_1"] = this.best_short.res_1 * this.user_input.expo_slots * this.user_input.short_run - this.resources['rez_' + res_type_1];
        needRes["res_short_2"] = this.best_short.res_2 * this.user_input.expo_slots * this.user_input.short_run - this.resources['rez_' + res_type_2];
        needRes["res_short_3"] = this.best_short.res_3 * this.user_input.expo_slots * this.user_input.short_run - this.resources['rez_' + res_type_3];
        needRes["res_short_4"] = this.best_short.res_4 * this.user_input.expo_slots * this.user_input.short_run - this.resources['rez_' + res_type_4];
        needRes["res_long_1"] = best_long.res_1 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_1];
        needRes["res_long_2"] = best_long.res_2 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_2];
        needRes["res_long_3"] = best_long.res_3 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_3];
        needRes["res_long_4"] = best_long.res_4 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_4];
        needRes["res_total_1"] = this.best_short.res_1 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_1 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_1];
        needRes["res_total_2"] = this.best_short.res_2 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_2 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_2];
        needRes["res_total_3"] = this.best_short.res_3 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_3 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_3];
        needRes["res_total_4"] = this.best_short.res_4 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_4 * this.user_input.expo_slots * this.user_input.long_run - this.resources['rez_' + res_type_4];
        needRes["res_gtotal_1"] = this.best_short.res_1 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_1 * this.user_input.expo_slots * this.user_input.long_run;
        needRes["res_gtotal_2"] = this.best_short.res_2 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_2 * this.user_input.expo_slots * this.user_input.long_run;
        needRes["res_gtotal_3"] = this.best_short.res_3 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_3 * this.user_input.expo_slots * this.user_input.long_run;
        needRes["res_gtotal_4"] = this.best_short.res_4 * this.user_input.expo_slots * this.user_input.short_run + best_long.res_4 * this.user_input.expo_slots * this.user_input.long_run;
        for (var key in needRes) {
            if (needRes[key] < 0) {
                needRes[key] = 0;
            }
        }

        needRes["res_short_cost"] = needRes["res_short_1"] * this.lowestPrice(this.expo_tiers[0]) + needRes["res_short_2"] * this.lowestPrice(this.expo_tiers[1]) + needRes["res_short_3"] * this.lowestPrice(this.expo_tiers[2]) + needRes["res_short_4"] * this.lowestPrice(this.expo_tiers[3]);
        needRes["res_long_cost"] = needRes["res_long_1"] * this.lowestPrice(this.expo_tiers[0]) + needRes["res_long_2"] * this.lowestPrice(this.expo_tiers[1]) + needRes["res_long_3"] * this.lowestPrice(this.expo_tiers[2]) + needRes["res_long_4"] * this.lowestPrice(this.expo_tiers[3]);
        needRes["res_total_cost"] = needRes["res_total_1"] * this.lowestPrice(this.expo_tiers[0]) + needRes["res_total_2"] * this.lowestPrice(this.expo_tiers[1]) + needRes["res_total_3"] * this.lowestPrice(this.expo_tiers[2]) + needRes["res_total_4"] * this.lowestPrice(this.expo_tiers[3]);
        needRes["res_gtotal_cost"] = needRes["res_gtotal_1"] * this.lowestPrice(this.expo_tiers[0]) + needRes["res_gtotal_2"] * this.lowestPrice(this.expo_tiers[1]) + needRes["res_gtotal_3"] * this.lowestPrice(this.expo_tiers[2]) + needRes["res_gtotal_4"] * this.lowestPrice(this.expo_tiers[3]);

        jQuery('#res_short_cost').text(this.numberWithCommas(needRes["res_short_cost"]));
        jQuery('#res_short_1').text(needRes["res_short_1"]);
        jQuery('#res_short_2').text(needRes["res_short_2"]);
        jQuery('#res_short_3').text(needRes["res_short_3"]);
        jQuery('#res_short_4').text(needRes["res_short_4"]);

        jQuery('#res_long_cost').text(this.numberWithCommas(needRes["res_long_cost"]));
        jQuery('#res_long_1').text(needRes["res_long_1"]);
        jQuery('#res_long_2').text(needRes["res_long_2"]);
        jQuery('#res_long_3').text(needRes["res_long_3"]);
        jQuery('#res_long_4').text(needRes["res_long_4"]);

        jQuery('#res_total_cost').text(this.numberWithCommas(needRes["res_total_cost"]));
        jQuery('#res_total_1').text(needRes["res_total_1"]);
        jQuery('#res_total_2').text(needRes["res_total_2"]);
        jQuery('#res_total_3').text(needRes["res_total_3"]);
        jQuery('#res_total_4').text(needRes["res_total_4"]);

        jQuery('#res_gtotal_cost').text(this.numberWithCommas(needRes["res_gtotal_cost"]));
        jQuery('#res_gtotal_1').text(needRes["res_gtotal_1"]);
        jQuery('#res_gtotal_2').text(needRes["res_gtotal_2"]);
        jQuery('#res_gtotal_3').text(needRes["res_gtotal_3"]);
        jQuery('#res_gtotal_4').text(needRes["res_gtotal_4"]);
    },
    lowestPrice: function (tier) {
        return Math.min(this.prices['ore_' + tier], this.prices['plants_' + tier], this.prices['wood_' + tier], this.prices['fish_' + tier]);
    },
    lowestPriceType: function (tier) {
        var prices = [this.prices['ore_' + tier], this.prices['plants_' + tier], this.prices['wood_' + tier], this.prices['fish_' + tier]];
        var lowestPrice = this.lowestPrice(tier);
        return prices.indexOf(lowestPrice);
    },
    run: function () {
        this.initDB();
        jQuery('.user_input').on('change', function () {
            var id = jQuery(this).prop('id');
            if (MQO_Expo_Calc.user_input[id] !== undefined) {
                var val = parseInt(jQuery(this).val());
                if (isNaN(val)) {
                    jQuery(this).val(MQO_Expo_Calc.user_input[id]);
                    return false;
                }
                if (id === "tiers" && val.toString().match(/^(?:([12345])(?!.*\1)){4,4}$/) === null) {
                    jQuery(this).val(MQO_Expo_Calc.user_input[id]);
                    return false;
                }
                MQO_Expo_Calc.user_input[id] = val;
            }
            MQO_Expo_Calc.save();
            MQO_Expo_Calc.buildExpos();
        });
        jQuery('.price').on('change', function () {
            var id = jQuery(this).prop('id');
            if (MQO_Expo_Calc.prices[id] !== undefined) {
                var val = parseInt(jQuery(this).val());
                if (isNaN(val)) {
                    jQuery(this).val(MQO_Expo_Calc.prices[id]);
                    return false;
                }
                MQO_Expo_Calc.prices[id] = val;
            }
            MQO_Expo_Calc.save();
            MQO_Expo_Calc.buildExpos();
        });
        jQuery('.resources').on('change', function () {
            var id = jQuery(this).prop('id');
            if (MQO_Expo_Calc.resources[id] !== undefined) {
                var val = parseInt(jQuery(this).val());
                if (isNaN(val)) {
                    jQuery(this).val(MQO_Expo_Calc.resources[id]);
                    return false;
                }
                MQO_Expo_Calc.resources[id] = val;
            }
            MQO_Expo_Calc.save();
        });
        this.table = jQuery('#expo_table').DataTable({
            "order": [
                [7, "desc"]
            ],
            "processing": true,
            "bDeferRender": true,
            "columnDefs": [
                {"visible": false, "targets": [0]}
            ]
        });
        jQuery('#expo_table tbody').on('click', 'td .tableExtra', function () {
            var tr = $(this).closest('tr');
            var row = MQO_Expo_Calc.table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                row.child(MQO_Expo_Calc.formatExtra(row.data())).show();
                tr.addClass('shown');
            }
        });
        this.table_2 = jQuery('#expo_table_2').DataTable({
            "order": [
                [6, "desc"]
            ],
            "processing": true,
            "bDeferRender": true,
            "columnDefs": [
                {"visible": false, "targets": [0]}
            ]
        });
        jQuery('#expo_table_2 tbody').on('click', 'td .tableExtra', function () {
            var tr = $(this).closest('tr');
            var row = MQO_Expo_Calc.table_2.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                row.child(MQO_Expo_Calc.formatExtra(row.data())).show();
                tr.addClass('shown');
            }
        });
        this.table_3 = jQuery('#expo_table_3').DataTable({
            "order": [
                [7, "desc"]
            ],
            "processing": true,
            "bDeferRender": true,
            "columnDefs": [
                {"visible": false, "targets": [0]}
            ]
        });
        jQuery('#expo_table_3 tbody').on('click', 'td .tableExtra', function () {
            var tr = $(this).closest('tr');
            var row = MQO_Expo_Calc.table_3.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                row.child(MQO_Expo_Calc.formatExtra(row.data())).show();
                tr.addClass('shown');
            }
        });
        jQuery('#editable').on('click', function () {
            jQuery(this).html("");
        });
        jQuery('#editable_2').on('click', function () {
            jQuery(this).html("");
        });
    },
    doWork: function () {
        if (this.loadState < 3) {
            return false;
        }
        MQO_Expo_Calc.update_prices();
        MQO_Expo_Calc.update_inputs();
        MQO_Expo_Calc.update_resources();
        MQO_Expo_Calc.buildExpos();
    }
};
MQO_Expo_Calc.run();
