import { REACT_APP_CLIENT_URL } from './config';

export const parseEncodedUrl = (encodedUrl: string): string => {
  return `${REACT_APP_CLIENT_URL}${encodedUrl}`;
};
