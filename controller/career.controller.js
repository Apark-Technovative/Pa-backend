const Career = require("../model/career.model");
exports.createCareer = async (req, res) => {
  try {
    const { title, position, experienceRequired, description, deadline } =
      req.body;
    if ((!title, !position, !experienceRequired, !description, !deadline)) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const career = await Career({
      title,
      position,
      experienceRequired,
      description,
      deadline,
    }).save();

    res.status(201).json({
      message: "Career created",
      data: career,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contacts", error: error.message });
  }
};

exports.getCareer = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    const careerCount = await Career.countDocuments();
    res.status(200).json({
      message: "Career retrieved successfully",
      data: careers,
      count: careerCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contacts", error: error.message });
  }
};

exports.getOneCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    res.status(200).json({
      message: "Carreer retrived successfully",
      data: career,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contacts", error: error.message });
  }
};

exports.updateCareer = async (req, res) => {
  const { id } = req.params;
  const career = await Career.findById(id);
  const { title, position, experienceRequired, description, deadline } =
    req.body || {};
  if (!career) {
    return res.status(404).json({
      message: "Career not found",
    });
  }
  career.title = title ?? career.title;
  career.description = description ?? career.description;
  career.experienceRequired = experienceRequired ?? career.experienceRequired;
  career.deadline = deadline ?? career.deadline;
  career.position = position ?? career.position;

  const updatedCareer = await career.save();

  res.status(200).json({
    message: "Career updated successfully",
    data: updatedCareer,
  });

  try {
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contacts", error: error.message });
  }
};
exports.DeleteCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    await Career.findByIdAndDelete(id);
    res.status(200).json({ message: "Career deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contacts", error: error.message });
  }
};
