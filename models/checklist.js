const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  finalReviewedBy: String,
  finalReviewDate: Date,
  reviewedBy: String,
  reviewDate: Date,
  preparedBy: String,
  preparedDate: Date,
  explanation: String,
  mfiRef: String,
  lineNumber: Number,
  instruction: String,
});

const phaseSchema = new Schema({
  title: String,
  order: Number,
  tasks: [taskSchema],
});

const checklistSchema = new Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  reference: String,
  created_date: { type: Date, default: Date.now },
  template: String,
  phases: [phaseSchema],
});

const Checklist = mongoose.model("Checklist", checklistSchema);

module.exports = Checklist;
