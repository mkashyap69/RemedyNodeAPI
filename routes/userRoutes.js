const express = require('express');

const Router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);
Router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
