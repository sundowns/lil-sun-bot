const jsonfile = require('jsonfile');
const path = require('path');
var halloffame = {};

module.exports = {
    Init: function() {
        var filepath = __dirname + path.normalize('/data/halloffame.json');
        jsonfile.readFile(filepath, function(err, obj) {
            if (!err) {
                halloffame = obj;
            } else console.log(err);
        });
    },
    MessageHandler: function(lowercaseContent, msg) {
        if (lowercaseContent.startsWith(".halloffame")) {
            if (lowercaseContent.indexOf("add") > -1) {
                console.log("adding new guy to hall of fame");
            } else {
                if (halloffame != null) {
                    var rip = msg.guild.emojis.find(findRip);
                    msg.channel.send("**===[Grimmy HC Hall of Fame]===**\n"
                    + "Conquerers of Ultimate & Masters of leveling"
                );
                    halloffame.members.forEach(function(item, index, arr) {
                        var part1 = "**"+item.name+"** (" + item.class  + ") ";
                        if (item.deceased) {part1 = part1 + rip;}
                        msg.channel.send(part1 + "\n" + item.image);
                    })
                }
            }
        }
    }
}


function findRip(emoji){
    return emoji.name == "rip";
}
