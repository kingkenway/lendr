const mongoose = require("mongoose");

// Create Schema
const accountSchema = new mongoose.Schema(
  {
    monoId: {
      type: String,
      default: "",
    },
    institution: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "",
    },
    balance: {
      type: String,
      default: "",
    },
    bvn: {
      type: String,
      default: "",
    },
    user: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
