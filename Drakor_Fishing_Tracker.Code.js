// ==UserScript==
// @name         Drakor Fishing Tracker
// @version      0.0.2
// @description  Tracks statistics of Fishing
// @author       Altizar
// @match        http://*.drakor.com*
// ==/UserScript==
var Drakor_Fishing_Tracker = {
    target: document.getElementById('drakorWorld'),
    config: {attributes: true, childList: true, characterData: true},
    data: {
        catches: {
            "Nothing": 0
        },
        runs: 0,
        exp: 0,
    },
    logText: function (text) {
        console.log(text);
    },
    save: function() {
        localStorage.setItem('Drakor_Fishing_Tracker_Save', JSON.stringify(Drakor_Fishing_Tracker.data));
    },
    load: function() {
        var retrievedObject = JSON.parse(localStorage.getItem('Drakor_Fishing_Tracker_Save'));
        if (retrievedObject !== null && retrievedObject !== undefined && retrievedObject.runs !== undefined) {
            this.data = retrievedObject;
            this.logText('Data Loaded...');
        } else {
            this.logText('Data Load Failed');
        }
        console.log(JSON.stringify(this.data));
    },
    observer : null,
    observer2 : null,
    parseData(data) {
        var result = jQuery('.viewMat', data).text().replace('[', '').replace(']', '');
        if (result !== '') {
            if (this.data.catches[result] === undefined) {
                this.data.catches[result] = 0;
            }
            this.data.catches[result]++;
        } else {
            this.data.catches.Nothing++;
        }
        var exp = parseInt(jQuery('.statValue', data).text());
        this.data.runs += 1;
        this.data.exp += exp;
        this.save();
        this.buildTable();
    },
    buildTable: function() {
        this.drawTable();
        var table = '';
        for (var key in this.data.catches) {
            var found = this.data.catches[key];
            var percent = parseInt(found / this.data.runs * 100);
            table += '<tr><td>'+key+'</td><td>'+found+'</td><td>'+percent+'<td></tr>';
        }
        table += '<tr><th>Runs</th><td colspan="2">'+this.data.runs+'</td></tr>';
        table += '<tr><th>Exp</th><td colspan="2">'+this.data.exp+'</td></tr>';
        table += '<tr><th>Exp Avg</th><td colspan="2">'+parseInt(this.data.exp/this.data.runs)+'</td></tr>';
        jQuery('#fishingtrackerlist').empty().append(table);
    },
    drawTable : function() {
        var target = document.getElementById('fishingtracker');
        if (target === null) {
            jQuery('#drakorWorld').append('<div id="fishingtracker" style="position: absolute;width: 200px;top: 0px;left: -235px" class="dContainer"><h3>Tracking Fishing</h3><table><thead><tr><th>Fish</th><th>Caught</th><th>Rate</th></tr></thead><tbody id="fishingtrackerlist"></tbody></table></div>');                        
        }
    },
    run: function() {
        this.load();
        this.observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    var target = document.getElementById('skillResults');
                    if (target !== null) {
                        Drakor_Fishing_Tracker.buildTable();
                        Drakor_Fishing_Tracker.observer2.observe(target, Drakor_Fishing_Tracker.config);
                    }
                }
            });
        });
        this.observer2 = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    Drakor_Fishing_Tracker.parseData(mutation.addedNodes[1]);
                    console.log(JSON.stringify(Drakor_Fishing_Tracker.data));
                }
            });
        });
        this.observer.observe(this.target, this.config);
    }
};
Drakor_Fishing_Tracker.run();
