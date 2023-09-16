import { useState } from 'react';
import styles from './LoginPage.module.css';

interface LoginProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

const LoginPage: React.FC<LoginProps> = ({ setLoggedIn }) => {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submitForm = () => {
    fetch('http://localhost:8000/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: username, password: password }),
    }).then((res) => {
      if (res.status === 200) {
        setLoggedIn(true);
      } else if (res.status === 400) {
        setError('Incomplete information.');
      } else if (res.status == 404) {
        setError('User not found.');
      } else {
        setError('Something went wrong.');
      }
    });
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
