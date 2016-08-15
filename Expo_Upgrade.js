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
  generateRows(tableName, factor) {
    var dataSet = [];
    var columnSet = [];
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
      columns: columnSet,
      pageLength: 50
    });
    for (var lvl = 1; lvl <= 20; lvl++) {
      var row = [];
      row.push(lvl);
     
      for (var i = 0; i <= 30; i++) {
        var max;
        var min;
        var text;
        switch(tableName){
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
                        min = Math.round(- Math.round((4 * (1 - Math.exp(-i / 30))) * (lvl + lvl), 0), 0);
            text = max + "=>(" + min+")";

            break;
        }
        
        row.push(text);
      }
      table.row.add(row).draw(false);
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
