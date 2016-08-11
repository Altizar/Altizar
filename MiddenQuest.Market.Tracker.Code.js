MQO_MarketPricesTracker = {
  orginalMessageCode: function(event) {},
  hasStarted: false,
  prices: {},
  logText: function(text) {
    // jQuery('#messageData').append('<div>' + this.dump(text) + '</div>');
    console.log(text);
  },
  dump: function(arr, level) {
    var dumped_text = "";
    if (!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";

    if (typeof(arr) == 'object') { //Array/Hashes/Objects 
      for (var item in arr) {
        var value = arr[item];

        if (typeof(value) == 'object') { //If it is an array,
          dumped_text += level_padding + "'" + item + "' ...\n";
          dumped_text += dump(value, level + 1);
        } else {
          dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
      }
    } else { //Stings/Chars/Numbers etc.
      dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
  },
  save: function() {
    localStorage.setItem('MQO_MarketPricesTracker_Save', JSON.stringify(this.prices));
    this.logText('Data Saved');
  },
  load: function() {
    var retrievedObject = localStorage.getItem('MQO_MarketPricesTracker_Save');
    var retrievedObject = JSON.parse(localStorage.getItem('MQO_MarketPricesTracker_Save'));
    if (retrievedObject != undefined && retrievedObject.ore_1 != undefined) {
      this.prices = retrievedObject;
      this.logText('loaded Data');
    } else {
      this.prices = {
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
      this.logText('Data Load Failed');
    }
  },
  message_parser: function(message) {
    var date = this.current_date();
    this.prices.ore_1[date] = this.parse_value(jQuery('#ShortcutRes1_1', message).text());
    this.prices.ore_2[date] = this.parse_value(jQuery('#ShortcutRes1_2', message).text());
    this.prices.ore_3[date] = this.parse_value(jQuery('#ShortcutRes1_3', message).text());
    this.prices.ore_4[date] = this.parse_value(jQuery('#ShortcutRes1_4', message).text());
    this.prices.ore_5[date] = this.parse_value(jQuery('#ShortcutRes1_5', message).text());
    this.prices.plants_1[date] = this.parse_value(jQuery('#ShortcutRes2_1', message).text());
    this.prices.plants_2[date] = this.parse_value(jQuery('#ShortcutRes2_2', message).text());
    this.prices.plants_3[date] = this.parse_value(jQuery('#ShortcutRes2_3', message).text());
    this.prices.plants_4[date] = this.parse_value(jQuery('#ShortcutRes2_4', message).text());
    this.prices.plants_5[date] = this.parse_value(jQuery('#ShortcutRes2_5', message).text());
    this.prices.wood_1[date] = this.parse_value(jQuery('#ShortcutRes3_1', message).text());
    this.prices.wood_2[date] = this.parse_value(jQuery('#ShortcutRes3_2', message).text());
    this.prices.wood_3[date] = this.parse_value(jQuery('#ShortcutRes3_3', message).text());
    this.prices.wood_4[date] = this.parse_value(jQuery('#ShortcutRes3_4', message).text());
    this.prices.wood_5[date] = this.parse_value(jQuery('#ShortcutRes3_5', message).text());
    this.prices.fish_1[date] = this.parse_value(jQuery('#ShortcutRes4_1', message).text());
    this.prices.fish_2[date] = this.parse_value(jQuery('#ShortcutRes4_2', message).text());
    this.prices.fish_3[date] = this.parse_value(jQuery('#ShortcutRes4_3', message).text());
    this.prices.fish_4[date] = this.parse_value(jQuery('#ShortcutRes4_4', message).text());
    this.prices.fish_5[date] = this.parse_value(jQuery('#ShortcutRes4_5', message).text());
    this.prices.magic[date] = this.parse_value(jQuery('#ShortcutRes3', message).text());
    this.prices.relics[date] = this.parse_value(jQuery('#ShortcutRes4', message).text());
    this.prices.gems[date] = this.parse_value(jQuery('#ShortcutRes5', message).text());
    this.prices.orbs[date] = this.parse_value(jQuery('#ShortcutRes6', message).text());
    this.prices.scrolls[date] = this.parse_value(jQuery('#ShortcutRes7', message).text());
    this.save();
  },
  parse_value(text) {
    var num = parseInt(text);
    if (text.indexOf('k') !== -1) {
      num *= 1e3;
    }
    if (text.indexOf('m') !== -1) {
      num *= 1e6;
    }
    return num;
  },
  current_date: function() {
    var theDate = new Date();
    theDate.setSeconds(0);
    theDate.setMilliseconds(0);
    theDate.setMinutes(theDate.getMinutes() - (theDate.getMinutes() % 5));
    return theDate.getTime() / 1000;
  },
  drawChart: function() {
    if (jQuery('#container').length === 0) {
      jQuery('body').append('<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
    }
    graphData = [];
    for (var key in this.prices) {
      graphData.push({
        name: key,
        data: []
      });
      for (var timestamp in this.prices[key]) {
        graphData[graphData.length - 1].data.push([timestamp * 10000, this.prices[key][timestamp]]);
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
  trackMessage: function(event) {
    var message = event.data.split('|');
    if (message[0] === "LOADPAGE") {
      var hasMarket = jQuery('#ShortcutRes1_1', message[1]).length;
      if (hasMarket > 1) {
        this.message_parser(message[1]);
      }
    }
    MQO_MarketPricesTracker.orginalMessageCode(event);
  },
  start: function() {
    if (this.hasStarted) {
      return;
    }
    this.load();
    MQO_MarketPricesTracker.orginalMessageCode = ws.onmessage;
    ws.onmessage = this.trackMessage;
    this.hasStarted = true;
    this.logText('Running');
  }
};
MQO_MarketPricesTracker.start();
