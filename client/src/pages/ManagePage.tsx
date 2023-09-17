import { useEffect, useState } from 'react';
import styles from './ManagePage.module.css';
import { REACT_APP_SERVER_URL } from '../util/config';
import { copyUrl, formatDate, parseEncodedUrl } from '../util/urlUtil';
import IconButton from '../components/IconButton';
import copyIcon from '../assets/copy.png';
import deleteIcon from '../assets/delete.svg';

interface IUrl {
  shortenedUrl: string;
  originalUrl: string;
}

interface ManagePageProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

const ManagePage: React.FC<ManagePageProps> = ({ setLoggedIn }) => {
  const [urls, setUrls] = useState<IUrl[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${REACT_APP_SERVER_URL}api/url/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            setLoggedIn(false);
          } else {
            setError('Something went wrong. Please try again later.');
          }
          return;
        }
        setError(undefined);
        const result = await response.json();
        setUrls(result.urls);
      } catch (e) {
        setError('Something went wrong. Please try again later.');
      }
    };
    fetchData();
  }, [refresh]);

  const deleteUrl = async (url: string): Promise<void> => {
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}api/url/${url}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLoggedIn(false);
        } else {
          setError('Could not delete URL. Please try again later.');
        }
        return;
      }

      setError(undefined);
      setRefresh(!refresh);
    } catch (e) {
      setError('Could not delete URL. Please try again later.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.error}>{error}</div>
        {urls && (
          <div className={styles['table-container']}>
            <table className={styles.table}>
              <thead>
                <tr className={styles['table-header']}>
                  <th>Date Created</th>
                  <th>Original URL</th>
                  <th>Shortened URL</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{formatDate(1694992263000)}</td>
                      <td>{url.originalUrl}</td>
                      <td>{parseEncodedUrl(url.shortenedUrl)}</td>
                      <td>
                        <div className={styles.buttons}>
                          <IconButton onClick={() => copyUrl(parseEncodedUrl(url.shortenedUrl))} image={copyIcon} />
                          <IconButton onClick={() => deleteUrl(url.shortenedUrl)} image={deleteIcon} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePage;
