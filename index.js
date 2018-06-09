const glob = require("glob");
const path = require("path");
const Gitter = require("node-gitter");
const { listenToMessages } = require("./bot-engine.js");
const { gitter: { token, rooms } } = require("./config.js");

const gitter = new Gitter(token);

glob.sync("./botCommands/**/*.js").forEach(file => {
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
