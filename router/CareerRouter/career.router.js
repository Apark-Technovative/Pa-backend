const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/isAuthenticated");

const {
  createCareer,
  getCareer,
  getOneCareer,
  updateCareer,
  DeleteCareer,
} = require("../../controller/career.controller");

router.route("/career").post(isAuthenticated, createCareer);
router.route("/career").get(isAuthenticated, getCareer);
router.route("/getCareer").get(getCareer);
router.route("/career/:id").get(isAuthenticated, getOneCareer);
router.route("/getCareer/:id").get(getOneCareer);
router.route("/career/:id").patch(isAuthenticated, updateCareer);
router.route("/career/:id").delete(isAuthenticated, DeleteCareer);

module.exports = router;
