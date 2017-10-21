const Discord = require("discord.js");
const moment = require("moment");
const dbQueryPattern = "http://www.grimtools.com/db/search?query=";
const grimToolsBuildPattern = /(?:http:\/\/)?www\.grimtools\.com\/calc\/(.*\S)/;
const grimToolsBuildApiRequestPattern = "http://www.grimtools.com/get_build_info.php/?id="

//imgur class images album: https://imgur.com/a/WT3mf
var classes = {
    "Inquisitor" : {
        "Classes" : {
            "Arcanist" : "Mage Hunter",
            "Soldier" : "Tactician",
            "Occultist" : "Deceiver",
            "Nightblade" : "Infiltrator",
            "Necromancer" : "Apostate",
            "Shaman" : "Vindicator",
            "Demolitionist" : "Purifier"
        },
        "Colour" : [115, 156, 239],
        "Image" : "https://i.imgur.com/vloBmBL.png"
    },
    "Necromancer" : {
        "Classes" : {
            "Arcanist" : "Spellbinder",
            "Soldier" : "Death Knight",
            "Occultist" : "Cabalist",
            "Nightblade" : "Reaper",
            "Inquisitor" : "Apostate",
            "Shaman" : "Ritualist",
            "Demolitionist" : "Defiler"
        },
        "Colour" : [152, 225, 242],
        "Image" : "https://i.imgur.com/jnB8UZj.png"
    },
    "Arcanist" : {
        "Classes" : {
            "Shaman" : "Druid",
            "Soldier" : "Battlemage",
            "Occultist" : "Warlock",
            "Nightblade" : "Spellbreaker",
            "Demolitionist" : "Sorcerer",
            "Necromancer" : "Spellbinder",
            "Inquisitor" : "Mage Hunter"
        },
        "Colour" : [17, 252, 201],
        "Image" : "https://i.imgur.com/7w0yo2V.png"
    },
    "Soldier" : {
        "Classes" : {
            "Arcanist" : "Battlemage",
            "Occultist" : "Witchblade",
            "Shaman" : "Warder",
            "Nightblade" : "Blademaster",
            "Demolitionist" : "Commando",
            "Necromancer" : "Death Knight",
            "Inquisitor" : "Tactician"
        },
        "Colour" : [255, 180, 20],
        "Image" : "https://i.imgur.com/2NxO4g6.png"
    },
    "Occultist" : {
        "Classes" : {
            "Arcanist" : "Warlock",
            "Soldier" : "Witchblade",
            "Shaman" : "Conjurer",
            "Demolitionist" : "Pyromancer",
            "Nightblade" : "Witch Hunter",
            "Necromancer" : "Cabalist",
            "Inquisitor" : "Deceiver"
        },
        "Colour" : [214, 25, 75],
        "Image" : "https://i.imgur.com/SWQ6TfM.png"
    },
    "Nightblade" : {
        "Classes" : {
            "Arcanist" : "Spellbreaker",
            "Soldier" : "Blademaster",
            "Occultist" : "Witch Hunter",
            "Shaman" : "Trickster",
            "Demolitionist" : "Saboteur",
            "Necromancer" : "Reaper",
            "Inquisitor" : "Infiltrator"
        },
        "Colour" : [59, 67, 160],
        "Image" : "https://i.imgur.com/8Tv1VyI.png"
    },
    "Shaman" : {
        "Classes" : {
            "Arcanist" : "Druid",
            "Soldier" : "Warder",
            "Occultist" : "Conjurer",
            "Nightblade" : "Trickster",
            "Demolitionist" : "Elementalist",
            "Inquisitor" : "Vindicator",
            "Necromancer" : "Ritualist"
        },
        "Colour" : [37, 162, 234],
        "Image" : "https://i.imgur.com/y6SR9uN.png"
    },
    "Demolitionist" : {
        "Classes" : {
            "Arcanist" : "Sorcerer",
            "Soldier" : "Commando",
            "Nightblade" : "Saboteur",
            "Occultist" : "Pyromancer",
            "Shaman" : "Elementalist",
            "Inquisitor" : "Purifier",
            "Necromancer" : "Defiler"
        },
        "Colour" : [252, 96, 10],
        "Image" : "https://i.imgur.com/51Kxk1l.png"
    }
};

let findClassFromMasteries = function(mastery1, mastery2) {
    if (!mastery1 && !mastery2) return {name : "Invalid", colour: [0,0,0], image : ""};
    if (!mastery2) return {name : mastery1, colour : classes[mastery1].Colour, image: classes[mastery1].Image};
    if (!mastery1) return {name : mastery2, colour : classes[mastery2].Colour, image: classes[mastery2].Image};
    var className = classes[mastery1].Classes[mastery2]
    var colour1 = classes[mastery1].Colour;
    var colour2 = classes[mastery2].Colour;
    var red = Math.round((colour1[0] + colour2[0])/2);
    var green = Math.round((colour1[1] + colour2[1])/2);
    var blue = Math.round((colour1[2] + colour2[2])/2);

    return {name : className, colour : [red, green, blue], image : classes[mastery1].Image };
}

let formatBuildPost = function(raw, url) {
    var data = raw.data;
    //TODO: lets do a rich embed! https://discord.js.org/#/docs/main/stable/class/RichEmbed
    var embed = new Discord.RichEmbed();
    if (data.bio && data.masteries) {
        var level = "Level " + data.bio.level + " ";
        var first = true;
        var masteries = [];
        for(var key in data.masteries) {
            masteries.push(key);
        }
        var thisClass = findClassFromMasteries(masteries[0], masteries[1]);
        embed.setTitle(level + " " + thisClass.name);
        embed.setURL(url);
        embed.setColor(thisClass.colour);
        embed.addField("____", "**Physique**: " + data.bio.physique + "\n" + "**Cunning**: " + data.bio.cunning + "\n" + "**Spirit**: " + data.bio.spirit);
        if (masteries[0]) embed.addField(masteries[0], data.masteries[masteries[0]], true);
        if (masteries[1]) embed.addField(masteries[1], data.masteries[masteries[1]], true)
        embed.setFooter("Published: " + moment(raw.created_date).add(8, 'hours').fromNow() + " for " + raw.created_for_build);
        var skills = "";
        var skillCount = 0;
        for (var key in data.skills) {
            skills = skills + key + " **(" + data.skills[key] + ")** \n"
            skillCount++;
        }
        if (skillCount > 0) embed.addField("Skills", skills);
        embed.setThumbnail(thisClass.image);
    }
    return embed;
}

function findBuildLog(channel){
    return channel.id == "371140437202960394";
}

module.exports = {
    Init : function() {
        //nothing
    },
    MessageHandler : function(lowercaseContent, msg) {
        if (lowercaseContent.startsWith(".db")) {
            var queryString = lowercaseContent.slice(3).trim();
            if (queryString.length < 2) { msg.reply ("Query string too short"); }
            else {
                var urlEncodedQueryString = encodeURI(queryString);
                var queryUrl = dbQueryPattern + urlEncodedQueryString;
                msg.reply(queryUrl);
            }
        }
        else if (lowercaseContent.startsWith(".save")) {
            //var content = lowercaseContent.slice(5).trim();
            var content = lowercaseContent.slice(5).trim();
            var match = grimToolsBuildPattern.exec(msg.content);
            if (match) {
                if (match[1]) {
                    var request = require('request');
                    var requestUrl = grimToolsBuildApiRequestPattern + match[1];
                    request(requestUrl, function (error, response, body) {
                        if (!error && response && response.statusCode === 200) {
                            var data = JSON.parse(body);
                            var buildLog = msg.guild.channels.find(findBuildLog);
                            buildLog.send({embed: formatBuildPost(data, content)})
                        }
                    });
                }
            }
        }
        else { //freeform
            var match = grimToolsBuildPattern.exec(msg.content);
            if (match) {
                if (match[1]) {
                    var request = require('request');
                    var requestUrl = grimToolsBuildApiRequestPattern + match[1];
                    request(requestUrl, function (error, response, body) {
                        if (!error && response && response.statusCode === 200) {
                            var data = JSON.parse(body);
                            msg.channel.send({embed: formatBuildPost(data, msg.content)})
                        }
                    });
                }
            }
        }
    }
}
