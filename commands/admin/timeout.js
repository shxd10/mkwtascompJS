const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeouts an user (only for admins!).")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to timeout.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription(
          "time"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("reason")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.options.getUser("target");
    const time = interaction.options.getInteger("time");
    let reason = interaction.options.getInteger("reason");

    if (!reason) reason = "No reason provided";

    interaction.member.timeout(time * 60 * 1000, reason);

    await interaction.reply({
      content: `test`,
    });
  },
};
