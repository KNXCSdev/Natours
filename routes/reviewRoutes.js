const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//BY DEFAULT EACH ROUTER ONLY HAS ACCESS TO THEIR SPECIFIC ROUTES IN OORDER TO GET ACCESS WE NEED TO MERGE PARAMETER
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.createReview,
  );

module.exports = router;
