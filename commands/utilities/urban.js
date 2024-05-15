const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('urban')
		.setDescription("Search on the Urban Dictionary!")
    .addStringOption((option) =>
			option
				.setName('term')
				.setDescription('The term you want to search on the Urban Dictionary.')
				.setRequired(true)
		)
    .setDMPermission(false),
	async execute(interaction) {
    const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });
    const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

    await interaction.deferReply();

		const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
		const { list } = await dictResult.body.json();

		if (!list.length) {
			return await interaction.editReply(`No results found for **${term}**.`);
		}

		const [answer] = list;

		const embed = new EmbedBuilder()
			.setColor(0xEFFF00)
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{
					name: 'Rating',
					value: `${answer.thumbs_up} thumbs up :thumbsup:\n${answer.thumbs_down} thumbs down :thumbsdown:`,
				},
			)
      .setFooter({ text: 'Powered by Urban Dictionary API' });

		await interaction.editReply({ embeds: [embed] });
	},
};