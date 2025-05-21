const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(viewsController.alerts);

router.get('/me', authController.protect, viewsController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

//CALLING isLOGGEDIN  IS FOR ROUTES THAT CAN BE ACCESSED WITHOUT LOGGING IN
//SO BASICALLY THIS WILL CHECK IF THE PAGE NEEDS TO RENDER THE USER PHOTO IF IS LOGGED IN

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

module.exports = router;
