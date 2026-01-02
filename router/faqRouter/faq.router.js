const express = require("express");
const { isAuthenticated } = require("../../middleware/isAuthenticated");

const {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
} = require("../../controller/faq.controller");

const router = express.Router();


router.route("/faqs").get(isAuthenticated, getFaqs);
router.route("/Faqs").get(isAuthenticated,getFaqs);
router.route("/getFaqs").get(getFaqs);
router.route("/faqs").post(isAuthenticated, createFaq);
router.route("/faqs/:id").patch(isAuthenticated, updateFaq);
router.route("/faqs/:id").delete(isAuthenticated, deleteFaq);

module.exports = router;