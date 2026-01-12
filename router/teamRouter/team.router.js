const express = require("express");
const { isAuthenticated } = require("../../middleware/isAuthenticated");
const imageUpload = require("../../middleware/mediaUploads");

const {
  addTeam,
  getTeam,
  getAllTeam,
  updateTeam,
  deleteTeam,
} = require("../../controller/team.controller");
const router = express.Router();

router.route("/team").post(
  isAuthenticated,
  imageUpload.fields([
    {
      name: "image",
      maxCount: 2,
    },
  ]),
  addTeam
);
router.route("/team").get(isAuthenticated, getAllTeam);
router.route("/team").get(getAllTeam);
router.route("/team/:id").get(isAuthenticated, getTeam);
router.route("/team/:id").patch(
  isAuthenticated,
  imageUpload.fields([
    {
      name: "image",
      maxCount: 2,
    },
  ]),
  updateTeam
);
router.route("/team/:id").delete(isAuthenticated, deleteTeam);

module.exports = router;
