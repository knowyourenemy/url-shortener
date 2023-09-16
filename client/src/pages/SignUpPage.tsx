import { useState } from 'react';
import styles from './SignUpPage.module.css';
import bcrypt from 'bcrypt';
import { REACT_APP_SERVER_URL } from '../util/config';

interface SignUpProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setLoggedInUsername: (username: string | undefined) => void;
}

const SignUpPage: React.FC<SignUpProps> = ({ setLoggedIn, setLoggedInUsername }) => {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submitForm = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const response = await fetch(`${REACT_APP_SERVER_URL}api/user/`, {
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
          <div className={styles.row}>
            <div className={styles.label}>Confirm Password</div>
            <input
              type="password"
              className={styles.input}
              value={confirmPassword || ''}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default SignUpPage;
