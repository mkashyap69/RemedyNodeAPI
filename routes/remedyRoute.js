const express = require('express');
const remedyController = require('../controllers/remedyController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/latest-5-active').get(
  remedyController.aliasRemedies,
  remedyController.getAllRemedies
);

Router.route('/')
  .get(authController.protect, remedyController.getAllRemedies)
  .post(authController.protect,remedyController.createRemedy);

Router.route('/:id')
  .get(authController.protect,remedyController.getRemedy)
  .patch(authController.protect,remedyController.updateRemedy)
  .delete(authController.protect,authController.restrictTo('ADMIN'),remedyController.deleteRemedy);

module.exports = Router;
