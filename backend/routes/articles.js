import express from 'express';
import { getAllArticles, getArticle, getArticlesByCategory } from '../controllers/articles.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/articles
// @desc    Get all articles
// @access  Public
router.get('/', getAllArticles);

// @route   GET /api/articles/category/:category
// @desc    Get articles by category
// @access  Public
router.get('/category/:category', getArticlesByCategory);

// @route   GET /api/articles/:id
// @desc    Get a single article
// @access  Public
router.get('/:id', getArticle);

export default router;
