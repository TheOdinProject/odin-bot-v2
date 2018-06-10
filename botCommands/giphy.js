const { giphy: { apiKey }} = require("../config.js");
const giphy = require("giphy-api")(apiKey);
const { registerBotCommand } = require("../bot-engine.js");

async function chooseRandomGif(searchTerm) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await giphy.translate(searchTerm);
      if (
        result.data.images &&
        result.data.images.original.url &&
        result.data.url
      ) {
        const imageUrl = result.data.images.original.url;
        const url = result.data.url;
        resolve({ url, imageUrl });
      } else {
        reject("no gif");
      }
    } catch (err) {
      reject(err);
    }
  });
}

async function botResponse({ data, text }) {
  const GIPHY = "/giphy";
  const searchTermRegex = new RegExp(GIPHY + "\\s+(.*)");
  const mentionRegex = /@([a-zA-Z0-9-_]+)/;
  let user = data.fromUser.username;

  // return help message if no searchTerm
  if (!text.match(searchTermRegex)) {
    return "use the giphy command with a keyword like so: `/giphy TACOS`";
  }

  // replace underscores and colons to spaces because emojis
  let searchTerm = text
    .match(searchTermRegex)[1]
    .replace(/_|:/g, " ")
    .trim();

  // allow sending gifs to a person with a mention:
  if (mentionRegex.test(text)) {
    user = text.match(mentionRegex)[1];
    searchTerm = searchTerm.replace(mentionRegex, "");
  }

  if (!searchTerm) {
    return;
  }

  try {
    const image = await chooseRandomGif(searchTerm).catch(e => {});
    return `@${user} __${searchTerm}__ \n\n [![${searchTerm}](${image.imageUrl})](${image.url})`;
  } catch (err) {
    const failImage = await chooseRandomGif("FAIL");
    return `__no gif was found with that keyword!__ \n\n !["FAIL"](${failImage.imageUrl})`;
  }
}

registerBotCommand(/\/giphy.*/, botResponse);
