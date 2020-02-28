const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const moment = require("moment");
const misc = require("./misc");
const halloffame = require("./halloffame");
const stash = require("./stash");
const db = require("./db");
// const feed = require('./feed');
const streams = require("./streams");
const tokens = require("./tokens");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: "online",
    game: { name: "keeping it real (grim)" }
  });
  halloffame.Init();
  stash.Init();
  //   feed.Init(client);
  streams.Init(client);
});

client.on("message", msg => {
  if (msg.author.id == "325103639960223746") return; //dont let the bot read its own messages
  var lowercaseContent = msg.content.toLowerCase();

  if (lowercaseContent === ".help") {
    msg.channel.send(
      "Hello memers these are my memes: \n```css \n .stash help \n .db [search string] \n .latest \n .halloffame \n .floorball yet? \n .streams \n .save [grimtools link] ```"
    );
  } else if (lowercaseContent === ".uptime") {
    msg.channel.send(
      "I've been livin' for " +
        Math.round(moment.duration(client.uptime).asMinutes()) +
        " minute(s)."
    );
  }
  db.MessageHandler(lowercaseContent, msg);
  if (lowercaseContent.startsWith(".halloffame")) {
    halloffame.MessageHandler(lowercaseContent, msg);
  }
  if (lowercaseContent.startsWith(".stash")) {
    stash.MessageHandler(msg.content, msg);
  }
  misc.MessageHandler(lowercaseContent, msg);
  //   feed.MessageHandler(lowercaseContent, msg);
  streams.MessageHandler(lowercaseContent, msg);
});

if (tokens) {
  if (tokens.prod) {
    client.login(tokens.prod);
  } else {
    console.log("Failed to locate prod token. Goodbye xoxo");
    process.exit();
  }
}
