import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UrlPage: React.FC = () => {
  const { shortenedUrl } = useParams();
  useEffect(() => {
    window.location.replace(`${process.env.REACT_APP_SERVER_URL}api/url/${shortenedUrl}`);
  }, []);
  return null;
};

export default UrlPage;
