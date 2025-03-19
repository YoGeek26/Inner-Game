import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data - in production this would come from a database
const ARTICLES = [
  {
    id: 'mindset-confidence',
    title: 'Développer une Confiance Inébranlable en Séduction',
    author: 'Alexandre Cormont',
    publishDate: new Date('2023-05-15'),
    category: 'mindset',
    tags: ['confiance', 'psychologie', 'développement personnel'],
    readTime: 12,
    premiumOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80',
    summary: 'La confiance en soi est le fondement de toute réussite en séduction.'
  },
  {
    id: 'pnl-communication',
    title: 'PNL en Séduction : Les patterns de communication qui créent l\'attraction',
    author: 'Julien Raby',
    publishDate: new Date('2023-06-20'),
    category: 'pnl',
    tags: ['pnl', 'communication', 'attraction', 'techniques'],
    readTime: 15,
    premiumOnly: true,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    summary: 'La Programmation Neuro-Linguistique offre des outils puissants pour établir un rapport profond.'
  },
  {
    id: 'neurosciences-attraction',
    title: 'Les Neurosciences de l\'Attraction : Ce qui se passe dans le cerveau quand on séduit',
    author: 'Dr. Marie Laurent',
    publishDate: new Date('2023-07-05'),
    category: 'neurosciences',
    tags: ['neurosciences', 'attraction', 'dopamine', 'science'],
    readTime: 18,
    premiumOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1559757175-7cb05f7e573c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
    summary: 'Les avancées récentes en neurosciences nous permettent de comprendre les mécanismes cérébraux.'
  }
];

// @desc    Get all articles
// @route   GET /api/articles
export const getAllArticles = async (req, res) => {
  try {
    // In a real app, fetch from database
    // For this mock, we'll return the mock data
    
    // Don't send the full content in list view for performance
    const articlesWithoutFullContent = ARTICLES.map(article => {
      const { content, sections, ...rest } = article;
      return rest;
    });
    
    res.json(articlesWithoutFullContent);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get articles by category
// @route   GET /api/articles/category/:category
export const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Filter articles by category
    const filteredArticles = ARTICLES.filter(
      article => article.category === category
    );
    
    // Don't send the full content in list view
    const articlesWithoutFullContent = filteredArticles.map(article => {
      const { content, sections, ...rest } = article;
      return rest;
    });
    
    res.json(articlesWithoutFullContent);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single article
// @route   GET /api/articles/:id
export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the article by ID
    const article = ARTICLES.find(article => article.id === id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // In a real app, we'd fetch the full article content from a database
    // For this mock, we'll load the full content from a static file if available
    
    // Mock full article data (this would normally come from a database)
    const fullArticleData = {
      ...article,
      content: 'Contenu complet de l\'article...',
      sections: [
        {
          id: 'section-1',
          title: 'Introduction',
          content: '<p>Contenu détaillé de la section...</p>'
        },
        {
          id: 'section-2',
          title: 'Approfondissement',
          content: '<p>Contenu détaillé de la section...</p>'
        }
      ]
    };
    
    res.json(fullArticleData);
  } catch (error) {
    console.error(`Error fetching article ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};
