import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Register a user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) throw err;
      
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Create salt & hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const id = uuidv4();
      const now = new Date().toISOString();

      db.run(
        'INSERT INTO users (id, name, email, password, joined_at) VALUES (?, ?, ?, ?, ?)',
        [id, name, email, hashedPassword, now],
        (err) => {
          if (err) throw err;

          jwt.sign(
            { id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              
              res.json({
                token,
                user: {
                  id,
                  name,
                  email
                }
              });
            }
          );
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) throw err;
      
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  // This would typically use middleware to verify JWT
  // For now, just return a placeholder
  res.json({ msg: 'User profile route - will implement auth middleware' });
};
