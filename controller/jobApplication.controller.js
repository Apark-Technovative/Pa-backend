const Job = require("../model/jobApplication.model");
const emailTransporter = require("../utils/emailTransporter");
const fs = require("fs-extra");
const path = require("path");

exports.applyForJob = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      positionApplied,
      postId,
      coverLetter,
    } = req.body;
    const userMail = path.join(__dirname, "../mailContent/jobAppliedUser.html");
    const adminMail = path.join(
      __dirname,
      "../mailContent/jobAppliedAdmin.html",
    );

    const resumeFile = req.files?.resume?.[0];

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !positionApplied ||
      !postId ||
      !resumeFile ||
      !coverLetter
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Send email to user
    let userHtml = await fs.readFile(userMail, "utf-8");
    userHtml = userHtml.replace("[fullName]", fullName);
    userHtml = userHtml.replace("[positionApplied]", positionApplied);

    const userMailInfo = await emailTransporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Job Application Received",
      html: userHtml,
    });

    // Send email to admin
    let adminHtml = await fs.readFile(adminMail, "utf-8");
    adminHtml = adminHtml.replace("[fullName]", fullName);
    adminHtml = adminHtml.replaceAll("[email]", email);
    adminHtml = adminHtml.replace("[phone]", phone);
    adminHtml = adminHtml.replace("[positionApplied]", positionApplied);
    adminHtml = adminHtml.replace("[appliedOn]", new Date().toLocaleString());

    var adminMailInfo = await emailTransporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Job Application Received",
      html: adminHtml,
    });

    if (!userMailInfo.messageId || !adminMailInfo.messageId) {
      return res.status(400).json({
        message: "Error sending confirmation emails",
      });
    }
    if (userMailInfo.messageId && adminMailInfo.messageId) {
      const newApplication = await Job({
        fullName,
        email,
        phone,
        address,
        positionApplied,
        postId,
        resume: resumeFile.filename,
        coverLetter,
      }).save();
      res.status(201).json({
        message: "Job application submitted successfully",
        data: { userMailInfo, adminMailInfo },
      });
    } else {
      res.status(500).json({
        message: "Error submitting application",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting application", error: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Job.find();
    const applicationCount = await Job.countDocuments();
    res.status(200).json({
      message: "Job applications retrieved successfully",
      data: applications,
      count: applicationCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving applications", error: error.message });
  }
};

exports.getOneJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Job.findById(id);
    if (!application) {
      return res.status(404).json({
        message: "Job application not found",
      });
    }
    res.status(200).json({
      message: "Job application retrieved successfully",
      data: application,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving application", error: error.message });
  }
};
