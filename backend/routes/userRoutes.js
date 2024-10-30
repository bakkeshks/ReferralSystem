const express = require("express");
const router = express.Router();
const {
  registerUser,
  applyReferral,
  getTopReferrers,
} = require("../controllers/userController");

// POST /api/users/register - Register a new user
router.post("/register", registerUser);
router.post("/referral", applyReferral);
router.get("/top-referrers", getTopReferrers);

module.exports = router;
