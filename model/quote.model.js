const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
    },
    type1: {
      type: String,
      // required: [true, "Please enter the type"]
    },
    type2: {
      type: String,
      // required: [true,]
    },
    price: {
      type: String,
    },
    email:{
        type: String,
        required: [true, "Please enter email"]
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Quote",quoteSchema)