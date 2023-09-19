import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UrlPage: React.FC = () => {
  const { shortenedUrl } = useParams();
  // Redirect to the backend, which will return a 301 redirect to the shortened URL.
  useEffect(() => {
    window.location.replace(`${process.env.REACT_APP_SERVER_URL}api/url/${shortenedUrl}`);
  }, [shortenedUrl]);
  return null;
};

export default UrlPage;
