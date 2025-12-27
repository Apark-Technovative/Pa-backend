const express = require("express");
const { isAuthenticated } = require("../../middleware/isAuthenticated");
const {
  getServices,
  createService,
  updateService,
  deleteService,
  getService
} = require("../../controller/services.controller");
const imageUpload = require("../../middleware/mediaUploads");

const router = express.Router();

router.route("/services").get(isAuthenticated, getServices);
router.route("/getServices").get( getServices);

router.route("/services").post(
  isAuthenticated,
  imageUpload.fields([
    {
      name: "image",
      maxCount: 5,
    },
  ]),
  createService
);
router.route("/services/:id").get(isAuthenticated, getService);

router.route("/services/:id").patch(
  isAuthenticated,
  imageUpload.fields([
    {
      name: "image",
      maxCount: 5,
    },
  ]),
  updateService
);

router.route("/services/:id").delete(isAuthenticated, deleteService);

module.exports = router;
