const User = require("../models/User");
const Referral = require("../models/Referral");

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password, referralCode } = req.body;

  try {
    // Generate a unique referral code
    const { nanoid } = await import("nanoid");
    const uniqueReferralCode = nanoid(6);
    // Check if referral code is provided and valid
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({ error: "Invalid referral code." });
      }
    }

    // Create and save new user
    const newUser = await User.create({
      username,
      email,
      password, // Remember to hash passwords in production
      referralCode: uniqueReferralCode,
    });

    // If a valid referrer exists, create a referral entry and update referral count
    if (referrer) {
      referrer.referralCount += 1;
      referrer.referredUsers.push(newUser._id);
      await referrer.save();

      await Referral.create({
        referrer: referrer._id,
        referred: newUser._id,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      referralCode: uniqueReferralCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.applyReferral = async (req, res) => {
  const { userId, referralCode } = req.body;

  try {
    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(400).json({ error: "Invalid referral code." });
    }

    // Find the referred user
    const referredUser = await User.findById(userId);
    if (!referredUser) {
      return res.status(400).json({ error: "Referred user not found." });
    }

    // Check if referral relationship already exists
    const existingReferral = await Referral.findOne({
      referrer: referrer._id,
      referred: referredUser._id,
    });
    if (existingReferral) {
      return res.status(400).json({ error: "Referral already applied." });
    }

    // Create the referral and update referrer count
    await Referral.create({
      referrer: referrer._id,
      referred: referredUser._id,
    });
    referrer.referralCount += 1;
    referrer.referredUsers.push(referredUser._id);
    await referrer.save();

    res.status(200).json({
      message: "Referral applied successfully",
      referrer: referrer.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTopReferrers = async (req, res) => {
  try {
    const topReferrers = await User.find()
      .sort({ referralCount: -1 }) // Sort by referralCount in descending order
      .limit(5) // Limit the result to top 5 users
      .select("username referralCount referralCode"); // Select fields to return

    res.status(200).json(topReferrers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
