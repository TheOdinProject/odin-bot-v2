function randomInt(range) {
  return parseInt(Math.random() * range);
}

function getMentions(message) {
  return message.match(/@\S+/g);
}

module.exports = {randomInt, getMentions};
