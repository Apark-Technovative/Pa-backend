const Quote = require("../model/quote.model");
const emailTransporter = require("../utils/emailTransporter");
const fs = require("fs-extra");
const path = require("path");

exports.sendQuote = async (req, res) => {
  try {
    const { title, type1, type2, price } = req.body;
    const filePath = path.join(__dirname, "../mailContent/quote.html");

    var html = await fs.readFile(filePath, "utf-8");

    html = html.replace("[title]", title);
    html = html.replace("[type1]", type1);
    html = html.replace("[type2]", type2);
    html = html.replace("[price]", price);

    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: process.env.EMAIL_SENDER,
      subject: "web Mail",
      html: html,
    });
    if (info.messageId) {
      res.status(200).json({ message: "Quote sent successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error requesting quote", error: error.message });
  }
};
