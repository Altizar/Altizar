// ==UserScript==
// @name         MidenQuest - Item Tier Namer
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.6
// @description  MidenQuest Item Tier Namer
// @author       Altizar
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Inventory.Tier.Namer.Code.js
// @updateURL    https://altizar.github.io/MiddenQuest.Inventory.Tier.Namer.Code.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/*
var Inventory = {
    "": {
        "Katana": "T06",
        "Necklace": "T03",
        "Shortsword": "T02"
    },
    "Armor": {
        "Aged Dragon": "T07",
        "Phoenix": "T14",
        "Royal": "T10",
        "Scalemail": "T06",
        "Spiked": "T05",
        "Thundersoul": "T16"
    },
    "Axe": {
        "Destruction": "T15",
        "Oracle Master": "T12",
        "Titan's": "T08"
    },
    "Battlestaff": {
        "Thundersoul": "T16",
    },
    "Blade": {
        "Angel": "T09",
        "Ogre": "T08",
        "Demon Bane": "T11",
        "Soul Shattering": "T13"
    },
    "Boots": {
        "Darkskin": "T08",
        "Leather": "T02",
        "Royal": "T10",
        "Scalemail": "T06",
        "Spiked": "T05",
        "Soul Whisperer": "T13"
    },
    "Bow": {
        "Atlas": "T15",
        "Demon Bane": "T11",
        "Guard": "T06",
    },
    "Cap": {
        "Cheap": "T01",
        "Darksin": "T08"
    },
    "Charm": {
        "Expert": "T09",
        "Everlasting": "T15",
        "Strong": "T06",
        "Wizard": "T12"
    },
    "Coif": {
        "Prophecy": "T12",
        "Royal": "T10"
    },
    "Crossbow": {
        "Angelic": "T09"
    },
    "Destroyer": {
        "Gloves of the": "T15",
        "Helm of the": "T15",
        "Pants of the": "T15",
        "Plate of the": "T15",
        "Sabatons of the": "T15"
    },
    "Destruction": {
        "Staff of": "T15"
    },
    "Dirk": {
        "Soul Shattering": "T13"
    },
    "Garments": {
        "Prophecy": "T12"
    },
    "Gauntlets": {
        "Aged Dragon": "T07",
        "Copper Plated": "T04",
        "Royal": "T10"
    },
    "Gloves": {
        "Angelic": "T09",
        "Darkskin ": "T08",
        "Scalemail": "T06",
        "Soul Whisperer": "T13",
        "Thundersoul": "T16"
    },
    "Greathelm": {
        "Phoenix": "T14"
    },
    "Greatsword": {
        "Oracle": "T12"
    },
    "Greaves": {
        "Phoenix": "T14",
        "Prophecy": "T12",
        "Thundersoul": "T16"
    },
    "Hat": {
        "Soul Whisperer": "T13"
    },
    "Hauberk": {
        "Demon Bane": "T11"
    },
    "Helm": {
        "Aged Dragon": "T07",
        "Demon Bane Great": "T11"
    },
    "Helmet": {
        "Scalemail": "T06",
        "Thundersoul": "T16"
    },
    "Hood": {
        "Deva-Touched": "T12",
        "Diabolic": "T10",
        "Dragonscale": "T07",
        "Trollskin": "T06",
        "Miden's": "T13",
        "Planeswalker": "T11"
    },
    "Longsword": {
        "Unforgiving": "T05",
    },
    "Longbow": {
        "Scale Piercing": "T07",
    },
    "Leggings": {
        "Aged Dragon": "T07",
        "Copper Plated": "T04",
        "Phoenix": "T14",
        "Prophecy": "T12"
    },
    "Mask": {
        "Abyssal": "T09",
        "Cotton": "T01",
        "Trollskin": "T05",
        "Deicide's": "T14",
        "Wyrmscale": "T08"
    },
    "Necklace": {
        "Eternal": "T15",
        "Royal": "T12",
        "Silver": "T09",
        "Sturdy": "T06"
    },
    "Orb": {
        "Demon Bane": "T11",
        "Prophecy": "T12"
    },
    "Pants": {
        "Angelic": "T09",
        "Darkskin": "T08",
        "Leather": "T02",
        "Royal": "T10",
        "Scalemail": "T06",
        "Soul Whisperer": "T13",
        "Thundersoul": "T16"
    },
    "Phylactery": {
        "Thundersoul": "T16"
    },
    "Rod": {
        "Crystal": "T06",
        "Ogre": "T08"
    },
    "Ring": {
        "Eternal": "T15",
        "Royal": "T12",
        "Sturdy": "T06",
        "Silver": "T09"
    },
    "Robe": {
        "Angelic": "T09"
    },
    "Sabatons": {
        "Aged Dragon": "T07",
        "Demon Bane": "T11"
    },
    "Sandals": {
        "Angel": "T09"
    },
    "Scepter": {
        "Royal": "T10"
    },
    "Shield": {
        "Copper Plated ": "T04",
        "Eternal Flame": "T14",
        "Flame-Eater": "T07",
        "Royal": "T10"
    },
    "Staff": {
        "Angel": "T09",
        "Eternal Flame": "T14"
    },
    "Sword": {
        "Butterfly": "T04",
        "Dragon Fang": "T07",
        "Eternal Flame": "T14",
        "Royal": "T10",
        "Thundersoul": "T16"
    },
    "Tassets": {
        "Demon Bane": "T11"
    },
    "Tiara": {
        "Angelic": "T09"
    },
    "Tunic": {
        "Darkskin": "T08",
        "Leather": "T02",
        "Soul Whisperer": "T13"
    },
    "Vambraces": {
        "Demon Bane": "T11",
        "Phoenix": "T14",
        "Prophecy": "T12"
    },
    "Wand": {
        "Soul Whisperer": "T13"
    }
};
var newInv = {};
jQuery('#ContentLoad').bind('DOMNodeInserted', function (event) {
    jQuery('#SelectItemS option').each(function () {
        var name = jQuery(this).html();
        var itemLevel = getItemLevel(name);
        if (itemLevel !== undefined && itemLevel !== false) {
            jQuery(this).html(itemLevel + name);
        }
    });
    jQuery('#ContentLoad .ui-widget-content > div > div > div:first-child > div').each(function () {
        var name = jQuery(this).clone().children().remove().end().html();
        var itemLevel = getItemLevel(name);
        if (itemLevel !== undefined && itemLevel !== false) {
            jQuery(this).prepend(itemLevel);
        }
    });
});
function getItemLevel(name) {
    var match = name.match(/^[^T0-9]{3,3}\w* ([\w'\-]*|[\w'\-]* [\w'\-]*|[\w'\-]* [\w'\-]* [\w'\-]*) (\w*)[ ]?[\[\]0-9]{0,4}$/);
    if (match == undefined) {
        return false;
    }
    var itemType = Inventory[match[2]];
    if (itemType == undefined) {
        newInv[match[2]] = {};
        newInv[match[2]][match[1]] = "T??";
        console.log('Unknown Item - unknown item list is:');
        console.log(JSON.stringify(newInv));
        return "T?? - ";
    }
    var itemLevel = Inventory[match[2]][match[1]];
    if (itemLevel == undefined) {
        if (newInv[match[2]] == undefined) {
            newInv[match[2]] = {};
        }
        newInv[match[2]][match[1]] = "T??";
        console.log('Unknown Item - unknown item list is:')
        console.log(JSON.stringify(newInv));
        return "T?? - ";
    }
    return itemLevel + " - ";
}