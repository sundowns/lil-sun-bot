const moment = require('moment');
const path = require('path');
const feedFileName = __dirname + path.normalize('/data/feed.json');
const misadventureTitleRegex = /Grim Misadventure #([0-9]*):/g;
var lastRun = null;
var latest = [];
var newItems = [];
var client = {}

const jsonfile = require('jsonfile');
var FeedParser = require('feedparser');

function findGrimChannel(channel) {
    return channel.id == "227410219825627139"; // grimless-wasteland channel
}

var scanForNewMisadventure = function(item) {
    var pubDate = new Date(item.pubDate);
    if (pubDate > lastRun) {
        newItems.push({"name" : item.title, "link" : item.link});
    }
}

var getReplyForLatest = function() {
    var reply = latest.length +  " results scraped on " + lastRun + "\n"
    reply = reply + "===============\n";
    latest.forEach(function(item) {
        reply = reply + "'" + item.name + "' (" + item.link + ")\n";
    });
    return reply;
}

var postNewResultsInSpecificChannel = function() {
    var channel = client.channels.find(findGrimChannel);
    var newContent = getReplyForLatest();
    channel.send("**Wowee** I got some hot new grim content fresh off the press \n \n" + newContent);
}

var saveFeedDataToFile = function() {
    var json = {
        "misadventures" : {
            "lastrun" : lastRun,
            "latest" : latest
        }
    }
    jsonfile.writeFileSync(feedFileName, json);
}

var requestData = function() {
    var request = require('request'); // for fetching the feed

    var req = request('http://www.grimdawn.com/forums/external.php?f=18&type=rss2');
    var feedparser = new FeedParser();

    req.on('error', function (error) {
      // handle any request errors
    });

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream

      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
      }
      else {
        stream.pipe(feedparser);
      }
    });

    feedparser.on('error', function (error) {
      // always handle errors
      console.log("Error pulling results from RSS feed " + error);
    });

    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;

      while (item = stream.read()) {
        scanForNewMisadventure(item);
      }
    });

    feedparser.on('end', function() {
        if (newItems.length > 0) {
            lastRun = moment().format();
            latest = newItems;
            saveFeedDataToFile();
            newItems = [];
            postNewResultsInSpecificChannel();
        }
    });
}

module.exports = {
    Init : function(discord_client) {
        client = discord_client;
        jsonfile.readFile(feedFileName, function(err, obj) {
            if (!err) {
                lastRun = new Date(obj.misadventures.lastrun);
                latest = obj.misadventures.latest;
                console.log("Loaded Feed");
            } else console.log(err);
        });
        requestData();
    },
    MessageHandler : function(lowercaseContent, msg) {
        if (lowercaseContent === ".latest" || lowercaseContent === ".misadventures") {
            if (latest != null) {
                msg.reply(getReplyForLatest());
            } else msg.reply("No new articles since " + lastRun);
        }
    }
}

setInterval(function() {
  requestData();
}, 5 * 60 * 1000); //every 5 minutes
