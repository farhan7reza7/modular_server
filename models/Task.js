const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  content: { type: String },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Task", TaskSchema);
