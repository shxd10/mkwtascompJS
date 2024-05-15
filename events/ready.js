require('dotenv').config();
const chalk = require('chalk');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { Events, ActivityType } = require('discord.js');
const mongoURL = process.env.mongoURL;

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setActivity("Dolphin Emulator", { type: ActivityType.Playing });

    console.log(chalk.green(`Ready! Logged in as ${client.user.tag}`));

    if (!mongoURL) return;
    
    const mongoConnect = await mongoose.connect(mongoURL).catch(console.error);

	  if (mongoConnect) {
		console.log(chalk.cyanBright('[MongoDB Status]: Connected.'))
	  } else {
      console.log(chalk.redBright('[MongoDB Status]: Disconnected.'))
    }

  },
};
