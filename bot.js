const prodToken = 'MzI1MTAzNjM5OTYwMjIzNzQ2.DDx-xQ.0e4CgEZgHkOzjMhTy9S6-NH2wA0';
const betaToken = 'MzMyMzk3ODA2Mjg5NTUxMzYx.DD9hGQ.O4V-Mp_fdyrn0VpHB7Nx1gmOEhQ';
const Discord = require("discord.js");
const client = new Discord.Client();
const misc = require('./misc');
const halloffame = require('./halloffame');
const stash = require('./stash');
const db = require('./db');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //halloffame.Init();
    //stash.Init();
});

client.on('message', msg => {
    if (msg.author.id == '325103639960223746') return; //dont let the bot read its own messages
    var lowercaseContent = msg.content.toLowerCase();

    if (lowercaseContent === '.help') {
        msg.channel.send("Hello memers these are my memes: \n``` .september yet? \n .thursday yet? \n .halloffame \n .stash ```")
    }

    if (lowercaseContent.startsWith(".halloffame")) {halloffame.MessageHandler(lowercaseContent, msg)}
    if (lowercaseContent.startsWith(".stash")) {stash.MessageHandler(msg.content, msg)}
    misc.MessageHandler(lowercaseContent, msg);

    if (lowercaseContent.startsWith(".db")) { db.MessageHandler(lowercaseContent, msg) }
});

client.login(prodToken);
