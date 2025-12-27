const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
  {
    question: {
        type: String,
        required: [true, "Please enter the question"],
        trim: true,
    },
    answer: {
        type: String,
        required: [true, "Please enter the answer"],
        trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Faq", faqSchema);