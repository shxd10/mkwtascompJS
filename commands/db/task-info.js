const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const Submission = require("../../schemas/submission.js");
const Task = require("../../schemas/task.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('task-info')
		.setDescription('Delete tasks from the database')
		.addStringOption((option) =>
			option
				.setName('task')
				.setDescription('What task do you want to see info?')
				.setRequired(false)
				.setAutocomplete(true)
		)
		.setDMPermission(false),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();

		const allTasks = await Task.find({}).catch(err => console.error(err));
		let choices = [];

		for (let i = 0; i < allTasks.length; i++) {
			choices.push(`${allTasks[i].number} - ${allTasks[i].year}`);
		}
		console.log(allTasks.length);
		console.log(choices);

		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
  async execute(interaction) {
    const task = interaction.options.getString("task");

    async function results() {

      if (task) {
        const number = task.split(' - ')[0];
        const year = task.split(' - ')[1];

        const foundTask = await Task.findOne({
          number: number,
          year: year,
        }).catch((err) => console.error(err));

        const submissionsNumber = await Submission.countDocuments({
          taskNumber: foundTask.number,
          taskYear: foundTask.year,
        });

        const createdDate = new Date(`${foundTask.createdAt}`);
        const updatedDate = new Date(`${foundTask.updatedAt}`);

        const embed = new EmbedBuilder()
          .setTitle(`Task ${foundTask.number} ${foundTask.year} Info`)
          .addFields(
            { name: '\n', value: '\n'},
            { name: 'Task', value: `${foundTask.number}\n${foundTask.year}`, inline: true },
            { name: 'Submissions', value: `${submissionsNumber}`, inline: true},
            { name: '\n', value: '\n'},
            { name: 'Created', value: `by ${foundTask.creator} at ${createdDate.toLocaleTimeString()} of ${createdDate.toLocaleDateString()}`, inline: true },
            { name: 'Ended', value: `by ${foundTask.creator} at ${updatedDate.toLocaleTimeString()} of ${updatedDate.toLocaleDateString()}`, inline: true },
            { name: '\n', value: '\n'},
          ) // Pass the array of fields to addFields()
          .setColor("Green")
          .setTimestamp();

        return { embeds: [embed] };

      } else if (!task) {
        const allTasks = await Task.find({}).catch((err) => console.error(err));
        const tasksNumber = await Task.countDocuments({});
        console.log(
          `Got all tasks!`
        );

        const fields = []; // Define an array to store all fields

        for (let i = tasksNumber - 1; i >= 0; i--) {

          const submissionsNumber = await Submission.countDocuments({
            taskNumber: allTasks[i].number,
            taskYear: allTasks[i].year,
          });

          const taskField = {
            name: "Task",
            value: `${allTasks[i].number}\n${allTasks[i].year}`,
            inline: true,
          };
          const submissionsField = {
            name: "Submissions",
            value: `${submissionsNumber}`,
            inline: true,
          };
          const startField = {
            name: "Created At",
            value: `${allTasks[i].createdAt}`,
            inline: true,
          };
          const endField = {
            name: "Ended/Updated At",
            value: `${allTasks[i].updatedAt}`,
            inline: true,
          };
          const lineBreakField = {
            name: "\n", // Using zero-width space to create a blank line
            value: "\n",
          };

          fields.push(lineBreakField, taskField, submissionsField, startField, endField, lineBreakField); // Push each field to the array
        }
        console.log(fields)

        const embed = new EmbedBuilder()
          .setTitle(`Tasks Info`)
          .addFields(fields) // Pass the array of fields to addFields()
          .setColor("Green")
          .setTimestamp();

        return { embeds: [embed] };
      }
    }

    const result = await results();

    await interaction.reply(result);
  },
};
