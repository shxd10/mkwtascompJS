const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help-admin')
		.setDescription("help command but for administrators!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle('Help')
		.addFields(
			{ name: '\u200B', value: '\n'},
            { name: '/ban', value: "Banna l'utente che scegli.", inline: true },
            { name: '/unban', value: "Unbanna l'utente che scegli.", inline: true },
            { name: '\n', value: '\n'},
			{ name: '/kick', value: "Kicka l'utente che scegli.", inline: true },
            { name: '/clear', value: "Elimina la quantità di messaggi che scegli.", inline: true },
			{ name: '\u200B', value: '\n'},
		)
		.setColor('Green')
		.setTimestamp()
        await interaction.reply({ embeds: [embed] })
	},
};