const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

//CALLING THIS IS FOR ROUTES THAT CAN ONLY BE ACCESSED IF LOGGED IN
//IF NOT LOGGED IN, IT WILL REDIRECT TO LOGIN PAGE
router.get('/me', authController.protect, viewsController.getAccount);

//CALLING THIS IS FOR ROUTES THAT CAN BE ACCESSED WITHOUT LOGGING IN
//SO BASICALLY THIS WILL CHECK IF THE PAGE NEEDS TO RENDER THE USER PHOTO IF IS LOGGED IN
router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
