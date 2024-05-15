require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici')
const apiKey = process.env.openweatherKey
// 3a4055e3ed800b03c292eea044a80325

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription("Search for the weather!")
    .addStringOption((option) =>
      option
        .setName('city')
        .setDescription('The city.')
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    const city = interaction.options.getString('city');

    await interaction.deferReply();

    try {
        const apiRequest = await request(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const response = await apiRequest.body.json();

        if (response.cod !== 200) {
            return await interaction.editReply(`No results found for **${city}**.`);
        }

        const country = response.sys.country;
        const { weather, main } = response;
        console.log(apiRequest)
        console.log(response)
        const toFarenheit = (temp) => {
          return temp * 1.8 + 32;
        }

        const embed = new EmbedBuilder()
            .setColor(0xEFFF00)
            .setTitle(`${city} (${country}) Weather`)
            .setDescription(weather[0].description)
            .addFields(
                { name: 'Temperature', value: `${main.temp}°C\n${toFarenheit(main.temp)}°F`, inline: true },
                { name: 'Feels Like', value: `${main.feels_like}°C`, inline: true },
                { name: `\n`, value: `\n` },
                { name: 'Humidity', value: `${main.humidity}%`, inline: true },
                { name: 'Wind Speed', value: `${response.wind.speed} m/s`, inline: true },
            )
            .setFooter({ text: 'Powered by OpenWeatherMap API' });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        await interaction.editReply('An error occurred while fetching weather data.');
    }
  }, 
};