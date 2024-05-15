const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		await interaction.reply({ content: `Ti chiami **${interaction.user.username}** e sei entrato nel server da **${interaction.member.joinedAt}**.`});
	},
};