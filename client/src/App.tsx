import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddClothingPage } from './pages/AddClothingPage';
import { BrowsePage } from './pages/BrowsePage';
import { ClothingDetailPage } from './pages/ClothingDetailPage';
import { ChatsPage } from './pages/ChatsPage';
import { ChatDetailPage } from './pages/ChatDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-clothing" element={<AddClothingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/clothing/:id" element={<ClothingDetailPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chat/:chatId" element={<ChatDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
