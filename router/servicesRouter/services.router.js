const express = require("express");
const { isAuthenticated } = require("../../middleware/isAuthenticated");
const {
  getServices,
  createService,
  updateService,
} = require("../../controller/services.controller");
const imageUpload = require("../../middleware/mediaUploads");

const router = express.Router();

router.route("/services").get(isAuthenticated, getServices);

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

router.route("/services/:id").patch(isAuthenticated, updateService);

router.route("/services/:id").delete((req, res) => {
  // Handle deleting a service logic here
  res.send(`Delete Service with ID: ${req.params.id}`);
});

module.exports = router;
