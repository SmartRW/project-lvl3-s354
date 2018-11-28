import isURL from 'validator/lib/isURL';

export default (url, state) => {
  const urlsList = state.feeds
    .reduce((acc, feed) => [...acc, feed.url], []);
  return isURL(url) && !urlsList.includes(url);
};
