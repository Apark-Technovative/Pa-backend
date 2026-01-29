const express = require("express");
const router = express.Router();

const {
  applyForJob,
  getJobApplications,
  getOneJobApplication,
} = require("../../controller/jobApplication.controller");

const fileUpload = require("../../middleware/fileUpload");

router
  .route("/applyJob")
  .post(fileUpload.fields([{ name: "resume", maxCount: 1 }]), applyForJob);
router.route("/getJobApplications").get(getJobApplications);
router.route("/getJobApplication/:id").get(getOneJobApplication);

module.exports = router;
