const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans an user (only for admins!)")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to unban.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    await interaction.guild.members.unban(user);

    await interaction.reply({
      content: `Succesfully unbanned ${user}`,
    });
  },
};
