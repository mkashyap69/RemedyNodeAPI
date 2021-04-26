/* eslint-disable node/no-unsupported-features/es-syntax */
const Remedy = require('../models/remedyModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

/* const remedies = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/remedies.json`)
); */

exports.aliasRemedies = (req, res, next) => {
  req.query.active = '1';
  req.query.limit = '5';
  req.query.page = '1';
  next();
};

exports.getAllRemedies = catchAsync(async (req, res, next) => {
  try {
    //execute query

    const features = new APIFeatures(Remedy.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .pagination();

    const remedies = await features.query;

    res.status(200).json({
      status: 'success',
      length: remedies.length,
      data: {
        remedies,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
});

exports.getRemedyStats = catchAsync(async (req, res, next) => {
  const stats = await Remedy.aggregate([
    {
      $match: { active: true },
    },
    {
      $group: {
        _id: { $toUpper: '$title' },
        numRemedies: { $sum: 1 },
      },
    },
    { $limit: 5 },
    { $sort: { dateOfEntry: -1 } },
    { $addFields: { dateOfEntry: '$dateOfEntry' } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getRemedy = factory.getOne(Remedy);

exports.createRemedy = factory.create(Remedy);

exports.updateRemedy = factory.update(Remedy);

exports.deleteRemedy = factory.delete(Remedy);
