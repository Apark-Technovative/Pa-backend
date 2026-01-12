const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter service title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter service description"],
    },
    tag: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      required: [true, "Please enter service status"],
      enum: ["active", "inactive"],
      default: "active",
    },
    image: [
      {
        type: String,
        required: [true, "Please upload service image"],
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Service", serviceSchema);
