const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Task = require("../../schemas/task.js");
const Submission = require("../../schemas/submission.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("submissions")
    .setDescription("Check all the submissions in the database.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("What user are you looking for?")
        .setRequired(false)
    )
    .addStringOption((option) =>
			option
				.setName('task')
				.setDescription('What task do you want to see submissions?')
				.setRequired(false)
				.setAutocomplete(true)
		)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
    const user = interaction.options.getUser("user");
    const taskOption = interaction.options.getString("task");

    async function results() {
      
      const task = await Task.findOne({
        isActive: true,
      }).catch(err => console.error(err));

      if (taskOption) {
        const number = taskOption.split(' - ')[0];
        const year = taskOption.split(' - ')[1];
        
        const task = await Task.findOne({
          number: number,
          year: year,
        }).catch(err => console.error(err));

        const allSubmissions = await Submission.find({
          taskNumber: task.number,
          taskYear: task.year,
        }).catch((err) => console.error(err));
        const submissionsNumber = await Submission.countDocuments({
          taskNumber: task.number,
          taskYear: task.year,
        });
        console.log(
          `Got all submissions for Task ${task.number} ${task.year}!`
        );

        const field = []; // Define an array to store all field

        for (let i = submissionsNumber - 1; i >= 0; i--) {
          const file = allSubmissions[i].rkg
            ? allSubmissions[i].rkg
            : allSubmissions[i].rksys
            ? allSubmissions[i].rksys
            : "No file was submitted.";
          const userField = {
            name: "User",
            value: `${allSubmissions[i].submitterUser}\n${allSubmissions[i].submitterId}`,
            inline: true,
          };
          const fileField = {
            name: "File",
            value: file,
            inline: true,
          };
          const timeField = {
            name: "Time of submission",
            value: `${allSubmissions[i].createdAt}`,
            inline: true,
          };
          const lineBreakField = {
            name: "\n", // Using zero-width space to create a blank line
            value: "\n",
          };

          field.push(lineBreakField, userField, fileField, timeField, lineBreakField); // Push each field to the array
        }

        const embed = new EmbedBuilder()
          .setTitle(`Task ${task.number} ${task.year} Submissions`)
          .addFields(field) // Pass the array of fields to addFields()
          .setColor("Random")
          .setTimestamp();

        return { embeds: [embed] };
      }

      if (!task) {
        return { content: "There is no active task!\nUse the \`\`" };
      }

      if (user) {
        const submitter = await Submission.findOne({
          taskNumber: task.number,
          taskYear: task.year,
          submitterUser: user.username,
          submitterId: user.id,
        }).catch((err) => console.error(err));

        if (submitter) {
          const username = submitter.submitterUser;
          const userId = submitter.submitterId;
          const time = submitter.time;
          const rkg = submitter.rkg;
          const rksys = submitter.rksys;
          const file = rkg ? rkg : rksys ? rksys : "No file was submitted.";

          console.log(`Got the submission! \n\n ${submitter}`);

          const embed = new EmbedBuilder()
            .setTitle(
              `${username}'s Task ${task.number} ${task.year} submission`
            )
            .setDescription(file)
            .addFields(
              { name: "Username", value: username, inline: true },
              { name: "UserID", value: userId, inline: true },
              { name: "Submission Time", value: time, inline: true },
              { name: "\n", value: "\n" },
              { name: "Track", value: rkg.split("/").pop().split("_")[0], inline: true, },
              { name: "Mii Name", value: rkg.split("_")[1], inline: true },
              { name: "Time", value: rkg.split("_").pop().split(".")[0], inline: true, }
            )
            .setColor("Blue")
            .setTimestamp();
          return { embeds: [embed] };
        } else {
          return { content: `No submissions found for ${user.username}!` };

        }
      } else {
        const allSubmissions = await Submission.find({
          taskNumber: task.number,
          taskYear: task.year,
        }).catch((err) => console.error(err));
        const submissionsNumber = await Submission.countDocuments({
          taskNumber: task.number,
          taskYear: task.year,
        });
        const allDocuments = await Submission.countDocuments();
        console.log(
          `Got all submissions!`
        );

        const field = []; // Define an array to store all field

        for (let i = submissionsNumber - 1; i >= 0; i--) {
          const file = allSubmissions[i].rkg
            ? allSubmissions[i].rkg
            : allSubmissions[i].rksys
            ? allSubmissions[i].rksys
            : "No file was submitted.";
          const userField = {
            name: "User",
            value: `${allSubmissions[i].submitterUser}\n${allSubmissions[i].submitterId}`,
            inline: true,
          };
          const fileField = {
            name: "File",
            value: file,
            inline: true,
          };
          const timeField = {
            name: "Time of submission",
            value: `${allSubmissions[i].createdAt}`,
            inline: true,
          };
          const lineBreakField = {
            name: "\n", // Using zero-width space to create a blank line
            value: "\n",
          };

          field.push(lineBreakField, userField, fileField, timeField, lineBreakField); // Push each field to the array
        }

        const embed = new EmbedBuilder()
          .setTitle(`Task ${task.number} ${task.year} Submissions`)
          .addFields(field) // Pass the array of fields to addFields()
          .setColor("Green")
          .setTimestamp();

        return { embeds: [embed] };
      }
    }

    const result = await results();

    await interaction.reply(result);
  },
};
