const jsonfile = require('jsonfile');
const path = require('path');
const stashFileName = __dirname + path.normalize('/data/stash.json');
var stash = {}
const addRelicRegex = /relic -([m|t|e]) "(.*)"/;
const addGearRegex = /gear -([m|r|e|l]) "(.*)"/;
const findRegex = /find "(.*)"/;

var saveStashFile = function() {
    jsonfile.writeFileSync(stashFileName, stash);
}

var registerContributor = function(command, msg) {
    var name = command.slice(8).trim()
    if (name in stash.contributors) { //not new, add the ID
        if (stash.contributors[name].indexOf(msg.author.id) > -1) {
            msg.reply("This id has already been registered for `" + name + "`");
        } else {
            stash.contributors[name].push(msg.author.id);
            msg.reply("added id to `" + name + "`");
        }
    } else { //new, create new record
        stash.contributors[name] = [msg.author.id];
        msg.reply("registered new user `" + name + "`");
    }
    saveStashFile();
}

var findContributorByDiscordId = function(id) {
    var contributor = false;
    for (var key in stash.contributors) {
        if (stash.contributors[key].indexOf(id) > -1) {
            contributor = key;
            break;
        }
    }
    return contributor;
}

var showAllRelics = function(msg) {
    var output = "```css\n";
    stash.relics.forEach(function(item, index, arr) {
        var row = "[" + item.name + "] ("+ item.rarity.substring(0,1) +") - "+ item.owner +"\n";
        output = output + row;
    });
    msg.channel.send("**Showing all relics:**\n" + output + "```");
}

var showAllGear = function(msg) {
    var output = "```css\n";
    stash.gear.forEach(function(item, index, arr) {
        var row = "[" + item.name + "] ("+ item.rarity.substring(0,1) +") - "+ item.owner +"\n";
        output = output + row;
    });
    msg.channel.send("**Showing all gear:**\n" + output + "```");
}

var nameToQueryable = function(name) {
    return name.replace(/[^0-9a-z]/gi, '').toLowerCase();
}

var search = function(term) {
    var searchTerm = nameToQueryable(term);
    var results = [];
    stash.relics.forEach(function(item, index, arr) {
        if (item.queryable.indexOf(searchTerm) > -1) {
            results.push({"name" : item.name, "owner": item.owner, "type" : "relic"});
        }
    });
    stash.gear.forEach(function(item, index, arr) {
        if (item.queryable.indexOf(searchTerm) > -1) {
            results.push({"name" : item.name, "owner": item.owner, "type" : "gear"});
        }
    });
    return results;
}

var outputSearchResults = function(msg, results) {
    var output = "```css\n";
    results.forEach(function(item, index, arr) {
        var row = "[" + item.name + "] ("+ item.type +") - "+ item.owner +"\n";
        output = output + row;
    });
    msg.channel.send("**Displaying [" + results.length +  "] results:**\n" + output + "```");
}

module.exports = {
    Init : function() {
        jsonfile.readFile(stashFileName, function(err, obj) {
            if (!err) {
                stash = obj;
            } else console.log(err);
        });
    },
    MessageHandler : function(lowercaseContent, msg) {
        var message = lowercaseContent.slice(6).trim()
        if (message.startsWith("register")) {
            registerContributor(message, msg)
        } else if (message.startsWith("add")) {
            var user = findContributorByDiscordId(msg.author.id)
            if (!user) { msg.reply("User not found. You must register this user before you can add things to the stash. eg. `.stash register [name]`") }
            else {
                //search contributors for this id, if not found throw an error/tell them to register their user ID
                var command = message.slice(3).trim()
                if (command.startsWith("relic")) {
                    var match = addRelicRegex.exec(command)
                    if (!match || (match[1] !== 'm' && match[1] != 't' && match[1] != 'e')) {
                        msg.reply("Invalid usage. Ex. `.stash add relic [-e|-t|-m] \"[name]\"`")
                    } else {
                        if (match[2] && match[2].length > 2) {
                            var rarity = "";
                            if (match[1] === 'e') {
                                rarity = "Empowered";
                            } else if (match[1] === 't') {
                                rarity = "Transcendent";
                            } else if (match[1] === 'm') {
                                rarity = "Mythical";
                            } else rarity = "wtf";

                            stash.relics.push({"name": match[2].replace(/"/gi, ''), "rarity": rarity, "owner": user, "queryable": nameToQueryable(match[2])})
                            msg.reply(" added " + match[2].replace(/"/gi, '') + " for owner: " + user);
                            saveStashFile();
                        }
                    }
                } else if (command.startsWith("gear")) {
                    var match = addGearRegex.exec(command);
                    if (!match || (match[1] !== 'm' && match[1] != 'r' && match[1] != 'e' && match[1] != 'l')) {
                        msg.reply("Invalid usage. Ex. `.stash add gear [-m|-r|-e|-l] \"[name]\"`")
                    } else {
                        if (match[2] && match[2].length > 2) {
                            //add the relic wooo
                            var rarity = "";
                            if (match[1] === 'm') {
                                rarity = "Magic";
                            } else if (match[1] === 'r') {
                                rarity = "Rare";
                            } else if (match[1] === 'e') {
                                rarity = "Epic";
                            } else if (match[1] === 'l') {
                                rarity = "Legendary";
                            } else rarity = "wtf";

                            stash.gear.push({"name": match[2].replace(/"/gi, ''), "rarity": rarity, "owner": user, "queryable": nameToQueryable(match[2])})
                            msg.reply(" added " + match[2].replace(/"/gi, '') + " for owner: " + user);
                            saveStashFile();
                        }
                    }
                }
            }
        } else if (message.startsWith("find")) {
            var match = findRegex.exec(message);
            if (!match) { msg.reply("Invalid usage. Ex. `.stash find \"[name]\"`"); }
            else if (match[1].length < 3) { msg.reply("Minimum search term is 3 characters"); }
            else {
                var searchResults = search(match[1]);
                if (searchResults && searchResults.length > 0) {
                    outputSearchResults(msg, searchResults);
                } else {msg.reply("No results found (rekt idiot)");}
            }
            //check for valid command via regex
        } else if (message.startsWith("show")) {
            var command = message.slice(4).trim()
            if (command.startsWith("relic")) {
                showAllRelics(msg);
            } else if (command.startsWith("gear")) {
                showAllGear(msg);
            } else if (command.startsWith("all")) {
                showAllRelics(msg);
                showAllGear(msg);
            } else {
                msg.reply("Invalid command. Ex. `.stash show ['relic'|'gear'|'all']`");
            }
        } else if (message.startsWith("help")) {
            msg.reply("```css\n"
            + "[Show] -> \".stash show ['relic'|'gear'|'all']\"\n"
            + "[Find] -> \".stash find \"[search term]\"\n"
            + "[Add Relic] -> \".stash add relic [-e|-t|-m] \"[name]\"\n"
            + "[Add Gear] -> \".stash add gear [-m|-r|-e|-l] \"[name]\"\n"
            + "[Register user] -> \".stash register \"[name]\""
            + " ```");
        } else {
            msg.reply("Invalid command, try `.stash help`");
        }
    }
}
