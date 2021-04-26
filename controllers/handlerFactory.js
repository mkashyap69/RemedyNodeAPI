const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    /* const id = req.params.id * 1; */ //since the id in the params object is a string we are multiplying it by one to convert into number

    const doc = await Model.findById({ _id: req.params.id });

    if (!doc) {
      return next(new AppError('No tour find with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
exports.update = (Model) =>
  catchAsync(async (req, res, next) => {
    /*   const id = req.params.id * 1; //since the id in the params object is a string we are multiplying it by one to convert into number */

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No tour find with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Data saved',
    });
  });

exports.delete = (Model) =>
  catchAsync(async (req, res, next) => {
    /* const id = req.params.id * 1;  */ //since the id in the params object is a string we are multiplying it by one to convert into number

    const doc = await Model.deleteOne({ _id: req.params.id });
    if (!doc) {
      return next(new AppError('No tour find with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
    });
  });
