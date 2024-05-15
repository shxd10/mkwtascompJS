const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('The bot will say everything you say!')
        .addStringOption((option) => {
            return option
            .setName('text')
            .setDescription('Your text.')
            .setRequired(true)
        }),
	async execute(interaction) {
        const textReceived = interaction.options.getString('text')
		await interaction.reply({content: `${textReceived}`});
	},
};