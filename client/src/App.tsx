import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import UrlPage from './pages/UrlPage';
import ManagePage from './pages/ManagePage';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>();
  return (
    <div className={styles.App}>
      <Navbar loggedIn={loggedIn} username={username} />
      <Routes>
        <Route path="/" element={loggedIn ? <HomePage /> : <LandingPage />} />
        <Route path="login" element={loggedIn ? <Navigate to="/" /> : <LoginPage setLoggedIn={setLoggedIn} />} />
        <Route path="manage" element={!loggedIn ? <Navigate to="/" /> : <ManagePage />} />
        <Route path="/:shortenedUrl" element={<UrlPage />} />
      </Routes>
    </div>
  );
};

export default App;
