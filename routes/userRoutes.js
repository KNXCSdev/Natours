const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/updateMe').patch(authController.protect, userController.update);

router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

router.route('/').get(authController.protect, userController.getAllUsers);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.update);

module.exports = router;
