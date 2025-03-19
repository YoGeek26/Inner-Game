import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Share, ThumbsUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Article } from '../types';
import { saveArticle, unsaveArticle, getArticleById } from '../services/userDataService';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isPremium, updateUser } = useUser();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const fetchedArticle = await getArticleById(id);
        setArticle(fetchedArticle);
        
        // Check if article is saved by user
        if (user?.savedArticles) {
          setIsSaved(user.savedArticles.includes(id));
        }
      } catch (err) {
        setError('Failed to load article. Please try again later.');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, user?.savedArticles]);
  
  const handleSaveArticle = async () => {
    if (!user || !article) return;
    
    try {
      if (isSaved) {
        await unsaveArticle(article.id);
        setIsSaved(false);
      } else {
        await saveArticle(article.id);
        setIsSaved(true);
      }
      
      // Update user context to reflect changes
      if (user.savedArticles) {
        const updatedSavedArticles = isSaved
          ? user.savedArticles.filter(articleId => articleId !== article.id)
          : [...user.savedArticles, article.id];
        
        updateUser({
          ...user,
          savedArticles: updatedSavedArticles
        });
      }
    } catch (err) {
      console.error('Error saving article:', err);
    }
  };
  
  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.summary || `Check out this article: ${article.title}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-burgundy)]"></div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {error || "Article not found"}
        </h2>
        <Link to="/inner-game" className="text-[var(--color-burgundy)] hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inner Game
        </Link>
      </div>
    );
  }
  
  // Check if premium content is accessible
  const isPremiumLocked = article.premiumOnly && !isPremium;
  
  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Navigation back */}
      <div className="py-4">
        <Link to="/inner-game" className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inner Game
        </Link>
      </div>
      
      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
            {article.category.replace('-', ' ')}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{article.readTime} min read</span>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span>By {article.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(article.publishDate).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={handleSaveArticle}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-[var(--color-burgundy)]"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-1.5 text-[var(--color-burgundy)]" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-1.5" />
                Save
              </>
            )}
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-[var(--color-burgundy)]"
          >
            <Share className="h-4 w-4 mr-1.5" />
            Share
          </button>
          <button className="flex items-center text-sm font-medium text-gray-700 hover:text-[var(--color-burgundy)]">
            <ThumbsUp className="h-4 w-4 mr-1.5" />
            Like
          </button>
        </div>
        
        {/* Featured image */}
        {article.imageUrl && (
          <div className="relative rounded-xl overflow-hidden mb-8 bg-gray-100">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Premium content lock */}
      {isPremiumLocked ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-amber-800 mb-3">
            Premium Content
          </h3>
          <p className="text-amber-700 mb-4">
            This article is available exclusively to premium members. 
            Upgrade your account to access this and all other premium content.
          </p>
          <button className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700">
            Upgrade to Premium
          </button>
        </div>
      ) : (
        // Article content
        <>
          {/* Summary */}
          {article.summary && (
            <div className="bg-gray-50 border-l-4 border-[var(--color-burgundy)] p-5 mb-8 rounded-r-lg">
              <p className="italic text-gray-700">{article.summary}</p>
            </div>
          )}
          
          {/* Article sections */}
          {article.sections ? (
            <div className="prose prose-lg max-w-none">
              {article.sections.map((section, index) => (
                <div key={section.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  {section.imageUrl && (
                    <img 
                      src={section.imageUrl} 
                      alt={section.title} 
                      className="rounded-lg mb-4 w-full"
                    />
                  )}
                  <div 
                    className="text-gray-700" 
                    dangerouslySetInnerHTML={{ __html: section.content }} 
                  />
                </div>
              ))}
            </div>
          ) : (
            // Fallback to regular content if no sections
            <div className="prose prose-lg max-w-none text-gray-700" 
                 dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Related topics:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Related articles placeholder */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">You may also like</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">Related articles coming soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleDetailPage;
