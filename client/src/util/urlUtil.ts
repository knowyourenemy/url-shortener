import { REACT_APP_CLIENT_URL } from './config';

export const parseEncodedUrl = (encodedUrl: string): string => {
  return `${REACT_APP_CLIENT_URL}${encodedUrl}`;
};

export const copyUrl = async (url: string): Promise<void> => {
  await navigator.clipboard.writeText(url);
};

export const formatUrl = (url: string): string => {
  let modifiedUrl = url;
  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
    modifiedUrl = 'http://' + url;
  }
  return modifiedUrl;
};
