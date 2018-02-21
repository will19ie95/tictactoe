var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

function isEmail(email) {
  // regex check for email
  return (
    email.length &&
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  );
}

const userSchema = new Schema({
  email: {
    type: String,
    validate: [isEmail, "Invalid Email Address"],
    unique: true
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

// token valid for 6 hrs
const vTokenSchema = new Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User"},
  token: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now, expires: 21600}
});

const noop = function() {};

// hash password before saving
userSchema.pre("save", function(done) {
  const user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return done(err);
    }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) {
        return done(err);
      }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkpassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.name = function() {
  return this.username;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
