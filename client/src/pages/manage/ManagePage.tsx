import { useEffect, useState } from 'react';
import styles from './ManagePage.module.css';
import { copyUrl, formatDate, parseEncodedUrl } from '../../util/urlUtil';
import IconButton from '../../components/button/IconButton';
import copyIcon from '../../assets/copy.png';
import deleteIcon from '../../assets/delete.svg';
import Button from '../../components/button/Button';

interface IUrl {
  shortenedUrl: string;
  originalUrl: string;
  createdDate: number;
}

interface UrlsRes {
  urls: IUrl[];
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
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/url/`, {
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
        const urls: UrlsRes = await response.json();
        setUrls(urls.urls);
      } catch (e) {
        setError('Something went wrong. Please try again later.');
      }
    };
    fetchData();
  }, [refresh]);

  const deleteUrl = async (url: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/url/${url}`, {
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
        <div className={styles.header}>My Saved URLs</div>
        <div className={styles.error}>{error}</div>
        {urls && (
          <>
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
                        <td>{formatDate(url.createdDate)}</td>
                        <td>{url.originalUrl}</td>
                        <td>{parseEncodedUrl(url.shortenedUrl)}</td>
                        <td>
                          <div className={styles['table-buttons']}>
                            <IconButton
                              onClick={() => copyUrl(parseEncodedUrl(url.shortenedUrl))}
                              image={copyIcon}
                              iconAlt="copy"
                            />
                            <IconButton
                              onClick={() => deleteUrl(url.shortenedUrl)}
                              image={deleteIcon}
                              iconAlt="delete"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className={styles.buttons}>
              <Button navTo="/" text="Add New" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagePage;
