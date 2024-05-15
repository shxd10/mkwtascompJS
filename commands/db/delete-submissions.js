const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js');
const Submission = require('../../schemas/submission.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-submissions')
		.setDescription('Delete submissions from the database')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('What user do you want to delete all submissions?')
				.setRequired(false)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		if (!user) {
      await Submission.deleteMany({})
				.then(() =>
					interaction.reply({
						content: `Succesfully deleted all submissions in the db!`,
					})
				)
				.catch((err) => console.error(err));
		} else if (!user) {
			await Submission.deleteMany({
				submitterUser: user.username,
				submitterId: user.id,
			})
				.then(() =>
					interaction.reply({
						content: `Succesfully deleted all submissions from ${user}!`,
					})
				)
				.catch((err) => console.error(err));
		}
	},
};
