const Faq = require("../model/faq.model");

exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and Answer are required" });
    }

    const newFaq = await Faq.create({ question, answer });

    res.status(201).json({ message: "FAQ created successfully", data: newFaq });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating FAQ", error: error.message });
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    const faqCount = await Faq.countDocuments();
    res.status(200).json({
      message: "FAQs retrieved successfully",
      data: faqs,
      count: faqCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving FAQs", error: error.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await Faq.findById(id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    const patchFaq = req.body;

    const updatedFaq = await Faq.findByIdAndUpdate(
      { _id: faq.id },
      {
        $set: patchFaq,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "FAQ updated successfully", data: updatedFaq });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating FAQ", error: error.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findById(id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    await Faq.findByIdAndDelete(id);
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting FAQ", error: error.message });
  }
};
