const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicka un user (solo per admins!)")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Scegli l'user che vuoi kickare.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.options.getUser("target");
    member.kick();
    await interaction.reply({ content: `**${member}** kickato con successo.` });
  },
};
