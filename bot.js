const token = 'MzI1MTAzNjM5OTYwMjIzNzQ2.DCuLWw.2VMAkzg-16d_uB-z1mEdIE8LcBU';
//https://www.npmjs.com/package/website-scraper
const Discord = require("discord.js");
const moment = require('moment')
const jsonfile = require('jsonfile')
const client = new Discord.Client();

const prefix = '.'
var halloffame = {}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    var filepath = __dirname + '\\data\\halloffame.json'
    jsonfile.readFile(filepath, function(err, obj) {
        if (!err) {
            halloffame = obj;
            console.log("Loaded Hall of Fame")
        } else console.log(err);
    })
});

client.on('message', msg => {
    var lowercaseContent = msg.content.toLowerCase()
    if (msg.author.id == '325103639960223746') return; //dont let the bot read its own messages

    if (lowercaseContent.startsWith(prefix + "halloffame")) {
        if (lowercaseContent.indexOf("add") > -1) {
            console.log("adding new guy to hall of fame")
        } else {
            if (halloffame != null) {
                var rip = msg.guild.emojis.find(findRip);
                msg.channel.send("**===[Grimmy HC Hall of Fame]===**\n"
                + "Conquerers of Ultimate & Masters of leveling"
                )
                halloffame.members.forEach(function(item, index, arr) {
                    var part1 = "**"+item.name+"** (" + item.class  + ") "
                    if (item.deceased) {part1 = part1 + rip}
                    msg.channel.send(part1 + "\n" + item.image)
                })
            }
        }
    }

    if (lowercaseContent === prefix + 'help') {
        msg.channel.send("Hello memers these are my memes: \n``` .september yet? \n .thursday yet? \n .halloffame ```")
    } else if (lowercaseContent === prefix + 'september yet?') {
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
});

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

client.login(token);
