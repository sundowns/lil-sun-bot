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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const responses = [
    "watch your filthy mouth",
    "how dare you say that",
    "shuddup moite",
    "those words are forbidden here",
    "blasphemy won't be tolerated",
    "hush now"
];

module.exports = {
    MessageHandler : function(lowercaseContent, msg) {
        if (lowercaseContent === prefix + 'floorball yet?') {
            var day = moment().utcOffset('+0800').isoWeekday()
            if (day === 4 || day === 1) {
                msg.reply("you betcha homie :confetti_ball: :hockey: :goal: :man_dancing:");
            } else {
                msg.reply("nope just another shit floorball-less day :sob:");
            }
        }
        else if (lowercaseContent === prefix + 'melee') {
            msg.reply("\n**PAL netplay build:** https://drive.google.com/open?id=0B192sB6TRmD3MTM1clNzUHBOZHc \n**Perth UCF build:** https://drive.google.com/open?id=0B1BQZKqdp2CV3QV5nUEsqSg1ygegLmqRygj \n**Vanilla PAL:** https://drive.google.com/open?id=0B1SUDiY2r7d4YnB0QTBhczRVOTQ");
        }
        else { //free form text detection
            if (lowercaseContent.indexOf("memba") > -1 || lowercaseContent.indexOf("remember") > -1) {
                var memba = msg.guild.emojis.find(findMemba);
                if (memba) {
                    msg.react('🇮');
                    msg.react(memba);
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
