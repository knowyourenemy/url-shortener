import { useEffect, useState } from 'react';
import styles from './ManagePage.module.css';
import { useNavigate } from 'react-router-dom';
import { REACT_APP_SERVER_URL } from '../util/config';
import { copyUrl, parseEncodedUrl } from '../util/urlUtil';

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

  //   const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${REACT_APP_SERVER_URL}api/url/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError('URL already exists');
        } else if (response.status === 401) {
          //   setError('Session expired');
          setLoggedIn(false);
          //   navigate('/login');
        } else {
          setError('unknown error');
        }
        return;
      }
      setError(undefined);
      const result = await response.json();
      setUrls(result.urls);
    };
    fetchData();
  }, [refresh]);

  const deleteUrl = async (url: string): Promise<void> => {
    const response = await fetch(`${REACT_APP_SERVER_URL}api/url/${url}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 400) {
        setError('URL already exists');
      } else if (response.status === 401) {
        setError('Session expired');
      } else {
        setError('unknown error');
      }
      return;
    }

    setError(undefined);
    setRefresh(!refresh);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Your URLs</div>
      <div className={styles.error}>{error}</div>
      <table>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Shortened URL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {urls &&
            urls.map((url, idx) => {
              return (
                <tr key={idx}>
                  <td>{url.originalUrl}</td>
                  <td>{parseEncodedUrl(url.shortenedUrl)}</td>
                  <td>
                    <button onClick={() => copyUrl(url.shortenedUrl)}>Copy</button>
                    <button onClick={() => deleteUrl(url.shortenedUrl)}>Delete</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePage;
