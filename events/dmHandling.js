const { ChannelType } = require('discord.js');
const Task = require('../schemas/task.js');
const Submission = require('../schemas/submission.js');

async function handleDMs(message) {
  
  const task = await Task.findOne({ isActive: true }).catch((err) =>
    console.error(err)
  );
  
  //dm handling
  if (message.channel.type !== ChannelType.DM) return;
  console.log("dm received");
  
  const dm = message.channel;
  const file = message.attachments;
  
  //file handling
  if (file.size === 0) {
    console.log("dm received with no file attached");
    return;
  }
  
  const fileInfo = file.first();
  const URLParse = fileInfo.url.split("?");
  const rkgSlicer = URLParse[0].slice(-3);
  const rksysSlicer = URLParse[0].slice(-9);
  
  console.log("file received");
  console.log(fileInfo);
  
  //file detection
  if (!task.isActive) {
    dm.send("Task hasn't started yet.");
    console.log(task.isActive);
    return;
  }
  
  if (rkgSlicer === "rkg") {
    const rkgSubmission = new Submission({
      taskNumber: task.number,
      taskYear: task.year,
      submitterUser: message.author.username,
      submitterId: message.author.id,
      rkg: fileInfo.url,
    });
  
    try {
      const result = await rkgSubmission.save();
      console.log("'.rkg' file received!", result);
      dm.send("`.rkg` detected! \n The file was successfully saved. Type `/info` for more information about the file.");
    } catch (err) {
      console.error(err);
    }
  } else if (rksysSlicer === "rksys.dat") {
    const rksysSubmission = new Submission({
      taskNumber: task.number,
      taskYear: task.year,
      submitterUser: message.author.username,
      submitterId: message.author.id,
      rksys: fileInfo.url,
    });
  
    try {
      const result = await rksysSubmission.save();
      console.log("'rksys.dat' received!", result);
      dm.send("`rksys.dat` detected! \n The file was successfully saved. Type `/info` for more information about the file.");
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("other file received");
  }
}

module.exports = { handleDMs };
