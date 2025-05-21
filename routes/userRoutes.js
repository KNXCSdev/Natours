const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const bookingRouter = require('./../routes/bookingRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:userId/bookings', bookingRouter);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

//USER ROUTES
router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);

router.route('/me').get(userController.getMe, userController.getUser);

router
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
  );

router.route('/deleteMe').delete(userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
