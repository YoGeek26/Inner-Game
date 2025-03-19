import React from 'react';
import { ForumPost } from '../../types';
import { MessageCircle, Heart, CheckCircle, Pin, Calendar, Clock, User, ChevronRight } from 'lucide-react';

interface ForumPostCardProps {
  post: ForumPost;
  onClick?: () => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onClick }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div 
      className="border border-gray-200 rounded-lg hover:border-[var(--color-burgundy)] hover:shadow-sm bg-white transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {post.isPinned && (
                <div className="mr-2 text-[var(--color-burgundy)]">
                  <Pin className="h-4 w-4" />
                </div>
              )}
              
              <h3 className="font-medium text-gray-900">{post.title}</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {post.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center">
                {post.category}
              </div>
              
              {post.tags.map((tag, index) => (
                <div 
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                >
                  #{tag}
                </div>
              ))}
              
              {post.isResolved && (
                <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={post.author.avatar || 'https://via.placeholder.com/40'} 
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-900 mr-1">{post.author.name}</span>
            
            {post.author.level && (
              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full mr-2">
                Lvl {post.author.level}
              </span>
            )}
            
            <span className="text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(post.createdAt)}
            </span>
          </div>
          
          <div className="flex space-x-3 text-gray-500">
            <div className="flex items-center text-sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.replies}
            </div>
            
            <div className="flex items-center text-sm">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </div>
          </div>
        </div>
        
        {post.lastReply && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <div>
              Last reply by <span className="font-medium">{post.lastReply.author.name}</span>
              <span className="mx-1">•</span>
              {formatDate(post.lastReply.createdAt)}
            </div>
            
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPostCard;
