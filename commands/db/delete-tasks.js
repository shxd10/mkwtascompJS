const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js');
const Task = require('../../schemas/task.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-tasks')
		.setDescription('Delete tasks from the database')
		.addStringOption((option) =>
			option
				.setName('task')
				.setDescription('What task do you want to delete?')
				.setRequired(false)
				.setAutocomplete(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();

		const allTasks = await Task.find({}).catch(err => console.error(err));
		const tasksNumber = await Task.countDocuments({});
		let choices = [];

		for (let i = 0; i < tasksNumber; i++) {
			choices.push(`${allTasks[i].number} - ${allTasks[i].year}`);
		}
		console.log(tasksNumber);
		console.log(choices);

		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
		const task = interaction.options.getString('task');

		if (!task) {
			await Task.deleteMany({})
				.then(() =>
					interaction.reply({ content: `Succesfully deleted all Tasks!` })
				)
				.catch((err) => console.error(err));
		} else if (task) {
			const number = task.split(' - ')[0];
			const year = task.split(' - ')[1];
			await Task.deleteMany({
				number: number,
				year: year,
			})
				.then(() =>
					interaction.reply({
						content: `Succesfully deleted **Task ${number} ${year}**!`,
					})
				)
				.catch((err) => console.error(err));
		}
	},
};
