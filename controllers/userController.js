const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const usersData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
// );
/* eslint-disable no-unused-vars */

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

exports.getAllUsers = factory.getAll(User);

//DO NOT UPDATE PASSWORD WITH THIS
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.update = factory.updateOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});
