const moment = require('moment')
const prefix = '.'

/* Helper functions */
function findMax(emoji) {
    return emoji.name == "figureitout";
}

function findMemba(emoji) {
    return emoji.name == "memba";
}

function findGrim(emoji){
    return emoji.name == "grim";
}

function findRip(emoji){
    return emoji.name == "rip";
}

function findGudShit(emoji){
   return emoji.name == "gud_shit";
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    MessageHandler : function(lowercaseContent, msg) {
        if (lowercaseContent === prefix + 'floorball yet?') {
            var day = moment().utcOffset('+0800').isoWeekday()
            if (day > 1 || day === 3) {
               msg.reply("you betcha homie :confetti_ball: :hockey: :goal: :man_dancing: " + msg.guild.emojis.find(findGudShit));
            } else {
                msg.reply(":sob: :sob: :sob: :sob:");
            }
        }
        else { //free form text detection
            if (lowercaseContent.indexOf("memba") > -1 || lowercaseContent.indexOf("remember") > -1) {
                var memba = msg.guild.emojis.find(findMemba);
                if (memba) {
                    msg.react('🇮').then(() => {
                       setTimeout(() => {
                          msg.react(memba);
                       }, 200)
                    });
                }
            }
            if (lowercaseContent.indexOf("max") > -1) {
                var emoji = msg.guild.emojis.find(findMax);
                if (emoji) {
                    msg.react(emoji);
                }
            }
            if (lowercaseContent.indexOf("grim") > -1) {
                var emoji = msg.guild.emojis.find(findGrim);
                if (emoji) {
                    msg.react(emoji);
                }
            }
            if (lowercaseContent.indexOf("love it") > -1 || lowercaseContent.indexOf("amazing") > -1 || lowercaseContent.indexOf("great") > -1) {
                var emoji = msg.guild.emojis.find(findGudShit);
                if (emoji) {
                    msg.react(emoji);
                }
            }
            if (lowercaseContent.indexOf("mornin") > -1 && lowercaseContent.indexOf("jeff") > -1) {
                msg.reply("mornin'");
            }
            if (lowercaseContent.indexOf("pm ") > -1 || lowercaseContent.indexOf(" pm") > -1
                || lowercaseContent.indexOf(" pm") > -1
                || lowercaseContent.indexOf("project m") > -1
                || lowercaseContent.indexOf("projectm") > -1
                || lowercaseContent === "pm") {

                //var index = getRandomInt(0, responses.length - 1);
                //var response = responses[index];
                //msg.reply(response);
                //msg.delete();
                var emoji = msg.guild.emojis.find(findRip);
                if (emoji) {
                    msg.react(emoji);
                }
            }
        }
    }
}
