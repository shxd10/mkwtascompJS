// Importing
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Slashcommand configuration
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes a number of messages (only for admins!)')
        // Adds an integer option for the amount
        .addIntegerOption((option) =>
            option .setName('amount')
            .setDescription('The amount of messages you want to delete.')
            .setMinValue(1) .setMaxValue(100)
            .setRequired(true))
        // Adds a boolean option for the ephemeral message
        .addBooleanOption((option) =>
            option .setName('ephemeral')
            .setDescription('Do you want it as an ephemeral message? (True as default)'))
        // Adds an integer option for the time
        .addIntegerOption((option) =>
            option .setName('time')
            .setDescription('How much time do you want till the delete message deletes? (3 seconds as default)')
            .setMinValue(1) .setMaxValue(60))
        //This sets the command for only members with the ManageMessages permission
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    // What the command will actually do
	async execute(interaction) {
        // Getting the user input from the options above
		const amount = interaction.options.getInteger('amount');
        const ephemeral = interaction.options.getBoolean('ephemeral');
        const time = interaction.options.getInteger('time');

        // Function for the ephemeral message
        function ephAlg() {
            if (ephemeral === false) {
                return false
            } else {
                return true
            }
        }

        // Function for the time till delete message deletes
        function timeAlg() {
            if (time) {
                return time * 1000
            } else if (!time) {
                return 3000
            }
        }

        // Function for the 'message'/'messages' syntax
        function syntax() {
            if (amount === 1) {
                return 'message'
            } else {
                return 'messages'
            }
        }

        // Embed Builder
        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`:white_check_mark: Deleted **${amount}** ${syntax()} (deleting this message in * seconds.)`)

        // 
        try {
            await interaction.channel.bulkDelete(amount)

            await interaction.reply({
                embeds: [embed],
                ephemeral: ephAlg()
                })

            setTimeout(async () => {
                await interaction.deleteReply();
            }, timeAlg())

        } catch (e) {
            console.error(e)
        }
}};