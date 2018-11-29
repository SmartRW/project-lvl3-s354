import isURL from 'validator/lib/isURL';

export default (url, list) => {
  const urlsList = list
    .reduce((acc, feed) => [...acc, feed.url], []);
  return isURL(url) && !urlsList.includes(url);
};
