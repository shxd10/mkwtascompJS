const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Submission = require('../../schemas/submission.js');
const Task = require('../../schemas/task.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('end-task')
		.setDescription('End current task')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {

			const task = await Task.findOne({
				isActive: true
			}).catch(err => console.error(err));

			const taskNumber = task.number;
			const taskYear = task.year;

			if (task) {
				try {

					const updatedTask = await Task.updateOne({ isActive: true }, { isActive: false, killer: interaction.user }).then(() => {
							interaction.reply({ content: `Succesfully ended **Task ${taskNumber} ${taskYear}**!\nDatabase will stop saving data. Run \`/start-task\` to start a new task.` });

							console.log('Succesfully updated task')
						}).catch((err) => console.error(err));

				} catch (err) {
					console.error(err)
				}
			} else if (!task) {
				await interaction.reply({ content: 'There is no active task! \n Run `/start-task` to start a new task' });
			} else {
				await interaction.reply({ content: 'Couldnt end task! Try again, if the error occurs please contact the developer.' });
			}

	},
};