const { SlashCommandBuilder } = require('discord.js');

const tracks = [ "Luigi Circuit", "Moo Moo Meadows", "Mushroom Gorge", "Toad's Factory", "Mario Circuit", "Coconut Mall", "DK Summit", "Wario's Gold Mine", "Daisy Circuit", "Koopa Cape", "Maple Treeway", "Grumble Volcano", "Dry Dry Ruins", "Moonview Highway", "Bowser's Castle", "Rainbow Road", "GCN Peach Beach", "DS Yoshi Falls", "SNES Ghost Valley 2", "N64 Mario Raceway", "N64 Sherbet Land", "GBA Shy Guy Beach", "DS Delfino Square", "GCN Waluigi Stadium", "DS Desert Hills", "GBA Bowser Castle 3", "N64 DK's Jungle Parkway", "GCN Mario Circuit", "SNES Mario Circuit 3", "DS Peach Gardens", "GCN DK Mountain", "N64 Bowser's Castle" ]
const tracksAbb = [ 'LC', 'MMM', 'MG', 'TF', 'MC', 'CM', 'DKSC', 'WGM', 'DC', 'KC', 'MT', 'GV', 'DDR', 'MH', 'BC', 'RR', 'rPB', 'rYF', 'rGV2', 'rMR', 'rSL', 'rSGB', 'rDS', 'rWS', 'rDH', 'rBC3', 'rDKJP', 'rMC', 'rMC3', 'rPG', 'rDKM', 'rBC' ]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('Picks a random track of the game.')
		.addBooleanOption((option) =>
            option.setName('abbreviation')
            .setDescription("Do you want abbreviation instead of full names? (default: False)")),
	async execute(interaction) {
    const abb = interaction.options.getBoolean('abbreviation');

		const getTracks = () => {
			if (abb === true) {
				return tracksAbb[Math.floor(Math.random() * tracksAbb.length)];
			} else {
				return tracks[Math.floor(Math.random() * tracks.length)];
			}
		}

		await interaction.reply({ content: `Your random track is: **${getTracks()}**!` });
	},
};