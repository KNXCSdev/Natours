const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

//CALLING THIS IS FOR ROUTES THAT CAN ONLY BE ACCESSED IF LOGGED IN
//IF NOT LOGGED IN, IT WILL REDIRECT TO LOGIN PAGE
router.get('/me', authController.protect, viewsController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

//CALLING isLOGGEDIN  IS FOR ROUTES THAT CAN BE ACCESSED WITHOUT LOGGING IN
//SO BASICALLY THIS WILL CHECK IF THE PAGE NEEDS TO RENDER THE USER PHOTO IF IS LOGGED IN

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours,
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

module.exports = router;
