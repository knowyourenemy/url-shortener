import { useEffect, useState } from 'react';
import styles from './ManagePage.module.css';

interface IUrl {
  shortenedUrl: string;
  originalUrl: string;
}

const ManagePage: React.FC = () => {
  const [urls, setUrls] = useState<IUrl[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/api/url/', {
        method: 'GET',
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
      const result = await response.json();
      setUrls(result.urls);
    };
    fetchData();
  }, [refresh]);

  const copyUrl = (url: string): void => {
    navigator.clipboard.writeText(url);
  };

  const deleteUrl = async (url: string): Promise<void> => {
    const response = await fetch(`http://localhost:8000/api/url/${url}`, {
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
                  <td>{url.shortenedUrl}</td>
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
