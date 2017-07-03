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

module.exports = {
    MessageHandler : function(lowercaseContent, msg) {
        if (lowercaseContent === prefix + 'september yet?') {
            var month = moment().utcOffset('+0800').month();
            if (month === 8) {
                msg.reply("you betcha homie :confetti_ball: :beers: :MODM: :fraygasm:");
            } else {
                msg.reply("nope sorry pal :sob:");
            }
        } else if(lowercaseContent === prefix + 'misadventures') {
            msg.channel.send("listen m8, im trying");
        } else if(lowercaseContent === prefix + 'thursday yet?') {
            var day = moment().utcOffset('+0800').isoWeekday()
            if (day === 4) {
                msg.reply("you betcha homie :confetti_ball: :hockey: :goal: :man_dancing:");
            } else {
                msg.reply("nope just another shit floorball-less day :sob:");
            }
        }
        else { //free form text detection
            if (lowercaseContent.indexOf("memba") > -1 || lowercaseContent.indexOf("remember") > -1) {
                var memba = msg.guild.emojis.find(findMemba);
                if (memba) {
                    msg.react('🇮').then(msg.react(memba));
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
            if (lowercaseContent.indexOf("mornin") > -1 && lowercaseContent.indexOf("jeff") > -1) {
                msg.reply("mornin'");
            }
        }
    }
}
