import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { REACT_APP_SERVER_URL } from '../util/config';

const UrlPage: React.FC = () => {
  const { shortenedUrl } = useParams();
  useEffect(() => {
    window.location.replace(`${REACT_APP_SERVER_URL}api/url/${shortenedUrl}`);
  }, []);
  return null;
};

export default UrlPage;
