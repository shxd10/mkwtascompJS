const { SlashCommandBuilder } = require('discord.js');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Play TicTacToe!')
		.addUserOption((option) => {
			return option
				.setName('opponent')
				.setDescription('Who do you want to play against?')
				.setRequired(false);
		}),
	async execute(interaction) {
		const opponent = interaction.options.getUser('opponent');
    game.handleInteraction(interaction, opponent);
	},
};
