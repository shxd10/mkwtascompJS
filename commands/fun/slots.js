const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Slots through the emojis!')
    .addIntegerOption(option =>
      option
        .setName('number')
        .setDescription('The number of times you want to slot (default is 3).')
        .setMinValue(1)
        .setRequired(false)
    ),
  async execute(interaction) {
    const numberOption = interaction.options.getInteger('number');
    const number = numberOption ? numberOption : 3;
    const guild = interaction.guild;
    const channel = interaction.channel;
    const emojis = Array.from(guild.emojis.cache.values());
    const numEmojis = emojis.length;

    function getRandomEmoji() {
      const randomIndex = Math.floor(Math.random() * numEmojis);
      return emojis[randomIndex].toString();
    }

    let slots = '';
    let totalLength = 0;
    for (let i = 0; i < number; i++) {
      const emoji = getRandomEmoji();
      const emojiLength = emoji.length + 1; // Adding 1 for the space
      if (totalLength + emojiLength <= 2000) {
        slots += emoji + ' ';
        totalLength += emojiLength;
      } else {
        break; // Break the loop if adding the next emoji exceeds the limit
      }
    }

    // Check if all emojis are the same
    const allEqual = arr => arr.every(val => val === arr[0]);
    const emojiArr = slots.split(' ');
    emojiArr.pop();

    if (slots.length > 2000) {
      emojiArr.pop(); // Truncate if it exceeds 2000 characters
    }

    await interaction.reply(slots);

    const totalOutcomes = Math.pow(numEmojis, number);
    const probability = 1 / totalOutcomes;
    const probabilityAsFraction = `1 out of ${totalOutcomes}`;
    const probabilityAsPercentage = (probability * 100).toFixed(2);

    if (allEqual(emojiArr)) {
      if (number === 1) channel.send(`You won! wait.. uh?`);
      else channel.send(`:tada: You won! The chance of winning was ${probabilityAsFraction} (${probabilityAsPercentage}%)`);
    } else {
      channel.send('Better luck next time!');
    }
  }
};
