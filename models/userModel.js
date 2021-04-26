const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Remedy = require('./remedyModel'); 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  contact: {
    type: String,
    required: [true, 'Please tell us your number!'],
  },
  Avatar: {
    type: String,
  },
  Role: {
    type: String,
    enum: ['ADMIN', 'ANALYST', 'USER'],
    /*   default: 'USER', */
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  ip_address: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  JobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  CompanyName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  Active: {
    type: Boolean,
    default: true,
    select: false,
  },
 /*  remedies: [{ type: mongoose.Schema.ObjectId, ref: 'Remedy' }], */
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

/* userSchema.pre('save', async function () {
  const remedyPromise = this.Remedies.map(
    async (el) => await Remedy.findById(el)
  );

  this.Remedies = await Promise.all(remedyPromise);
}); */

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // so that the passwordChangedAt changes before the token so that there is no problem while logging in
  next();
});

/* userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
}); */

//virtually populating the reviews to the user
 userSchema.virtual('remedies', {
  ref: 'Remedy',
  foreignField: 'user',
  localField: '_id',
}); 

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetExpires);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
