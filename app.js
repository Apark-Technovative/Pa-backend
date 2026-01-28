const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

var corsOptions = {
  // origin: true,
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", // Local frontend
      "http://localhost:5174", // Local frontend
      "http://localhost:5175", // Local frontend
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Important for sending cookies
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/media", express.static("uploads"));

const authRouter = require("./router/authRouter/auth.router");
const serviceRouter = require("./router/servicesRouter/services.router");
const faqRouter = require("./router/faqRouter/faq.router");
const contactRouter = require("./router/contactRouter/contact.router");
const careerRouter = require("./router/CareerRouter/career.router");
const quoteRouter = require("./router/quoteRouter/quote.router");
const teamRouter = require("./router/teamRouter/team.router");

app.use(
  "/",
  authRouter,
  serviceRouter,
  faqRouter,
  contactRouter,
  careerRouter,
  quoteRouter,
  teamRouter
);

module.exports = app;
