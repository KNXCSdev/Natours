const express = require('express');
const fs = require('fs');

const port = 3000;

const app = express();

app.use(express.json()); //MIDDLEWARE

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: { tours: toursData },
  });
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);

  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  console.log(newTour);

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
      }); //CREATED
    }
  );
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
