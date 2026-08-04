# The Odin Project Odin Bot Contributing Guide

Before continuing through this guide, be sure you've read our [general contributing guide](https://github.com/TheOdinProject/.github/blob/main/CONTRIBUTING.md), as it contains information that is important for all of our repos. This contributing guide assumes you have followed the instructions in our general contributing guide to fork and clone this repo.

## Table of Contents

- [Setting Up Odin Bot on Your Server](#setting-up-odin-bot-on-your-server)
  - [Initial Setup](#initial-setup)
  - [Set up PostgreSQL](#set-up-postgresql)
  - [Install Redis](#install-redis)
  - [Getting Discord Credentials](#getting-discord-credentials)
  - [Adjust the Bot Settings](#adjust-the-bot-settings)
  - [Invite the Bot to Your Server and Run it Locally](#invite-the-bot-to-your-server-and-run-it-locally)
- [Updating Node Version Compatibility](#updating-node-version-compatibility)
- [Changes to the Database](#changes-to-the-database)
- [Slash Commands](#slash-commands)

## Setting Up Odin Bot on Your Server

### Initial Setup

1. You will need Node.js installed. If necessary, follow our [Installing Node.js lesson](https://www.theodinproject.com/lessons/foundations-installing-node-js) to install the latest LTS version.
1. Fork this repository and use the `git clone` command in your terminal to clone it to your machine.
1. `cd` into the cloned repository and run `npm install` to install the dependencies.
1. Create a new `.env` file in the repository by copying the `.env.sample` file. To do this, run:

   ```bash
   cp .env.sample .env
   ```

You will need to enter a few things in your new `.env` file. At a minimum, you must provide values for the environment variables below (we'll explain how to retrieve those in the next sections):

- `DISCORD_API_KEY`
- `DISCORD_CLIENT_ID`
- `DISCORD_GUILD_ID`
- `DATABASE_URL`
- `TEST_DATABASE_URL`

Leaving the other items as they are with their `''` will not cause issues for now. You can fill these IDs in as you need them using the IDs for the channels/roles you make in your test server.

### Set up PostgreSQL

1. (If you already have PostgreSQL installed, you can skip this first step)

   Go to our [Node.js Installing PostgreSQL lesson](https://www.theodinproject.com/lessons/nodejs-installing-postgresql), where you will find links to our OS-specific installation guides for Linux and macOS. Follow the appropriate guide for your OS.

1. After installing PostgreSQL and setting up your user and privileges, create two databases: `odinbot_development` and `odinbot_testing` (you can name them however you wish).
1. In your `.env` file, set `DATABASE_URL` to the connection string for your `odinbot_development` database and `TEST_DATABASE_URL` to the connection string for your `odinbot_testing` database. **Both of these connection strings must have `?sslmode=disable` at the end.**

   For example, `DATABASE_URL` would look something like:

   ```properties
   DATABASE_URL=postgresql://username:password@localhost:5432/odinbot_development?sslmode=disable
   ```

1. Run `npm run migrate` to apply all the migrations and ensure your development database follows the most up-to-date schema. The bot will not start if there are pending migrations.

### Install Redis

If you already have Redis installed, you can skip this section.

1. Go to [Redis' install page](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/).
1. Follow the installation instructions for your OS to install Redis.
1. Be sure to start the Redis service before starting Odin Bot locally.

### Getting Discord Credentials

#### API Key

1. Go to the [Discord developer portal](https://discord.com/developers/applications) and log in.
1. Click on `New Application`
1. Give the bot a name and click `Create`. Try to make it unique since Discord may not allow a name if it has too many users with that same name.

   You'll now be taken to the bot's "General Information" page. When visiting the Developer Portal at a later time, you can reach the bot options through `Applications` and selecting your bot.

1. In the bot's menu, select `Bot`.
1. Click on `Reset Token` and copy the output. You may need to enter your 2FA code at this point.
1. Paste the copied token after `DISCORD_API_KEY=` in your `.env` file inside of the quotes.

#### Client ID

1. In the Discord developer portal with your bot selected, navigate to menu item `OAuth2`.
1. Copy the `Client ID` as shown.
1. Paste the copied ID after `DISCORD_CLIENT_ID=` in your `.env` file inside of the quotes.

#### Guild ID

Colloquially, people call them servers but within the discord.js API, they're known as guilds.

1. Open Discord.
1. Right-click your server to which you will later invite the bot.
1. Click `Copy Server ID`. If you cannot see this option, go to your Discord user settings and enable "Developer Mode".
1. Paste the copied ID after `DISCORD_GUILD_ID=` in your `.env` file inside of the quotes.

### Adjust the Bot Settings

1. In the Discord Developer Portal with your bot selected, Navigate to menu item `Bot`.
1. In the section `Privileged Gateway Intents` turn on `Server Members Intent` and `Message Content Intent` and save these settings.
1. Click on the `OAuth2` menu item and then on `URL Generator`.
1. In the `Scopes` section, select `bot`.
1. In the `Bot Permissions` section select at least:
   - `Read Message History`
   - `View Channels`
   - `Send Messages`
   - `Manage Messages`
   - `Embed Links`
1. Copy the generated URL for use in the next section.

### Invite the Bot to Your Server and Run it Locally

1. Open the previously generated URL in your browser.
1. Select your personal server in the dropdown and click `Continue` for the bot to be added and to show up in your member list.
1. In your terminal, navigate to the cloned repository and run `npm run start` to start the bot (or `npm run dev` to allow `nodemon` to auto-restart on changes).

At this point, your cloned version of Odin Bot should come online and its commands should work!

> [!NOTE]
> If you get a Node version incompatibility error when starting the bot, install an LTS version of Node that meets the compatibility requirements.

## Updating Node Version Compatibility

To update this codebase's Node version compatibility (assuming a maintainer has agreed to it), use our `pin-node` npm script and set the new semver value as the `NEW_NODE_VERSION` environment variable. For example, to pin Node compatibility to `^26`, run:

```bash
NEW_NODE_VERSION=^26 npm run pin-node
```

The updated files can then be committed and PRed.

## Changes to the Database

If you do anything that requires altering the database schema somehow, such as adding or renaming columns, or creating tables, you must handle this by writing a migration.

1. Run `npm run migrate:new <migration-name>`, where the migration name should describe what it involves (e.g. `npm run migrate:new create-points`). This will create a blank migration file within the `db/migrations` directory.
1. Within your new migration file, write the SQL you need for the new database alterations under the `-- migrate:up` section.
1. Under the `--migrate:down` section, write the reverse SQL, so that if you need to roll back the migration, it fully undoes whatever it applied. For example if the up migration creates a table, drop it in the down migration.
1. Run `npm run migrate` to apply the migration(s) you wrote

Should you need to undo any migrations, you can roll them back one at a time by running `npm run migrate:rollback`.

Applying or rolling back migrations will also automatically update `db/schema.sql`. Do not edit this file manually, although you should still commit it and include it in your PR.

## Slash Commands

All our commands are slash commands that can be found in the [`bot-commands/slash`](https://github.com/TheOdinProject/odin-bot-v2/tree/main/bot-commands/slash) directory, with a handful that also have legacy text-based equivalents in the [`bot-commands/slash-with-inline`](https://github.com/TheOdinProject/odin-bot-v2/tree/main/bot-commands/slash-with-inline) directory. Going forward, any new commands should be slash only.

All commands are registered via our [`bin/deploy-commands.js`](https://github.com/TheOdinProject/odin-bot-v2/blob/main/bin/deploy-commands.js) script, though you should not need to manually run this as it is run automatically whenever the bot process starts up. If you add a slash command and the bot process has restarted yet you cannot see the new command in your test server, you can often resolve this by fully closing Discord and re-opening it.

For more information, see the discord.js [guide on how to create slash commands](https://discordjs.guide/legacy/app-creation/creating-commands). You can also reply with [message embeds](https://discordjs.guide/legacy/popular-topics/embeds) if necessary. For more detailed information about the discord.js API, refer to the [official discord.js documentation](https://discord.js.org/docs/packages/discord.js/main).
