const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('members')
		.setDescription('Members of the server.')
		.setDMPermission(false),
	async execute(interaction) {
		await interaction.reply({ content: `**${interaction.guild.name}** has **${interaction.guild.memberCount}** members.`});
	},
};