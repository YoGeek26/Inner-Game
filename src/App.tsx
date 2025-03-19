import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { AIContextProvider } from './context/AIContext';
import { AdminProvider } from './context/AdminContext';

// Main pages
import HomePage from './pages/HomePage';
import InnerGamePage from './pages/InnerGamePage';
import PlayPage from './pages/PlayPage';
import ChallengesPage from './pages/ChallengesPage';
import AiCoachPage from './pages/AiCoachPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import ArticleDetailPage from './pages/ArticleDetailPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminChallenges from './pages/admin/AdminChallenges';
import AdminContent from './pages/admin/AdminContent';
import AdminStatistics from './pages/admin/AdminStatistics';

// Layout
import Layout from './components/common/Layout';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <UserProvider>
      <AIContextProvider>
        <AdminProvider>
          <Routes>
            {/* Main app routes with shared layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/inner-game" element={<InnerGamePage />} />
              <Route path="/inner-game/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/ai-coach" element={<AiCoachPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin routes with admin layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="challenges" element={<AdminChallenges />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="statistics" element={<AdminStatistics />} />
            </Route>
            
            {/* Admin login page (no layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Redirect for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminProvider>
      </AIContextProvider>
    </UserProvider>
  );
}

export default App;
