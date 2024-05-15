const { Schema, model } = require('mongoose');
const submissionSchema = new Schema(
  {
    taskNumber: { type: Number, required: true },
    taskYear: { type: Number, required: true },
    submitterUser: { type: String, required: true },
    submitterId: { type: String, required: true },
    rkg: { type: String, required: false },
    rksys: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = model("submission", submissionSchema);