const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema(
  {
    test: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Webhook = mongoose.model("Webhook", webhookSchema);

module.exports = Webhook;
