const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const Submission = require("../../schemas/submission.js");
const Task = require("../../schemas/task.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current-submissions')
		.setDescription('Show current submissions')
		.setDMPermission(false),
  async execute(interaction) {

    await interaction.deferReply();

    const task = await Task.findOne({
      isActive: true,
    }).catch(err => console.error(err));

    const allSubmissions = await Submission.find({
      taskNumber: task.number,
      taskYear: task.year,
    }).catch((err) => console.error(err));

    const submissionsNumber = await Submission.countDocuments({
      taskNumber: task.number,
      taskYear: task.year,
    });

    let text = `There are no submissions yet!`;

    for (let i = 0; i < submissionsNumber; i++) {
      text = `${i}. ${allSubmissions[i].submitterUser}\n`;
      console.log(submissionsNumber);
      console.log(allSubmissions[i].submitterUser);
    }

    await interaction.editReply(text);
  },
};
