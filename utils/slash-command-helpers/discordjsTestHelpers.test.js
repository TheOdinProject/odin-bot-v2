const {
  getUsers,
  buildInteraction,
  initializeServer,
} = require("./discordjsTestHelpers");

describe("getUsers", () => {
  it("returns the full list of users when called with no arguments", () => {
    const expectedUsers = [
      { id: "1234", username: "Foo", nickname: "" },
      { id: "5678", username: "Baz", nickname: "" },
      { id: "9101", username: "Bang", nickname: "" },
      { id: "1121", username: "Bing", nickname: "" },
      { id: "3141", username: "Bong", nickname: "" },
      { id: "5161", username: "Ding", nickname: "" },
    ];

    const users = getUsers();

    expect(users).toEqual(expectedUsers);
  });

  it("returns the requested number of users when called with a user count", () => {
    const expectedUsers = [
      { id: "1234", username: "Foo", nickname: "" },
      { id: "5678", username: "Baz", nickname: "" },
      { id: "9101", username: "Bang", nickname: "" },
    ];

    const users = getUsers(3);

    expect(users).toEqual(expectedUsers);
  });

  it("returns the requested number of users with the requested offset when called with a user count and offset", () => {
    const expectedUsers = [
      { id: "1121", username: "Bing", nickname: "" },
      { id: "3141", username: "Bong", nickname: "" },
    ];

    const users = getUsers(2, 3);

    expect(users).toEqual(expectedUsers);
  });
});

describe("buildInteraction", () => {
  it("returns the passed subcommand when the getSubcommand option is called", () => {
    const subcommand = "foo";
    const guild = "odin";
    const users = [];
    const reply = () => {};

    const interaction = buildInteraction(subcommand, guild, users, reply);

    expect(interaction.options.getSubcommand()).toEqual("foo");
  });

  it("returns an interaction with the passed guild", () => {
    const subcommand = "foo";
    const guild = "odin";
    const users = [];
    const reply = () => {};

    const interaction = buildInteraction(subcommand, guild, users, reply);

    expect(interaction.guild).toEqual("odin");
  });

  it("returns the requested user when the getUser option is called", () => {
    const subcommand = "foo";
    const guild = "odin";
    const users = [
      { id: "1234", username: "Foo", nickname: "" },
      { id: "5678", username: "Baz", nickname: "" },
    ];
    const reply = () => {};

    const interaction = buildInteraction(subcommand, guild, users, reply);

    expect(interaction.options.getUser("user0")).toEqual({ id: "1234", username: "Foo", nickname: "" });
    expect(interaction.options.getUser("user1")).toEqual({ id: "5678", username: "Baz", nickname: "" });
  });

  it("returns an interaction with the passed reply", () => {
    const subcommand = "foo";
    const guild = "odin";
    const users = [];
    const reply = jest.fn();

    const interaction = buildInteraction(subcommand, guild, users, reply);

    interaction.reply("bar");

    expect(reply).toHaveBeenCalledWith("bar");
  });

  it("does not call the passed reply", () => {
    const subcommand = "foo";
    const guild = "odin";
    const users = [];
    const reply = jest.fn();

    buildInteraction(subcommand, guild, users, reply);

    expect(reply).not.toHaveBeenCalled();
  });
});

describe("initalizeServer", () => {
  it ('returns the requested user when fetch is called with their id', () => {
    const users = [
      { id: "1234", username: "Foo", nickname: "bar" },
      { id: "5678", username: "Baz", nickname: "" },
    ];

    const server = initializeServer(users);

    expect(server.members.fetch("1234")).toEqual({ user: { username: "Foo" }, nickname: "bar" })
    expect(server.members.fetch("5678")).toEqual({ user: { username: "Baz" }, nickname: "" })
  })
})
