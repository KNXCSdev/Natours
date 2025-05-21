const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.canPostReview = catchAsync(async (req, res, next) => {
  const tourId = req.body.tour || req.params.tourId;
  const userId = req.user.id;

  const existingBooking = await Booking.findOne({ tour: tourId, user: userId });

  if (!existingBooking) {
    return next(
      new AppError('You can only review tours you have booked.', 403),
    );
  }

  next();
});
