import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import UrlPage from './pages/UrlPage';
import ManagePage from './pages/ManagePage';
import SignUpPage from './pages/SignUpPage';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>();

  // Try logging in if possible.
  useEffect(() => {
    const tryLogin = async () => {
      try {
        if (!loggedIn) {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/user/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setLoggedIn(true);
            setUsername(data.username);
          }
        }
      } catch (e) {}
    };
    tryLogin();
  }, []);

  return (
    <div className={styles.App}>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      <Routes>
        <Route path="/" element={loggedIn ? <HomePage setLoggedIn={setLoggedIn} /> : <LandingPage />} />
        <Route
          path="login"
          element={
            loggedIn ? <Navigate to="/" /> : <LoginPage setLoggedIn={setLoggedIn} setLoggedInUsername={setUsername} />
          }
        />
        <Route
          path="signup"
          element={
            loggedIn ? <Navigate to="/" /> : <SignUpPage setLoggedIn={setLoggedIn} setLoggedInUsername={setUsername} />
          }
        />
        <Route
          path="manage"
          element={!loggedIn ? <Navigate to="/login" /> : <ManagePage setLoggedIn={setLoggedIn} />}
        />
        <Route path="/:shortenedUrl" element={<UrlPage />} />
      </Routes>
    </div>
  );
};

export default App;
