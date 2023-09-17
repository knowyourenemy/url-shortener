import { useState } from 'react';
import styles from './LoginPage.module.css';
import { REACT_APP_SERVER_URL } from '../util/config';
import Button from '../components/Button';

interface LoginProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setLoggedInUsername: (username: string | undefined) => void;
}

const LoginPage: React.FC<LoginProps> = ({ setLoggedIn, setLoggedInUsername }) => {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submitForm = async () => {
    if (!username || !password) {
      setError('Please fill out the entire form.');
      return;
    }

    const response = await fetch(`${REACT_APP_SERVER_URL}api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        setError('Please fill out the entire form.');
      } else if (response.status == 404) {
        setError('User not found. Please ensure the username and password is correct.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      return;
    }

    setLoggedIn(true);
    setLoggedInUsername(username);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}
        <form>
          <div className={styles.row}>
            <div className={styles.label}>Username</div>
            <input className={styles.input} value={username || ''} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Password</div>
            <input
              type="password"
              className={styles.input}
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <Button text="Submit" onClick={submitForm} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
