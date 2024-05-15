const { SlashCommandBuilder } = require('discord.js');

// Functions for the conversions
const CelToFah = (celsius) => celsius * 1.8 + 32;
const CelToKel = (celsius) => celsius + 273.15;
const FahToCel = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
const FahToKel = (fahrenheit) => ((fahrenheit - 32) * 5) / 9 + 273.15;
const KelToCel = (kelvin) => kelvin - 273.15;
const KelToFah = (kelvin) => ((kelvin - 273.15) * 9) / 5 + 32;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('temp')
		.setDescription('Convert temperatures ')
    .addNumberOption((option) =>
			option
				.setName('temperature')
				.setDescription('The temperature you want to convert.')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('unit')
				.setDescription('The temperature unit you want to convert.')
				.setRequired(true)
        .setAutocomplete(true)
		)
    .addStringOption((option) =>
			option
				.setName('to-unit')
				.setDescription('The unit you want to convert the temperature to.')
				.setRequired(true)
        .setAutocomplete(true)
		),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
		const choices = ['Celsius', 'Fahrenheit', 'Kelvin'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
  },
	async execute(interaction) {
		// Extract the temperature value, unit, and target unit
		const temperature = interaction.options.getNumber('temperature');
		const unit = interaction.options.getString('unit');
		const toUnit = interaction.options.getString('to-unit');

		// Perform temperature conversion based on the provided units
		let result;
		switch (unit) {
      case 'Celsius':
        switch (toUnit) {
          case 'Fahrenheit':
            result = CelToFah(temperature);
            interaction.reply(
              `${temperature}°C is equal to ${result.toFixed(2)}°F`
            );
            break;
          case 'Kelvin':
            result = CelToKel(temperature);
            interaction.reply(`${temperature}°C is equal to ${result.toFixed(2)}K`);
            break;
          default:
            interaction.reply('Invalid target unit.\nPlease use `Fahrenheit` or `Kelvin`.');
            break;
        }
        break;
      case 'Fahrenheit':
        switch (toUnit) {
          case 'Celsius':
            result = FahToCel(temperature);
            interaction.reply(
              `${temperature}°F is equal to ${result.toFixed(2)}°C`
            );
            break;
          case 'Kelvin':
            result = FahToKel(temperature);
            interaction.reply(`${temperature}°F is equal to ${result.toFixed(2)}K`);
            break;
          default:
            interaction.reply('Invalid target unit.\nPlease use `Celsius` or `Kelvin`.');
            break;
        }
        break;
      case 'Kelvin':
        switch (toUnit) {
          case 'Celsius':
            result = KelToCel(temperature);
            interaction.reply(`${temperature}K is equal to ${result.toFixed(2)}°C`);
            break;
          case 'Fahrenheit':
            result = KelToFah(temperature);
            interaction.reply(`${temperature}K is equal to ${result.toFixed(2)}°F`);
            break;
          default:
            interaction.reply('Invalid target unit.\nPlease use `Celsius` or `Fahrenheit`.');
            break;
        }
        break;
      default:
        interaction.reply('Invalid unit.\nPlease use `Celsius`, `Fahrenheit`, or `Kelvin`.');
        break;
    }
	},
};
