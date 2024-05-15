const { Schema, model } = require('mongoose');
const taskSchema = new Schema(
  {
    isActive: { type: Boolean, required: true },
    number: { type: Number, required: true },
    year: { type: Number, required: true },
    creator: { type: String, required: true },
    killer: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = model("task", taskSchema);