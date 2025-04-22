const fs = require('fs');

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: toursData.length,
    data: { tours: toursData },
  });
};

exports.getTour = (req, res) => {
  const tour = toursData.find((el) => el.id === Number(req.params.id));

  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursData.push(newTour); //PUSH BECAUSE WE NEED TO PASS IT TO WRITE FILE

  //Now we are overwriting the file so we can have a fresh data /NOTE
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      }); //201 means CREATED
    }
  );
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > toursData.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here...',
    },
  }); //OK WHEN WE UPDATE
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > toursData.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: null,
  }); //204 NO CONTENT WHEN WE DELETE
};
