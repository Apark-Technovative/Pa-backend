const Contact = require("../model/contact.model");
const emailTransporter = require("../utils/emailTransporter");
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: process.env.EMAIL_SENDER,
      subject: "web Mail",
      html: `<h2 style="font-size: 24px;">Customer Name: ${name}</h2>
              <p style="font-size: 18px;">Contact Email: ${email}</p>
              <p style="font-size: 18px;">Customer Message: ${message}</p>`,
    });
    console.log(info);

    if (info.messageId) {
      const contact = await Contact({
        name: name,
        email: email,
        message: message,
      }).save();
      res.status(200).json({
        message: "Email sent",
        data: info.messageId,
      });
    } else {
      res.status(400).json({
        message: "Error sending mail",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending mail", error: error.message });
  }
};

exports.getAllContact = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const contactCount = await Contact.countDocuments();

    res.status(200).json({
      message: "Contacts retrieved sucessfully",
      data: contacts,
      count: contactCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contacts", error: error.message });
  }
};

exports.getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res
      .status(200)
      .json({ message: "Contact fetched successfully", data: contact });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving contact", error: error.message });
  }
};
