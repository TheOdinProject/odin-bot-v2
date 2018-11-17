const glob = require("glob");
const path = require("path");
require('dotenv').config();
const {listenToMessages} = require("./bot-engine.js");

glob.sync("./botCommands/**/*.js").forEach(file => {
  require(path.resolve(file));
});

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  listenToMessages(client);

});

client.login(process.env.DISCORD_API_KEY);