import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>();
  return (
    <div className={styles.App}>
      <Navbar loggedIn={loggedIn} username={username} />
      <Routes>
        <Route path="login" element={loggedIn ? <Navigate to="/" /> : <LoginPage setLoggedIn={setLoggedIn} />} />
      </Routes>
    </div>
  );
};

export default App;
