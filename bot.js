const token = 'MzI1MTAzNjM5OTYwMjIzNzQ2.DCTYfg.3KIIiesPX2wbCRfx1EIHMlHpL2Y';
//https://www.npmjs.com/package/website-scraper
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = '.'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    var lowercaseContent = msg.content.toLowerCase()
    if (lowercaseContent === prefix + 'september yet?') {
        var date = new Date()
        var month = date.getMonth()
        if (month === 8) {
            msg.reply("you betcha homie :confetti_ball: :beers: :MODM: :fraygasm:");
        } else {
            msg.reply("nope sorry pal :sob:")
        }
    } else if(lowercaseContent === prefix + 'misadventures') {
        msg.channel.send("listen m8, im trying")
    }
    else { //free form text detection
        if (lowercaseContent.indexOf("memba") > -1 || lowercaseContent.indexOf("remember") > -1) {
            var memba = msg.guild.emojis.find(findMemba)
            if (memba) {
                msg.react('🇮').then(msg.react(memba))
            }
        }
        if (lowercaseContent.indexOf("max") > -1) {
            var emoji = msg.guild.emojis.find(findMax)
            if (emoji) {
                msg.react(emoji)
            }
        }
    }
});

function findMax(emoji) {
    return emoji.name == "figureitout"
}

function findMemba(emoji) {
    return emoji.name == "memba"
}


client.login(token);
