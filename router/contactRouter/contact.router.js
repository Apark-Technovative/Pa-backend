const express = require("express");
const { isAuthenticated } = require("../../middleware/isAuthenticated");
const {
  createContact,
  getAllContact,
  getOneContact,
} = require("../../controller/contact.controller");

const router = express.Router();

router.route("/contact").post(createContact);
router.route("/contact").get(isAuthenticated, getAllContact);
router.route("/contact/:id").get(isAuthenticated, getOneContact);

module.exports = router;
