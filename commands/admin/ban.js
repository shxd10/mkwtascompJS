const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans an user (only for admins!)')
        .addUserOption((option) =>
            option.setName('target')
            .setDescription("The target.")
            .setRequired(true))
        .addStringOption((option) =>
            option.setName('reason')
            .setDescription("The reason (optional)."))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
        const target = interaction.options.getUser('target');

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason provided';

        const ban = new ButtonBuilder()
			.setCustomId('ban')
			.setLabel('Ban')
			.setStyle(ButtonStyle.Danger);
        const canc = new ButtonBuilder()
			.setCustomId('canc')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(ban, canc);

		const response = await interaction.reply({
            content: `Do you want to ban ${target}?`,
            components: [row]
        });

        try {
            const collectorFilter = (i) => i.user.id === interaction.user.id;
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'ban') {
                await interaction.guild.members.ban(target)
                await confirmation.update({ content: `Succesfully banned ${target}\nReason: *${reason}*.`, components: [] });
            } else if (confirmation.customId === 'canc') {
                await confirmation.update({ content: `Cancelled action`, components: [] });
            }

        } catch (e) {
            await interaction.editReply({ content: 'Answer not given in 1 minute, will delete in 30 seconds.', components: [] });
        }}
};