var globalMap = {};
createMap = function () {
    jQuery('#map g > g').each(function () {
        var id = jQuery(this).prop('id');
        var cords = id.match('x([0-9]*)y([0-9]*)');
        var x = cords[1];
        var y = cords[2];
        var classes = jQuery(this).attr("class").split(' ');
        for (var key in classes) {
            var type = classes[key].match('tile-(.*)');
            if (type) {
                var name = type[1];
                if (globalMap[name] == undefined) {
                    globalMap[name] = {};
                }
                if (globalMap[name][x] == undefined) {
                    globalMap[name][x] = {};
                }
                globalMap[name][x][y] = type[1];
            }
        }
    });
};
setTimeout(function () {
    sendRequestContentFill('getKingdom.aspx?NewX=955&NewY=955');
    createMap();
}, 1000);
