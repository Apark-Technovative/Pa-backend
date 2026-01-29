const Job = require("../model/jobApplication.model");
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

    const resumeFile = req.files?.resume?.[0];

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !positionApplied ||
      !postId ||
      !resume ||
      !coverLetter
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

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
      data: newApplication,
    });
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
