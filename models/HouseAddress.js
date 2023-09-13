const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const houseAddressSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      unique: true,
    },
    stage: {
      enum: ["not_started", "kyc", "house_address", "account_linked"],
      default: 0,
    },
    loanAmount: {
      type: Number,
      default: 0,
    },
    provisionedAmount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejectedReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const HouseAddress = mongoose.model("HouseAddress", houseAddressSchema);

module.exports = HouseAddress;
