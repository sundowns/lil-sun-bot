const token = 'MzI1MTAzNjM5OTYwMjIzNzQ2.DCuLWw.2VMAkzg-16d_uB-z1mEdIE8LcBU';
//https://www.npmjs.com/package/website-scraper
const Discord = require("discord.js");
const moment = require('moment')
const client = new Discord.Client();
const prefix = '.'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    var lowercaseContent = msg.content.toLowerCase()
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
            msg.reply("you betcha homie :confetti_ball: :hockey: :goal: :reelbigfish:");
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
    }
});

function findMax(emoji) {
    return emoji.name == "figureitout"
}

function findMemba(emoji) {
    return emoji.name == "memba"
}


client.login(token);
