// ==UserScript==
// @name         MidenQuest - Expo Send Highlighter
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.9.1
// @description  MidenQuest - Expo Send Highlighter
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Expo.Send.Highlighter.js
// @updateURL    https://altizar.github.io/MiddenQuest.Expo.Send.Highlighter.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*

var MQO_Expo_Button_Highlighter = {
    resourceCosts: {
        "T1": [{
                "BaseCost": 0,
                "TotalCost": 0
            }, {
                "BaseCost": 5000,
                "TotalCost": 5000
            }, {
                "BaseCost": 6000,
                "TotalCost": 11000
            }, {
                "BaseCost": 7200,
                "TotalCost": 18200
            }, {
                "BaseCost": 8640,
                "TotalCost": 26840
            }, {
                "BaseCost": 10368,
                "TotalCost": 37208
            }, {
                "BaseCost": 12442,
                "TotalCost": 49650
            }, {
                "BaseCost": 14930,
                "TotalCost": 64580
            }, {
                "BaseCost": 17916,
                "TotalCost": 82496
            }, {
                "BaseCost": 21500,
                "TotalCost": 103995
            }, {
                "BaseCost": 25799,
                "TotalCost": 129794
            }, {
                "BaseCost": 30959,
                "TotalCost": 160753
            }, {
                "BaseCost": 37151,
                "TotalCost": 197903
            }, {
                "BaseCost": 44581,
                "TotalCost": 242484
            }, {
                "BaseCost": 53497,
                "TotalCost": 295980
            }, {
                "BaseCost": 64196,
                "TotalCost": 360176
            }, {
                "BaseCost": 77036,
                "TotalCost": 437211
            }, {
                "BaseCost": 92443,
                "TotalCost": 529653
            }, {
                "BaseCost": 110931,
                "TotalCost": 640584
            }, {
                "BaseCost": 133117,
                "TotalCost": 773700
            }, {
                "BaseCost": 159740,
                "TotalCost": 933440
            }, {
                "BaseCost": 191688,
                "TotalCost": 1125128
            }, {
                "BaseCost": 230026,
                "TotalCost": 1355154
            }, {
                "BaseCost": 276031,
                "TotalCost": 1631185
            }, {
                "BaseCost": 331237,
                "TotalCost": 1962422
            }, {
                "BaseCost": 397485,
                "TotalCost": 2359906
            }, {
                "BaseCost": 476982,
                "TotalCost": 2836887
            }, {
                "BaseCost": 572378,
                "TotalCost": 3409264
            }, {
                "BaseCost": 686853,
                "TotalCost": 4096117
            }, {
                "BaseCost": 824224,
                "TotalCost": 4920340
            }, {
                "BaseCost": 989068,
                "TotalCost": 5909408
            }, {
                "BaseCost": 1186882,
                "TotalCost": 7096290
            }, {
                "BaseCost": 1424258,
                "TotalCost": 8520548
            }, {
                "BaseCost": 1709110,
                "TotalCost": 10229657
            }, {
                "BaseCost": 2050932,
                "TotalCost": 12280589
            }, {
                "BaseCost": 2461118,
                "TotalCost": 14741706
            }, {
                "BaseCost": 2953342,
                "TotalCost": 17695047
            }, {
                "BaseCost": 3544010,
                "TotalCost": 21239057
            }, {
                "BaseCost": 4252812,
                "TotalCost": 25491868
            }, {
                "BaseCost": 5103374,
                "TotalCost": 30595241
            }, {
                "BaseCost": 6124049,
                "TotalCost": 36719290
            }],
        "T2": [{
                "BaseCost": 0,
                "TotalCost": 0
            }, {
                "BaseCost": 3760,
                "TotalCost": 3760
            }, {
                "BaseCost": 4512,
                "TotalCost": 8272
            }, {
                "BaseCost": 5415,
                "TotalCost": 13687
            }, {
                "BaseCost": 6498,
                "TotalCost": 20184
            }, {
                "BaseCost": 7797,
                "TotalCost": 27981
            }, {
                "BaseCost": 9357,
                "TotalCost": 37337
            }, {
                "BaseCost": 11228,
                "TotalCost": 48564
            }, {
                "BaseCost": 13473,
                "TotalCost": 62037
            }, {
                "BaseCost": 16168,
                "TotalCost": 78204
            }, {
                "BaseCost": 19401,
                "TotalCost": 97605
            }, {
                "BaseCost": 23281,
                "TotalCost": 120886
            }, {
                "BaseCost": 27938,
                "TotalCost": 148823
            }, {
                "BaseCost": 33525,
                "TotalCost": 182348
            }, {
                "BaseCost": 40230,
                "TotalCost": 222577
            }, {
                "BaseCost": 48276,
                "TotalCost": 270853
            }, {
                "BaseCost": 57931,
                "TotalCost": 328783
            }, {
                "BaseCost": 69517,
                "TotalCost": 398299
            }, {
                "BaseCost": 83420,
                "TotalCost": 481719
            }, {
                "BaseCost": 100104,
                "TotalCost": 581823
            }, {
                "BaseCost": 120125,
                "TotalCost": 701947
            }, {
                "BaseCost": 144150,
                "TotalCost": 846097
            }, {
                "BaseCost": 172980,
                "TotalCost": 1019076
            }, {
                "BaseCost": 207576,
                "TotalCost": 1226651
            }, {
                "BaseCost": 249091,
                "TotalCost": 1475741
            }, {
                "BaseCost": 298909,
                "TotalCost": 1774649
            }, {
                "BaseCost": 358690,
                "TotalCost": 2133339
            }, {
                "BaseCost": 430428,
                "TotalCost": 2563767
            }, {
                "BaseCost": 516514,
                "TotalCost": 3080280
            }, {
                "BaseCost": 619816,
                "TotalCost": 3700096
            }, {
                "BaseCost": 743780,
                "TotalCost": 4443875
            }, {
                "BaseCost": 892535,
                "TotalCost": 5336410
            }, {
                "BaseCost": 1071042,
                "TotalCost": 6407452
            }, {
                "BaseCost": 1285251,
                "TotalCost": 7692702
            }, {
                "BaseCost": 1542301,
                "TotalCost": 9235003
            }, {
                "BaseCost": 1850761,
                "TotalCost": 11085763
            }, {
                "BaseCost": 2220913,
                "TotalCost": 13306676
            }, {
                "BaseCost": 2665096,
                "TotalCost": 15971771
            }, {
                "BaseCost": 3198115,
                "TotalCost": 19169885
            }, {
                "BaseCost": 3837737,
                "TotalCost": 23007622
            }, {
                "BaseCost": 4605285,
                "TotalCost": 27612906
            }],
        "T3": [{
                "BaseCost": 0,
                "TotalCost": 0
            }, {
                "BaseCost": 2500,
                "TotalCost": 2500
            }, {
                "BaseCost": 3000,
                "TotalCost": 5500
            }, {
                "BaseCost": 3600,
                "TotalCost": 9100
            }, {
                "BaseCost": 4320,
                "TotalCost": 13420
            }, {
                "BaseCost": 5184,
                "TotalCost": 18604
            }, {
                "BaseCost": 6221,
                "TotalCost": 24825
            }, {
                "BaseCost": 7465,
                "TotalCost": 32290
            }, {
                "BaseCost": 8958,
                "TotalCost": 41248
            }, {
                "BaseCost": 10750,
                "TotalCost": 51998
            }, {
                "BaseCost": 12900,
                "TotalCost": 64897
            }, {
                "BaseCost": 15480,
                "TotalCost": 80377
            }, {
                "BaseCost": 18576,
                "TotalCost": 98952
            }, {
                "BaseCost": 22291,
                "TotalCost": 121242
            }, {
                "BaseCost": 26749,
                "TotalCost": 147990
            }, {
                "BaseCost": 32098,
                "TotalCost": 180088
            }, {
                "BaseCost": 38518,
                "TotalCost": 218606
            }, {
                "BaseCost": 46222,
                "TotalCost": 264827
            }, {
                "BaseCost": 55466,
                "TotalCost": 320292
            }, {
                "BaseCost": 66559,
                "TotalCost": 386850
            }, {
                "BaseCost": 79870,
                "TotalCost": 466720
            }, {
                "BaseCost": 95844,
                "TotalCost": 562564
            }, {
                "BaseCost": 115013,
                "TotalCost": 677577
            }, {
                "BaseCost": 138016,
                "TotalCost": 815593
            }, {
                "BaseCost": 165619,
                "TotalCost": 981211
            }, {
                "BaseCost": 198743,
                "TotalCost": 1179953
            }, {
                "BaseCost": 238491,
                "TotalCost": 1418444
            }, {
                "BaseCost": 286189,
                "TotalCost": 1704632
            }, {
                "BaseCost": 343427,
                "TotalCost": 2048059
            }, {
                "BaseCost": 412112,
                "TotalCost": 2460170
            }, {
                "BaseCost": 494534,
                "TotalCost": 2954704
            }, {
                "BaseCost": 593441,
                "TotalCost": 3548145
            }, {
                "BaseCost": 712129,
                "TotalCost": 4260274
            }, {
                "BaseCost": 854555,
                "TotalCost": 5114829
            }, {
                "BaseCost": 1025466,
                "TotalCost": 6140295
            }, {
                "BaseCost": 1230559,
                "TotalCost": 7370853
            }, {
                "BaseCost": 1476671,
                "TotalCost": 8847524
            }, {
                "BaseCost": 1772005,
                "TotalCost": 10619529
            }, {
                "BaseCost": 2126406,
                "TotalCost": 12745934
            }, {
                "BaseCost": 2551687,
                "TotalCost": 15297621
            }, {
                "BaseCost": 3062025,
                "TotalCost": 18359645
            }],
        "T4": [{
                "BaseCost": 0,
                "TotalCost": 0
            }, {
                "BaseCost": 1250,
                "TotalCost": 1250
            }, {
                "BaseCost": 1500,
                "TotalCost": 2750
            }, {
                "BaseCost": 1800,
                "TotalCost": 4550
            }, {
                "BaseCost": 2160,
                "TotalCost": 6710
            }, {
                "BaseCost": 2592,
                "TotalCost": 9302
            }, {
                "BaseCost": 3111,
                "TotalCost": 12413
            }, {
                "BaseCost": 3733,
                "TotalCost": 16145
            }, {
                "BaseCost": 4479,
                "TotalCost": 20624
            }, {
                "BaseCost": 5375,
                "TotalCost": 25999
            }, {
                "BaseCost": 6450,
                "TotalCost": 32449
            }, {
                "BaseCost": 7740,
                "TotalCost": 40189
            }, {
                "BaseCost": 9288,
                "TotalCost": 49476
            }, {
                "BaseCost": 11146,
                "TotalCost": 60621
            }, {
                "BaseCost": 13375,
                "TotalCost": 73995
            }, {
                "BaseCost": 16049,
                "TotalCost": 90044
            }, {
                "BaseCost": 19259,
                "TotalCost": 109303
            }, {
                "BaseCost": 23111,
                "TotalCost": 132414
            }, {
                "BaseCost": 27733,
                "TotalCost": 160146
            }, {
                "BaseCost": 33280,
                "TotalCost": 193425
            }, {
                "BaseCost": 39935,
                "TotalCost": 233360
            }, {
                "BaseCost": 47922,
                "TotalCost": 281282
            }, {
                "BaseCost": 57507,
                "TotalCost": 338789
            }, {
                "BaseCost": 69008,
                "TotalCost": 407797
            }, {
                "BaseCost": 82810,
                "TotalCost": 490606
            }, {
                "BaseCost": 99372,
                "TotalCost": 589977
            }, {
                "BaseCost": 119246,
                "TotalCost": 709222
            }, {
                "BaseCost": 143095,
                "TotalCost": 852316
            }, {
                "BaseCost": 171714,
                "TotalCost": 1024030
            }, {
                "BaseCost": 206056,
                "TotalCost": 1230085
            }, {
                "BaseCost": 247267,
                "TotalCost": 1477352
            }, {
                "BaseCost": 296721,
                "TotalCost": 1774073
            }, {
                "BaseCost": 356065,
                "TotalCost": 2130137
            }, {
                "BaseCost": 427278,
                "TotalCost": 2557415
            }, {
                "BaseCost": 512733,
                "TotalCost": 3070148
            }, {
                "BaseCost": 615280,
                "TotalCost": 3685427
            }, {
                "BaseCost": 738336,
                "TotalCost": 4423762
            }, {
                "BaseCost": 886003,
                "TotalCost": 5309765
            }, {
                "BaseCost": 1063203,
                "TotalCost": 6372967
            }, {
                "BaseCost": 1275844,
                "TotalCost": 7648811
            }, {
                "BaseCost": 1531013,
                "TotalCost": 9179823
            }],
        "T5": [{
                "BaseCost": 0,
                "TotalCost": 0
            }, {
                "BaseCost": 500,
                "TotalCost": 500
            }, {
                "BaseCost": 600,
                "TotalCost": 1100
            }, {
                "BaseCost": 720,
                "TotalCost": 1820
            }, {
                "BaseCost": 864,
                "TotalCost": 2684
            }, {
                "BaseCost": 1037,
                "TotalCost": 3721
            }, {
                "BaseCost": 1245,
                "TotalCost": 4965
            }, {
                "BaseCost": 1493,
                "TotalCost": 6458
            }, {
                "BaseCost": 1792,
                "TotalCost": 8250
            }, {
                "BaseCost": 2150,
                "TotalCost": 10400
            }, {
                "BaseCost": 2580,
                "TotalCost": 12980
            }, {
                "BaseCost": 3096,
                "TotalCost": 16076
            }, {
                "BaseCost": 3716,
                "TotalCost": 19791
            }, {
                "BaseCost": 4459,
                "TotalCost": 24249
            }, {
                "BaseCost": 5350,
                "TotalCost": 29598
            }, {
                "BaseCost": 6420,
                "TotalCost": 36018
            }, {
                "BaseCost": 7704,
                "TotalCost": 43722
            }, {
                "BaseCost": 9245,
                "TotalCost": 52966
            }, {
                "BaseCost": 11094,
                "TotalCost": 64059
            }, {
                "BaseCost": 13312,
                "TotalCost": 77370
            }, {
                "BaseCost": 15974,
                "TotalCost": 93344
            }, {
                "BaseCost": 19169,
                "TotalCost": 112513
            }, {
                "BaseCost": 23003,
                "TotalCost": 135516
            }, {
                "BaseCost": 27604,
                "TotalCost": 163119
            }, {
                "BaseCost": 33124,
                "TotalCost": 196243
            }, {
                "BaseCost": 39749,
                "TotalCost": 235991
            }, {
                "BaseCost": 47699,
                "TotalCost": 283689
            }, {
                "BaseCost": 57238,
                "TotalCost": 340927
            }, {
                "BaseCost": 68686,
                "TotalCost": 409612
            }, {
                "BaseCost": 82423,
                "TotalCost": 492034
            }, {
                "BaseCost": 98907,
                "TotalCost": 590941
            }, {
                "BaseCost": 118689,
                "TotalCost": 709629
            }, {
                "BaseCost": 142426,
                "TotalCost": 852055
            }, {
                "BaseCost": 170911,
                "TotalCost": 1022966
            }, {
                "BaseCost": 205094,
                "TotalCost": 1228059
            }, {
                "BaseCost": 246112,
                "TotalCost": 1474171
            }, {
                "BaseCost": 295335,
                "TotalCost": 1769505
            }, {
                "BaseCost": 354401,
                "TotalCost": 2123906
            }, {
                "BaseCost": 425282,
                "TotalCost": 2549187
            }, {
                "BaseCost": 510338,
                "TotalCost": 3059525
            }, {
                "BaseCost": 612405,
                "TotalCost": 3671929
            }]
    },
    target: document.getElementById('ContentLoad'),
    config: {
        attributes: true,
        childList: true,
        characterData: true
    },
    expoCount: 5,
    resetBest: function () {
        this.best = {
            T1: {
                name: 'None',
                value: 0
            },
            T2: {
                name: 'None',
                value: 0
            },
            T3: {
                name: 'None',
                value: 0
            },
            T4: {
                name: 'None',
                value: 0
            },
            T5: {
                name: 'None',
                value: 0
            }
        };
    },
    best: {
        T1: {
            name: 'None',
            value: 0
        },
        T2: {
            name: 'None',
            value: 0
        },
        T3: {
            name: 'None',
            value: 0
        },
        T4: {
            name: 'None',
            value: 0
        },
        T5: {
            name: 'None',
            value: 0
        }
    },
    getBest: function (tier) {
        return this.best[tier].name;
    },
    setBest: function (tier, name, value) {
        if (this.best[tier].value < value) {
            this.best[tier].value = value;
            this.best[tier].name = name;
        }
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
        this.resetBest();
        this.parseStock();
        var lowest = null;
        var worstTier = 1;
        var worstTierValue = 99;
        jQuery(jQuery('#ContentLoad > div:last-child > div > div:nth-child(3) > div:last-child > div:nth-child(2) > div').text().match(/[WHM][a-z]* Lv. [0-9]+Requires: T[0-5]+/g)).each(function () {
            var name = this.match(/[WHM][a-z]* Lv. ([0-9]+)Requires: T([0-5]+)/);
            if (worstTierValue > parseInt(name[1])) {
                worstTierValue = parseInt(name[1]);
                worstTier = name[2];
            }
        });
        jQuery('#ContentLoad button').each(function () {
            var text = jQuery(this).text().match(/([^T]*)[T]([0-5])[ ](\w*)/);
            if (text !== null) {
                var best = MQO_Expo_Button_Highlighter.getBest('T' + text[2]);
                var name = text[3] + '_' + text[2];
                var stockNeed = MQO_Expo_Button_Highlighter.parse_value(text[1]);
                var stockNeedVolume = $.grep(MQO_Expo_Button_Highlighter.resourceCosts['T' + text[2]], function (e) {
                    return e.BaseCost > (stockNeed * 0.95) && e.BaseCost < (stockNeed * 1.05);
                })[0]['TotalCost'];
                var stockNeedVolume2 = $.grep(MQO_Expo_Button_Highlighter.resourceCosts['T' + text[2]], function (e) {
                    return e.BaseCost > (stockNeed * 0.95) && e.BaseCost < (stockNeed * 1.05);
                });
                if (stockNeedVolume == undefined) {
                    stockNeedVolume = stockNeed;
                }
                var stockNeed2 = stockNeedVolume * MQO_Expo_Button_Highlighter.expoCount;
                var stockOwn = MQO_Expo_Button_Highlighter.stock[name];
                if (stockOwn < stockNeed) {
                    jQuery(this).removeClass("ui-state-default").removeClass("darkBtn").removeClass("ui-state-secondary").addClass("ui-state-error").unbind('click');
                } else if (stockOwn < stockNeed2) {
                    jQuery(this).removeClass("ui-state-default").removeClass("darkBtn").addClass("ui-state-secondary");
                } else if (text[3] === best) {
                    jQuery(this).removeClass("ui-state-default").removeClass("darkBtn").addClass("ui-state-green");
                }
                if (text[3] === best) {
                    if (text[2] === worstTier) {
                        lowest = jQuery(this).clone(true);
                    }
                    jQuery(this).parent().prepend('<hr>');
                    jQuery(this).parent().prepend(jQuery(this).clone(true));
                    jQuery(this).parent().parent().parent().css('height', 'inherit');
                }
            } else {
                jQuery(this).parent().prepend('<hr>');
                jQuery(this).parent().prepend(jQuery(lowest).clone(true));
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
        this.setBest('T1', 'Ore', this.stock.Ore_1);
        this.setBest('T2', 'Ore', this.stock.Ore_2);
        this.setBest('T3', 'Ore', this.stock.Ore_3);
        this.setBest('T4', 'Ore', this.stock.Ore_4);
        this.setBest('T5', 'Ore', this.stock.Ore_5);
        this.setBest('T1', 'Plant', this.stock.Plant_1);
        this.setBest('T2', 'Plant', this.stock.Plant_2);
        this.setBest('T3', 'Plant', this.stock.Plant_3);
        this.setBest('T4', 'Plant', this.stock.Plant_4);
        this.setBest('T5', 'Plant', this.stock.Plant_5);
        this.setBest('T1', 'Wood', this.stock.Wood_1);
        this.setBest('T2', 'Wood', this.stock.Wood_2);
        this.setBest('T3', 'Wood', this.stock.Wood_3);
        this.setBest('T4', 'Wood', this.stock.Wood_4);
        this.setBest('T5', 'Wood', this.stock.Wood_5);
        this.setBest('T1', 'Fish', this.stock.Fish_1);
        this.setBest('T2', 'Fish', this.stock.Fish_2);
        this.setBest('T3', 'Fish', this.stock.Fish_3);
        this.setBest('T4', 'Fish', this.stock.Fish_4);
        this.setBest('T5', 'Fish', this.stock.Fish_5);
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
        this.addGlobalStyle('.ui-state-green { border: 1px solid #45930b;background: #4ca20b;font-weight: normal;color: #ffffff; }');
        this.addGlobalStyle('.ui-state-green:hover { border: 1px solid #8bd83b;background: #4eb305;font-weight: normal;color: #ffffff; }');
    },
    addGlobalStyle: function (css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
};
MQO_Expo_Button_Highlighter.start();
MQO_Expo_Button_Highlighter.updateButtons();
if (unsafeWindow.MQO_Expo_Button_Highlighter === undefined) {
    unsafeWindow.MQO_Expo_Button_Highlighter = MQO_Expo_Button_Highlighter;
}
