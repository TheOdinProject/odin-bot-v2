const glob = require("glob");
const path = require("path");
const {listenToMessages} = require("./botEngine.js");
require('dotenv').config();

glob.sync("./botCommands/**/*.js").forEach(file => {
  require(path.resolve(file));
});

const Discord = require('discord.js');
const client = new Discord.Client();

let listening = false
client.on('ready', () => {
  if (!listening) {
    listenToMessages(client);
    listening = true;
  }
});

client.login(process.env.DISCORD_API_KEY);
