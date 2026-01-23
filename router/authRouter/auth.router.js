const express = require("express");

const {
  createAdmin,
  loginAdmin,
  getAdmin,
  logoutAdmin,
  changeMyPassword,
  changePassword,
  getAdmins
} = require("../../controller/auth.controller");
const { isAuthenticated } = require("../../middleware/isAuthenticated");

const router = express.Router();

router.route("/login").post(loginAdmin);
router.route("/getAdmin").get(isAuthenticated, getAdmin);
router.route("/getAllAdmin").get(isAuthenticated, getAdmins);

router.route("/register").post(isAuthenticated, createAdmin);
router.route("/registerSuperAdmin").post(createAdmin);
router.route("/changeMyPassword").post(isAuthenticated, changeMyPassword);
router.route("/changePassword/:id").post(isAuthenticated, changePassword);

router.route("/logout").post(isAuthenticated, logoutAdmin);

module.exports = router;
