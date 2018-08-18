const request = require('request-json');
const Discord = require("discord.js");
const twitchClientId = '1or2tbd8kb5jeqz3kokr754kb4svid';
const twitchEndPoint = 'https://api.twitch.tv/kraken/'
const streams = [
    'striderace21',
    'sunnydowns',
    'perthsmash',
    'chappos',
    'mrnoied',
    'zerorbm',
    'gambl_r',
    'jdmhobby'
];

var live = [];
var discordClient = {};
var requestClient = {};

//emotes
var supersonic = {};

function findEmojiFarm(server) {
    return server.id == "415409072763043840";
}

function findStreamsChannel(channel) {
    return channel.id == "480189958674579456"; // streams channel = '337881711436234752' //dumb bot shit = '336087767387865089'
}

function findSuperSonic(emoji){
    return emoji.name == "supersonic";
}

let formatStreamPost = function(stream) {
    var embed = new Discord.RichEmbed();
    embed.setTitle(stream.title);
    embed.setURL(stream.link);
    embed.setColor([100, 65, 164]);
    embed.setDescription(stream.game + " " + supersonic)
    embed.addField("Channel", stream.link);
    embed.addField("Viewers", stream.viewers);
    return embed;
}

function reportNewStreams(newStreams) {
    var channel = discordClient.channels.find(findStreamsChannel);
    newStreams.forEach(function(id) {
        if (live[id]) {
            var post = formatStreamPost(live[id]);
            channel.send(post);
        }
    });
}

function reportAllStreams(promptMsg) {
   if (streams.length === 0) {
      promptMsg.reply("its quiet out there...");
   }

    streams.forEach(function(name) {
        if (live[name]) {
            var post = formatStreamPost(live[id]);
            promptMsg.channel.send(post);
        }
    });
}

function checkStreams() {
   var streamsDelimited = streams.join();
   requestClient.get('streams/?channel=' + streamsDelimited)
      .then((result) => {
         if (!result.res) {
            console.log("[ERROR] Received response with no status code.")
            return;
         }
         if (result.res.statusCode === 200 && result.body) {
            if (result.body._total > 0) {
               var newStreams = [];
               body.streams.forEach(function(data) {
                  if (!live[data.channel.display_name]) {
                     live[data.channel.display_name] = {
                        title : data.channel.status,
                        viewers : data.viewers,
                        game : data.game,
                        link : data.channel.url,
                        img : data.preview.medium
                     }

                     newStreams.push(data.channel.display_name);
                  } else {
                     //it already exists, just update the title/viewers
                     live[data.channel.display_name].title = data.channel.status;
                     live[data.channel.display_name].viewers = data.viewers;
                 }
                });

               if (newStreams.length > 0) {
                  reportNewStreams(newStreams);
               }
            } else {
               live = [];
            }

         }
      }).catch((err) => {
         console.log(err);
         return;
      });
}

module.exports = {
    Init : function(discord_client) {
        discordClient = discord_client;
        requestClient = request.createClient(twitchEndPoint);
        requestClient.headers['Client-ID'] = twitchClientId;
        var emojiFarm = discord_client.guilds.find(findEmojiFarm);
        supersonic = emojiFarm.emojis.find(findSuperSonic);
        checkStreams();
    },
    MessageHandler : function(lowercaseContent, msg) {
      if (lowercaseContent === '.streams' || lowercaseContent === '.stream') reportAllStreams(msg);
    }
}

setInterval(function() {
    checkStreams();
}, 2 * 60 * 1000); //every 2 minutes
