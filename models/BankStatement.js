const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const bankStatementSchema = new mongoose.Schema(
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

const BankStatement = mongoose.model("BankStatement", bankStatementSchema);

module.exports = BankStatement;
