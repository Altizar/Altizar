/*
 * MidenQuest - Item Tier Namer v0.3
 */
var Inventory = {
    "": {
        "Katana": "T06",
        "Necklace": "T06"
    },
    "Armor": {
        "Aged Dragon": "T07",
        "Phoenix": "T14",
        "Royal": "T10",
        "Thundersoul": "T16"
    },
    "Axe": {
        "Oracle Master": "T12"
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
        "Royal": "T10",
        "Scalemail": "T06",
        "Soul Whisperer": "T13"
    },
    "Bow": {
        "Demon Bane": "T11",
        "Atlas": "T15",
    },
    "Cap": {
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
        "Plate of the": "T15"
    },
    "Dirk": {
        "Soul Shattering": "T13"
    },
    "Garments": {
        "Prophecy": "T12"
    },
    "Gauntlets": {
        "Royal": "T10"
    },
    "Gloves": {
        "Angelic": "T09",
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
        "Miden's": "T13",
        "Planeswalker": "T11"
    },
    "Leggings": {
        "Phoenix": "T14",
        "Prophecy": "T12"
    },
    "Mask": {
        "Abyssal": "T09",
        "Cotton": "T06",
        "Deicide's": "T14",
        "Wyrmscale": "T08"
    },
    "Necklace": {
        "Eternal": "T16",
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
        "Royal": "T10",
        "Scalemail": "T06",
        "Soul Whisperer": "T13",
        "Thundersoul": "T16"
    },
    "Phylactery": {
        "Thundersoul": "T16"
    },
    "Ring": {
        "Eternal": "T09",
        "Royal": "T12",
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
        "Eternal Flame": "T14",
        "Royal": "T10"
    },
    "Staff": {
        "Angel": "T09",
        "Eternal Flame": "T14"
    },
    "Sword": {
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
        "Soul Whisperer": "T13"
    },
    "Vambraces": {
        "Demon Bane": "T11",
        "Phoenix": "T14",
        "Prophecy": "T12"
    },
    "Wand": {
        "Soul Whisperer": "T19"
    }
}
var newInv = {};
var ItemRenamer = setInterval(function () {
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
}, 1000);
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