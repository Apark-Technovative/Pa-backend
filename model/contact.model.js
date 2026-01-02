const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email"],
    },
    message: {
      type: String,
      required: [true, "Please enter the message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact",contactSchema)
