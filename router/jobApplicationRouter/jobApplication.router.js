const express = require("express");
const router = express.Router();

const {
  applyForJob,
  getJobApplications,
  getOneJobApplication,
} = require("../../controller/jobApplication.controller");

const fileUpload = require("../../middleware/fileUpload");
const { isAuthenticated } = require("../../middleware/isAuthenticated");


router
  .route("/applyJob")
  .post(fileUpload.fields([{ name: "resume", maxCount: 1 }]), applyForJob);
router.route("/getJobApplications").get(isAuthenticated, getJobApplications);
router.route("/getJobApplication/:id").get(isAuthenticated, getOneJobApplication);

module.exports = router;
