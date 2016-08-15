MQO_Exp_Upgrades = {
  logText: function(text) {
    jQuery('#messageData').append('<div>' + this.dump(text) + '</div>');
    console.log(text);
  },
  dump: function(arr, level) {
    var dumped_text = "";
    if (!level)
      level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++)
      level_padding += "    ";

    if (typeof(arr) == 'object') { //Array/Hashes/Objects 
      for (var item in arr) {
        var value = arr[item];

        if (typeof(value) == 'object') { //If it is an array,
          dumped_text += level_padding + "'" + item + "' ...\n";
          dumped_text += this.dump(value, level + 1);
        } else {
          dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
      }
    } else { //Stings/Chars/Numbers etc.
      dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
  },
  hsvToRgb: function(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
      // Achromatic (grey)
      r = g = b = v;
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      default: // case 5:
        r = v;
        g = p;
        b = q;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  randomColors: function(total) {
    var i = 360 / (total - 1); // distribute the colors evenly on the hue range
    var r = []; // hold the generated colors
    for (var x = 0; x < total; x++) {
      r.push(this.hsvToRgb(i * x, 100, 100)); // you can also alternate the saturation and value for even more contrast between the colors
    }
    return r;
  },
  RGB2HSV: function(rgb) {
    hsv = new Object();
    max = this.max3(rgb.r, rgb.g, rgb.b);
    dif = max - this.min3(rgb.r, rgb.g, rgb.b);
    hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
    if (hsv.saturation == 0) hsv.hue = 0;
    else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
    else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
    else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
    if (hsv.hue < 0.0) hsv.hue += 360.0;
    hsv.value = Math.round(max * 100 / 255);
    hsv.hue = Math.round(hsv.hue);
    hsv.saturation = Math.round(hsv.saturation);
    return hsv;
  },
  HSV2RGB: function(hsv) {
    var rgb = new Object();
    if (hsv.saturation == 0) {
      rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
    } else {
      hsv.hue /= 60;
      hsv.saturation /= 100;
      hsv.value /= 100;
      i = Math.floor(hsv.hue);
      f = hsv.hue - i;
      p = hsv.value * (1 - hsv.saturation);
      q = hsv.value * (1 - hsv.saturation * f);
      t = hsv.value * (1 - hsv.saturation * (1 - f));
      switch (i) {
        case 0:
          rgb.r = hsv.value;
          rgb.g = t;
          rgb.b = p;
          break;
        case 1:
          rgb.r = q;
          rgb.g = hsv.value;
          rgb.b = p;
          break;
        case 2:
          rgb.r = p;
          rgb.g = hsv.value;
          rgb.b = t;
          break;
        case 3:
          rgb.r = p;
          rgb.g = q;
          rgb.b = hsv.value;
          break;
        case 4:
          rgb.r = t;
          rgb.g = p;
          rgb.b = hsv.value;
          break;
        default:
          rgb.r = hsv.value;
          rgb.g = p;
          rgb.b = q;
      }
      rgb.r = Math.round(rgb.r * 255);
      rgb.g = Math.round(rgb.g * 255);
      rgb.b = Math.round(rgb.b * 255);
    }
    return rgb;
  },
  HueShift: function(h, s) {
    h += s;
    while (h >= 360.0) h -= 360.0;
    while (h < 0.0) h += 360.0;
    return h;
  },
  min3: function(a, b, c) {
    return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
  },
  max3: function(a, b, c) {
    return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
  },
  invertColors: function(color) {
    temprgb= {r:color[0],g:color[1],b:color[2]};
temphsv=this.RGB2HSV(temprgb);
temphsv.hue=this.HueShift(temphsv.hue,180.0);
temprgb=this.HSV2RGB(temphsv);
    var newColor = [];
    newColor[0] = temprgb.r;
    newColor[1] = temprgb.g;
    newColor[2] = temprgb.b;
    return newColor;
  },
  generateRows(tableName, factor) {
    var dataSet = [];
    var columnSet = [];
    var allData = [];
    columnSet.push({
      title: 'Level'
    });
    for (var i = 0; i <= 30; i++) {
      columnSet.push({
        title: 'Lvl ' + i
      });
    }
    var table = jQuery('#' + tableName).DataTable({
      dataset: dataSet,
      columns: columnSet
    });
    for (var lvl = 1; lvl <= 20; lvl++) {
      var row = [];
      row.push(lvl);

      for (var i = 0; i <= 30; i++) {
        var max;
        var min;
        var text;
        switch (tableName) {
          case 'gems':
            max = Math.round(0.2 * 4 * lvl + Math.round((0.5 * (1 - Math.exp(-i / 30))) * (lvl + lvl), 0), 0);
            min = Math.round(0.3 * max);
            text = min + "=>" + max;
            break;
          case 'relics':
            max = Math.round(1.3 * 4 * lvl + Math.round((0.5 * (1 - Math.exp(-i / 30))) * (lvl + lvl), 0), 0);
            min = Math.round(0.3 * max);
            text = min + "=>" + max;
            break;
          case 'keys':
          case 'orbs':
            max = Math.round(4 * lvl / 15 + Math.round((0.5 * (1 - Math.exp(-i / 30))) * (lvl + lvl), 0), 0);
            min = Math.round(0.3 * max);
            text = min + "=>" + max;
            break;
          case 'time':
            max = Math.round(6 * 4 * lvl + 40 - Math.round((4 * (1 - Math.exp(-i / 30))) * (lvl + lvl), 0), 0);
            min = Math.round(-Math.round((4 * (1 - Math.exp(-i / 30))) * (lvl + lvl), 0), 0);
            text = max + "=>(" + min + ")";

            break;
        }
        allData.push(text);
        row.push(text);
      }
      table.row.add(row).draw(false);
    }
    var items = jQuery.unique(allData);
    var colors = this.randomColors(items.length);
    for (var key in items) {
      var color = colors[key];
      var color2 = MQO_Exp_Upgrades.invertColors(color);
      jQuery('td:contains(' + items[key] + ')').each(function() {
        jQuery(this).css('background', 'rgb(' + color.toString(16) + ')')
        jQuery(this).css('color', 'rgb(' + color2.toString(16) + ')')
      })
    }
  },
  start: function() {
    // this.logText('Started');
    this.generateRows('gems');
    this.generateRows('relics');
    this.generateRows('keys');
    this.generateRows('orbs');
    this.generateRows('time');
  }
}
