const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

var corsOptions = {
  // origin: true,
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", // Local frontend
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

app.use("/media", express.static("files/media"));

const authRouter = require("./router/authRouter/auth.router");
const serviceRouter = require("./router/servicesRouter/services.router");

app.use("/", authRouter,serviceRouter);











module.exports = app;