const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const AppError = require('../utils/AppError');

const remedySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A remedy title is required'],
    },
    description: {
      type: String,
      required: [true, 'A remedy is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'SERVER',
        'INTERNET',
        'INCENTIVES',
        'HOLIDAYS',
        'MAINTENANCE',
        'LEAVE',
        'DESKTOP',
      ],
      default: 'SERVER',
    },
    active: {
      type: Boolean,
      default: true,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    dateOfEntry: {
      type: Date,
      default: Date.now(),
      /* validate: {
        validator: {
          function(val) {
            return val < Date.now();
          },
        },
        message: 'Date can not be greater than todays date',
      }, */
    },
    Image: {
      type: String,
    },
    slug: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    analyst: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

remedySchema.index({ active: 1 });

remedySchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name email Avatar CompanyName',
  }).populate({
    path: 'analyst',
    select: ' name email Avatar CompanyName',
  });
});

remedySchema.virtual('elapsedTime').get(function () {
  return new Date('<YYYY-mm-dd>') - this.dateOfEntry;
});

remedySchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
remedySchema.pre('save', async function (next) {
  const user = await User.findById(this.user._id);
  const analyst = await User.findById(this.analyst);

  if (!user || !analyst) {
    next(
      new AppError(
        'This user/analyst is not available. Please enter correct user/analyst Id and check the role specified by the company',
        400
      )
    );
  }
  if (!(user.Role === 'USER')) {
    next(
      new AppError(
        'This user is not available. Please enter correct user Id and check the role specified by the company',
        400
      )
    );
  } else if (!(analyst.Role === 'ANALYST')) {
    next(
      new AppError(
        'This analyst is not available. Please enter correct analyst Id and check the role specified by the company',
        400
      )
    );
  } else {
    next();
  }
});

remedySchema.pre('aggregate', function (next) {
  this.pipeline.unshift({ $match: { $category: 'SERVER' } });
});

const Remedy = mongoose.model('Remedy', remedySchema);

module.exports = Remedy;
