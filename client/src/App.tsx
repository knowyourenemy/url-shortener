import { Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './App.module.css';
import { useState } from 'react';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>();

  return (
    <div className={styles.App}>
      <Navbar loggedIn={loggedIn} username={username} />
      <Routes></Routes>
    </div>
  );
};

export default App;
