const Tour = require('./../models/tourModel');

/* eslint-disable no-undef */
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Missing name or price' }); //400 BAD REQUEST
//   }

//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: tours,
    });
  } catch {
    res.status(400).json({
      status: 'fail',
      message: 'Tours were not found!',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch {
    res.status(404).json({
      status: 'fail',
      message: 'Tour with the specific id was not found!',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    }); //OK WHEN WE UPDATE
  } catch {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    }); //204 NO CONTENT WHEN WE DELETE
  } catch {
    res.status(400).json({
      status: 'fail',
      message: 'Tour with the specific id was not found!',
    });
  }
};
