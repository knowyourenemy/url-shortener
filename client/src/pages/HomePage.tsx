import { useState } from 'react';
import styles from './HomePage.module.css';
import { copyUrl, formatUrl, parseEncodedUrl } from '../util/urlUtil';
import Button from '../components/Button';

interface HomePageProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

interface SubmitUrlReq {
  originalUrl: string;
}

interface SubmitUrlRes {
  shortenedUrl: string;
}

const HomePage: React.FC<HomePageProps> = ({ setLoggedIn }) => {
  const [url, setUrl] = useState<string | undefined>();
  const [shortenedUrl, setShortenedUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const clearUrl = () => {
    setUrl(undefined);
    setShortenedUrl(undefined);
  };
  const submitUrl = async () => {
    try {
      if (!url) {
        setError('Please input a URL to shorten.');
        return;
      }

      const modifiedUrl = formatUrl(url);
      setUrl(modifiedUrl);

      const submitUrlRequest: SubmitUrlReq = {
        originalUrl: modifiedUrl,
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/url/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitUrlRequest),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError('URL already exists. Please shorten another URL.');
        } else if (response.status === 401) {
          setLoggedIn(false);
        } else {
          setError('Something went wrong. Please try again later.');
        }
        return;
      }
      setError(undefined);
      const submitResult: SubmitUrlRes = await response.json();
      setShortenedUrl(parseEncodedUrl(submitResult.shortenedUrl));
    } catch (e) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}
        {!shortenedUrl ? (
          <>
            <div className={styles.header}>Enter your long URL here:</div>
            <input className={styles.input} value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button text="Shorten URL" onClick={submitUrl} />
          </>
        ) : (
          <>
            <div className={styles.row}>
              <div className={styles.label}>Long URL:</div>
              <input className={styles.input} value={url} disabled={true} />
            </div>
            <div className={styles.row}>
              <div className={styles.label}>Short URL:</div>
              <input className={styles.input} value={shortenedUrl} disabled={true} />
            </div>
            <div className={styles.buttons}>
              <Button onClick={() => copyUrl(shortenedUrl)} text="Copy" />
              <Button navTo="/manage" text="Manage URLs" />
              <Button onClick={clearUrl} text="Shorten Another" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
