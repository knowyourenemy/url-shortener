import { useState } from 'react';
import styles from './HomePage.module.css';
import { REACT_APP_CLIENT_URL } from '../util/config';

interface HomePageProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setLoggedIn }) => {
  const [url, setUrl] = useState<string | undefined>();
  const [shortenedUrl, setShortenedUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submitUrl = async () => {
    if (!url) {
      setError('URL not set.');
      return;
    }

    let modifiedUrl = url;
    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      modifiedUrl = 'http://' + url;
      setUrl(modifiedUrl);
    }

    const response = await fetch('http://localhost:8000/api/url/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ originalUrl: modifiedUrl }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        setError('URL already exists');
      } else if (response.status === 401) {
        setLoggedIn(false);
      } else {
        setError('unknown error');
      }
      return;
    }
    setError(undefined);
    const result = await response.json();
    setShortenedUrl(`${REACT_APP_CLIENT_URL}${result.shortenedUrl}`);
  };

  return (
    <div className={styles.wrapper}>
      {!shortenedUrl ? (
        <>
          <div className={styles.headline}>Shorten a URL now!</div>
          <input className={styles.input} value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" onClick={submitUrl}>
            Submit
          </button>
        </>
      ) : (
        <>
          <div>Original URL: {url}</div>
          <div>
            Shortened URL:{' '}
            <a href={shortenedUrl} target="_blank">
              {shortenedUrl}
            </a>
          </div>
        </>
      )}

      {error && <div>{error}</div>}
    </div>
  );
};

export default HomePage;
