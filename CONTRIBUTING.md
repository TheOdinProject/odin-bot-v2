# The Odin Project Odin Bot Contributing Guide

We're thrilled that you're interested in contributing to the Odin Bot! Our bot depends on open source contributions to grow, improve, and thrive. Whether you're a seasoned pro or just starting out, we welcome all kinds of contributions!

Before continuing through this guide, be sure you've read our [general contributing guide](https://github.com/TheOdinProject/.github/blob/main/CONTRIBUTING.md), as it contains information that is important for all of our repos. This contributing guide assumes you have followed the instructions in our general contributing guide to fork and clone this repo.

## Table of Contents

- [Setting Up Odin Bot on Your Server](#setting-up-odin-bot-on-your-server)
  - [Initial Setup](#initial-setup)
  - [Set up PostgreSQL](#set-up-postgresql)
  - [Install Redis](#install-redis)
  - [Getting Your Discord API Key](#getting-your-discord-api-key)
  - [Getting the Discord Client ID](#getting-the-discord-client-id)
  - [Getting the Discord Guild ID](#getting-the-discord-guild-id)
  - [Adjust the Bot Settings](#adjust-the-bot-settings)
  - [Invite the Bot to Your Server and Run it Locally](#invite-the-bot-to-your-server-and-run-it-locally)
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

### Getting Your Discord API Key

1. Go to the [Discord developer portal](https://discord.com/developers/applications) and log in.
1. Click on `New Application`
1. Give the bot a name and click `Create`. Try to make it unique since Discord may not allow a name if it has too many users with that same name.

   You'll now be taken to the bot's "General Information" page. When visiting the Developer Portal at a later time, you can reach the bot options through `Applications` and selecting your bot.

1. In the bot's menu, select `Bot`.
1. Click on `Reset Token` and copy the output. You may need to enter your 2FA code at this point.
1. Paste the copied token after `DISCORD_API_KEY=` in your `.env` file inside of the quotes.

### Getting the Discord Client ID

1. In the Discord Developer Portal with your bot selected, Navigate to menu item `OAuth2`.
1. Copy the `Client ID` as shown.
1. Paste the copied ID after `DISCORD_CLIENT_ID=` in your `.env` file inside of the quotes.

### Getting the Discord Guild ID

1. Open Discord.
1. Right-click your server to which you will later invite the bot.
1. Click `Copy Server ID`. Note that Developer mode has to be turned on for this in Discord `Advanced` profile settings.
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
