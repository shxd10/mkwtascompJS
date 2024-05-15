const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Untimeout (solo per admins!)")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.options.getUser("user");

    interaction.member.timeout(null);

    await interaction.reply({
      content: `**${member}** untimeouttato con successo.`,
    });
  },
};
