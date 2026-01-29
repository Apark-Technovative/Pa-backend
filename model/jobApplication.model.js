const mongoose = require("mongoose");
const jobApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your full name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    address:{
        type: String,
        required: [true, "Please enter your address"],
    },
    positionApplied: {
      type: String,
      required: [true, "Please enter the position you are applying for"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: [true, "Please provide the career post ID"],
    },
    resume: {
      type: String,
      required: [true, "Please upload your resume"],
    },
    coverLetter: {
      type: String,
      required: [true, "Please enter your cover letter"],
    },
    appliedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);