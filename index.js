const config = require("./config.js");
const Gitter = require("node-gitter");
const { listenToMessages } = require("./bot-engine.js");

const gitter = new Gitter(config.gitter.token);

const rooms = config.gitter.rooms;
// include your botCommands.. figure out how to do this by folder
var glob = require("glob"),
  path = require("path");

glob.sync("./botCommands/**/*.js").forEach(function(file) {
  require(path.resolve(file));
});

rooms.forEach(async room => {
  try {
    const joinedRoom = await gitter.rooms.join(room);
    console.log(`Joined room: ${joinedRoom.name}`);
    listenToMessages(gitter, joinedRoom.id);
  } catch (error) {
    console.log(`there was an error: ${error}`);
  }
});
