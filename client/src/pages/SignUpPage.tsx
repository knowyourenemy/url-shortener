import { useState } from 'react';
import styles from './SignUpPage.module.css';
import Button from '../components/Button';

interface SignUpProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setLoggedInUsername: (username: string | undefined) => void;
}

interface SignUpReq {
  username: string;
  password: string;
}

const SignUpPage: React.FC<SignUpProps> = ({ setLoggedIn, setLoggedInUsername }) => {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submitForm = async () => {
    try {
      if (!username || !password || !confirmPassword) {
        setError('Please fill out the entire form.');
        return;
      }
      if (username.length < 6) {
        setError('Username must be at least 6 characters long.');
        return;
      }
      if (password.length < 10) {
        setError('Password must be at least 10 characters long.');
        return;
      }
      if (username.length > 128) {
        setError('Username must be at most 128 characters long.');
        return;
      }
      if (password.length > 128) {
        setError('Password must be at most 128 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const signUpRequest: SignUpReq = { username: username, password: password };

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signUpRequest),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError('Username already exists. Please log in instead.');
        } else {
          setError('Something went wrong. Please try again later.');
        }
        return;
      }

      setLoggedIn(true);
      setLoggedInUsername(username);
    } catch (e) {
      setError('Something went wrong. Please try again later.');
    }
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
          <div className={styles.row}>
            <Button text="Submit" onClick={submitForm} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
