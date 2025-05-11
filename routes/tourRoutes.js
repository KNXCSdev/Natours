const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

//Whenever you see the url like this use reviewRouter
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(authController.protect, tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(authController.protect, tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour); //CHAINING METHODS //(tourController.checkBody <--- Middleware, tourController.createTour) TO CALL THE MIDDLEWARE ONLY IN ONE FUNCTION

router
  .route('/:id')
  .get(authController.protect, tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
