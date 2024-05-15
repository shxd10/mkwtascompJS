// Requiring the SlashCommandBuilder used to actully build the slash command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Using module.exports so it can be read by other files

module.exports = {
	// Creating the Slash Command and setting options of it
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	// The execute() method will contain the functionality to run from our event handler when the command is used
	async execute(interaction) {

		const reply = await interaction.deferReply({ fetchReply: true });

		const embed = new EmbedBuilder()
			.setTitle(':ping_pong: Pong!')
			.addFields(
				{ name: 'Bot Latency', value: `\`${reply.createdTimestamp - interaction.createdTimestamp}ms\`` },
				{ name: 'API Latency', value: `\`${interaction.client.ws.ping}ms\`` }
			)
			.setColor('Random')
			.setTimestamp();

		/* interaction.reply() is the actual reply to the slash command, you can also use objects{}
		inside the parentheses and put additional stuff, like embed or ephemeral.
		You can also use emojis and markdown text like you'd do in normal discord messages.
		*/
		await interaction.editReply({ embeds: [embed] });
	},
};