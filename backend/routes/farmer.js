const express = require("express");
const router = express.Router();

const {
  registerFarmer,
  loginFarmer,
  getfarmers,
  getOrder,
} = require("../controllers/farmer");

const { isAuthenticatedUser } = require("../middlewares/isAuthenticated");

router.route("/farmer").get(getfarmers);
router.route("/farmer/order/:id").patch(getOrder);
router.route("/farmer/register").post(registerFarmer);
router.route("/farmer/login").post(loginFarmer);

module.exports = router;
