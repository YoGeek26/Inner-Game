import db from '../config/db.js';

// @desc    Get all users
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  // Implementation will go here
  res.json({ msg: 'Get all users' });
};

// @desc    Get a single user
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  // Implementation will go here
  res.json({ msg: `Get user with id ${req.params.id}` });
};
