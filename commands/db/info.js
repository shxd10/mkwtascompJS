const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Submission = require('../../schemas/submission.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('info')
    .setDMPermission(true),
	async execute(interaction) {
		const nameSplit = fileInfo.name.split("_");
		const embed = new EmbedBuilder()
			.setTitle('RKG Information')
			.addFields(
				{ name: "Track", value: nameSplit[0], inline: true },
				{ name: "Mii Name", value: nameSplit[1], inline: true },
				{ name: "\n", value: "\n" },
				{ name: "Time", value: nameSplit[2], inline: true },
				{ name: "URL", value: fileInfo.url, inline: true },
				{ name: "\n", value: "\n" },
				{ name: "ID", value: fileInfo.id, inline: true },
				{ name: "Size", value: fileInfo.size, inline: true },
			)
			.setColor("Random")
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
	},
};