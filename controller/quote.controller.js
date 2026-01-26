const Quote = require("../model/quote.model");
const emailTransporter = require("../utils/emailTransporter");
const fs = require("fs-extra");
const path = require("path");

exports.sendQuote = async (req, res) => {
  try {
    const { title, type1, type2, price, email } = req.body;
    const quote = path.join(__dirname, "../mailContent/quote.html");
    const bankingQuote = path.join(
      __dirname,
      "../mailContent/bankingQuote.html",
    );
    var html;
    if (title == "Banking Mortgage Loans in Nepal") {
      console.log(price);
      
      html = await fs.readFile(bankingQuote, "utf-8");
      html = html.replace("[title]", title);
      html = html.replace("[price]", price);
    } else {
      html = await fs.readFile(quote, "utf-8");
      html = html.replace("[title]", title);
      html = html.replace("[type1]", type1);
      html = html.replace("[type2]", type2);
      html = html.replace("[price]", price);
    }

    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "web Mail",
      html: html,
    });
    if (info.messageId) {
      const quote = await Quote.create({
        title: title,
        type1: type1 ? type1 : "",
        type2: type2 ? type2 : "",
        price: price,
        email,
      });
      res.status(200).json({ message: "Quote sent successfully" });
    } else {
      res.status(400).json({
        message: "Error sending Quote",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error requesting quote", error: error.message });
  }
};
