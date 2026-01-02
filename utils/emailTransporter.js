const nodemailer = require("nodemailer")
require("dotenv").config({path:"config/config.env"})

const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    auth:{
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASSWORD
    }
})

module.exports = emailTransporter