import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import ArticleCard from '../components/innerGame/ArticleCard';
import { BookOpen, Brain, Sparkles, Play, HeartHandshake, Search, Filter } from 'lucide-react';
import { Article, ArticleCategory } from '../types';
import MorningRoutine from '../components/innerGame/MorningRoutine';
import EveningRoutine from '../components/innerGame/EveningRoutine';
import RoutineTracker from '../components/innerGame/RoutineTracker';
import { getArticles, MOCK_ARTICLES } from '../services/userDataService';

const InnerGamePage: React.FC = () => {
  const { user, isPremium } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('articles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [showRoutine, setShowRoutine] = useState<'morning' | 'evening' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Try to get articles from API
        let fetchedArticles;
        try {
          fetchedArticles = await getArticles();
        } catch (error) {
          console.log('Using mock articles instead:', error);
          // Fallback to mock data if API fails
          fetchedArticles = MOCK_ARTICLES;
        }
        
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  // Determine which routine to show based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      // Morning: 5 AM - 12 PM
      setShowRoutine('morning');
    } else if (currentHour >= 19 && currentHour < 23) {
      // Evening: 7 PM - 11 PM
      setShowRoutine('evening');
    } else {
      setShowRoutine(null);
    }
  }, []);
  
  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="luxury-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inner Game & Mindset</h1>
        <p className="text-gray-600">Développez la mentalité, les croyances et le mindset du séducteur</p>
      </div>
      
      {/* Conditional Routine Card */}
      {showRoutine && (
        <div className="luxury-card p-6 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] text-white">
          <div className="flex items-start">
            <div className="bg-white/20 rounded-full p-2 mr-4">
              {showRoutine === 'morning' ? (
                <Sparkles className="h-5 w-5 text-white" />
              ) : (
                <Brain className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-2">
                {showRoutine === 'morning' ? 'Morning Power Routine' : 'Evening Review Routine'}
              </h2>
              <p className="text-white/90 mb-4">
                {showRoutine === 'morning' 
                  ? 'Commencez votre journée avec confiance et énergie. Cette routine de 5 minutes vous préparera au succès social.' 
                  : 'Réfléchissez à votre journée et programmez votre esprit pour progresser pendant votre sommeil.'}
              </p>
              <button 
                onClick={() => setActiveTab(showRoutine === 'morning' ? 'morning' : 'evening')} 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium"
              >
                Commencer la routine {showRoutine === 'morning' ? 'matinale' : 'du soir'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
            activeTab === 'articles'
              ? 'bg-[var(--color-burgundy)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Articles & Théorie
        </button>
        <button
          onClick={() => setActiveTab('mindset')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
            activeTab === 'mindset'
              ? 'bg-[var(--color-burgundy)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Brain className="h-4 w-4 mr-2" />
          Entraînement Mental
        </button>
        <button
          onClick={() => setActiveTab('morning')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
            activeTab === 'morning'
              ? 'bg-[var(--color-burgundy)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Routine Matinale
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
            activeTab === 'evening'
              ? 'bg-[var(--color-burgundy)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          Routine du Soir
        </button>
        <button
          onClick={() => setActiveTab('coaching')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
            activeTab === 'coaching'
              ? 'bg-[var(--color-burgundy)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <HeartHandshake className="h-4 w-4 mr-2" />
          Auto-Coaching
        </button>
      </div>
      
      {/* Content area */}
      {activeTab === 'articles' && (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-4 block w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)]"
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)] appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ArticleCategory | 'all')}
              >
                <option value="all">Toutes les catégories</option>
                <option value="mindset">Mindset</option>
                <option value="psychology">Psychologie</option>
                <option value="techniques">Techniques</option>
                <option value="success-stories">Témoignages</option>
                <option value="science">Science</option>
                <option value="pnl">PNL</option>
                <option value="neurosciences">Neurosciences</option>
              </select>
            </div>
          </div>
          
          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {filteredArticles.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">Aucun article ne correspond à vos critères.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {activeTab === 'morning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MorningRoutine />
          </div>
          <div>
            <RoutineTracker routineType="morning" />
          </div>
        </div>
      )}
      
      {activeTab === 'evening' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EveningRoutine />
          </div>
          <div>
            <RoutineTracker routineType="evening" />
          </div>
        </div>
      )}
      
      {/* Placeholder content for other tabs */}
      {activeTab === 'mindset' && (
        <div className="luxury-card p-6">
          <h2 className="text-xl font-bold mb-4">Entraînement Mental</h2>
          <p className="text-gray-600 mb-4">
            Bientôt disponible ! Cette section contiendra des exercices interactifs pour renforcer votre mentalité,
            incluant des affirmations positives, des techniques de visualisation et de restructuration cognitive.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              Cette section est en cours de développement. Revenez bientôt pour les mises à jour !
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'coaching' && (
        <div className="luxury-card p-6">
          <h2 className="text-xl font-bold mb-4">Outils d'Auto-Coaching</h2>
          <p className="text-gray-600 mb-4">
            Bientôt disponible ! Cette section fournira des exercices d'auto-coaching interactifs,
            incluant l'examen des croyances, la définition d'objectifs et le suivi des progrès.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              Cette section est en cours de développement. Revenez bientôt pour les mises à jour !
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnerGamePage;
