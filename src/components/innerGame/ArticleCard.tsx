import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { Clock, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, compact = false }) => {
  const { isPremium } = useUser();
  const isPremiumLocked = article.premiumOnly && !isPremium;
  
  if (compact) {
    return (
      <div className={`border rounded-lg overflow-hidden ${isPremiumLocked ? 'border-amber-300' : 'border-gray-200'}`}>
        <div className="flex items-start p-4">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-16 h-16 object-cover rounded mr-4"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center mb-1">
              {isPremiumLocked && (
                <Lock className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
              )}
              <h3 className="font-medium text-gray-900 line-clamp-1">
                {article.title}
              </h3>
            </div>
            <div className="flex items-center text-xs text-gray-500 mb-1.5">
              <Clock className="h-3 w-3 mr-1" />
              <span>{article.readTime} min</span>
              <span className="mx-1.5">•</span>
              <span>{new Date(article.publishDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              {isPremiumLocked ? (
                <span className="text-xs text-amber-600 font-medium">Premium Only</span>
              ) : (
                <Link to={`/inner-game/articles/${article.id}`} className="text-xs text-[var(--color-burgundy)] font-medium flex items-center">
                  Read now <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`border rounded-lg overflow-hidden ${isPremiumLocked ? 'border-amber-300' : 'border-gray-200'}`}>
      {article.imageUrl && (
        <div className="relative h-48">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          {isPremiumLocked && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center">
              <Lock className="h-3 w-3 mr-1" /> Premium
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {article.category.replace('-', ' ')}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{article.readTime} min read</span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 text-lg mb-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.content.substring(0, 120)}...
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xs text-gray-500">
              {new Date(article.publishDate).toLocaleDateString()}
            </div>
          </div>
          {isPremiumLocked ? (
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-100 text-amber-700 flex items-center">
              <Lock className="h-4 w-4 mr-1.5" /> Unlock with Premium
            </button>
          ) : (
            <Link 
              to={`/inner-game/articles/${article.id}`}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-burgundy)] text-white hover:opacity-90"
            >
              Read Article
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
