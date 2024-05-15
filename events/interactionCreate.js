const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (interaction.isChatInputCommand()) {
			return handleInteraction(command, interaction, command.execute);
		} else if (interaction.isAutocomplete()) {
			return handleInteraction(command, interaction, command.autocomplete);
		}
	},
};

async function handleInteraction(command, interaction, executeFunction) {
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await executeFunction(interaction);
	} catch (error) {
		console.error(error);
		const errorMessage = 'There was an error while executing this command!';
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: errorMessage, ephemeral: true });
		} else {
			await interaction.reply({ content: errorMessage, ephemeral: true });
		}
	}
}
