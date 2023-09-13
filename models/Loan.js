const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const loanStages = {
  ground: 0,
  kyc: 1,
  account_linked: 2,
};

const loanSchema = new mongoose.Schema(
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

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
