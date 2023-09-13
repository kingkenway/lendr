const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    role: String,
    profile: {
      firstName: String,
      lastName: String,
      picture: String,
    },
    monoId: {
      type: String,
      default: "",
    },
    monoCode: {
      type: String,
      default: "",
    },
    monoStatus: {
      type: Boolean,
      default: false,
    },
    monoReauthToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", async function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    user.password = await bcrypt.hash(user.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword,
  cb
) {
  try {
    cb(null, await bcrypt.compare(candidatePassword, this.password));
  } catch (err) {
    cb(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
