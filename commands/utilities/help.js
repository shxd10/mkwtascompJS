const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Every command and how to get help!")
    .setDMPermission(false),
	async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Help')
			.setDescription(`test`)
			.addFields(
			)
			.setColor('Green')
			.setTimestamp()
    await interaction.reply({ embeds: [embed] })
	},
};