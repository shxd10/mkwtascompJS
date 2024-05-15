const { Events } = require('discord.js');
const { handleTextCommands } = require('./textCommands.js');
const { handleDMs } = require('./dmHandling.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        // Call functions from other modules to handle message events
        handleTextCommands(message);
        handleDMs(message);
    }
};
