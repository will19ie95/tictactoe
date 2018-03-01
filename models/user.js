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
  isVerified: { type: Boolean, default: false },
  score: {
    human: {
      type: Number,
      default: 0
    },
    wopr: {
      type: Number,
      default: 0
    },
    tie: {
      type: Number,
      default: 0
    }
  },
  ttt: {
    start_date: {
      type: Date,
      default: Date.now
    },
    grid: {
      type: Array,
      default: [" ", " ", " ", " ", " ", " ", " ", " ", " "]
    },
    winner: {
      type: String,
      default: ""
    },
    id: {
      type: Number,
      default: 1
    }
  },
  history: { type: Array, default: []}
});

// token valid for 6 hrs
// const vTokenSchema = new Schema({
//   _userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User"},
//   token: {type: String, required: true},
//   createdAt: {type: Date, required: true, default: Date.now, expires: 21600}
// });

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

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.getName = function() {
  return this.username;
};

// label pos with sym
userSchema.methods.getGrid = function () {
  return this.ttt.grid;
};

userSchema.methods.getWinner = function () {
  return this.ttt.winner;
};

userSchema.methods.resetGrid = function () {
  this.ttt.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  this.ttt.winner = "";
  this.ttt.start_date = Date.now();
  this.ttt.id += 1;
};

userSchema.methods.updateScore = function(winner) {
  if (winner === " ") {
    this.score.tie += 1
  } else if (winner === "X") {
    this.score.human += 1
  } else if (winner === "O") {
    this.score.wopr += 1
  } else {
    // error
    console.log("HUGE ERROR! ")
  }
}

// userSchema.methods.appendHistory = function (ttt) {
//   this.history.append(ttt)
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
