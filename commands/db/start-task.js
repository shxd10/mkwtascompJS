const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Submission = require('../../schemas/submission.js');
const Task = require('../../schemas/task.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start-task')
		.setDescription('Start a task')
    .addIntegerOption((option) =>
			option.setName('number')
			.setDescription("The task's number.")
			.setRequired(true))
		.addIntegerOption((option) =>
			option.setName('year')
			.setDescription("The task's year (for special cases, it will get the current year automatically).")
			.setRequired(false))
		.addBooleanOption((option) =>
			option.setName('force')
			.setDescription("Force the execution of an already existed task this year.")
			.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		const number = interaction.options.getInteger('number');
		const year = interaction.options.getInteger('year');
		const force = interaction.options.getBoolean('force');
		const getYear = year ? year : new Date().getFullYear();

		const task = await Task.findOne({
			isActive: true,
		}).catch(err => console.error(err));

		if (!task) {
			try {
				const newTask = new Task({
					isActive: true,
					number: number,
					year: getYear,
					creator: interaction.user,
				})

				newTask.save()
					.then(async () => {
						await interaction.reply({ content: `Succesfully started **Task ${number} ${getYear}**!\nDatabase will start saving data. Run \`/end-task\` to end this task.` });
						console.log(`Succesfully started Task ${number} ${getYear}`)
					})
					.catch((err) => console.error(err))

			} catch (err) {
				console.error(err)
			}
		} else if (task) {
			const taskNumber = task.number;
			const taskYear = task.year;
			if ((force) && (taskNumber === number && taskYear === getYear)) {
				try {
					const newTask = new Task({
						isActive: true,
						number: number,
						year: getYear,
						creator: interaction.user,
					})
	
					newTask.save()
						.then(() => {
							interaction.reply({ content: `Forcefully started **Task ${number} ${getYear}**.` });
							console.log('Succesfully updated task')
						})
						.catch((err) => console.error(err))
	
				} catch (err) {
					console.error(err)
				}
			} else if (taskNumber === number && taskYear === getYear) {
				await interaction.reply({ content: `**Task ${taskNumber} ${taskYear}** was already started this year.\nSet the force option to \`true\` on this command to force the execution of already an existed task.` });
			} else {
				await interaction.reply({ content: `There is already an active task! \n Run \`/end-task\` to end **Task ${taskNumber} ${taskYear}**.` });
			}
		} else {
			await interaction.reply({ content: 'Couldnt start task! Try again, if the error occurs please contact the developer.' });
		}

	},
};