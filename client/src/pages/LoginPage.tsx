import { useState } from 'react';
import styles from './LoginPage.module.css';
import { REACT_APP_SERVER_URL } from '../util/config';

interface LoginProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setLoggedInUsername: (username: string | undefined) => void;
}

const LoginPage: React.FC<LoginProps> = ({ setLoggedIn, setLoggedInUsername }) => {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submitForm = async () => {
    const response = await fetch(`${REACT_APP_SERVER_URL}api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        setError('Incomplete information.');
      } else if (response.status == 404) {
        setError('User not found.');
      } else {
        setError('Something went wrong.');
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
          <button type="button" onClick={submitForm}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
