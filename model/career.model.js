const mongoose = require("mongoose");
const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter title for the career"],
  },
  position: {
    type: String,
    required: [true, "Please Enter position for the career"],
  },
  experienceRequired: {
    type: String,
    required: [true, "please Enter Experience required"],
  },
  description: {
    type: String,
    required: [true, "please Enter job description"],
  },
  deadline: {
    type: String,
    required: [true, "Please enter deadline"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Career", careerSchema);
