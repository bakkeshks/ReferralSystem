const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralSchema = new Schema(
  {
    referrer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referred: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
