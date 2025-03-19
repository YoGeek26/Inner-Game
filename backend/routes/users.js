import express from 'express';

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', (req, res) => {
  res.json({ msg: 'Get all users endpoint' });
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', (req, res) => {
  res.json({ msg: `Get user with ID: ${req.params.id}` });
});

export default router;
