import axios from 'axios';

const parser = new DOMParser();

export const initState = () => ({
  urlInput: {
    valid: 'pending',
    submitEnabled: false,
  },
  feeds: [],
});

export const addFeed = (proxy, url, state) => axios.get(`${proxy}${url}`)
  .then(response => parser.parseFromString(response.data, 'application/xml'))
  .then((rssData) => {
    const title = rssData.querySelector('title').textContent;
    const articles = [];
    const articlesData = rssData.querySelectorAll('item');
    articlesData.forEach((data) => {
      const articleTitle = data.querySelector('title').textContent;
      const articleLink = data.querySelector('link').textContent;
      articles.push({ articleTitle, articleLink });
    });
    state.feeds.push({ url, title, articles });
  })
  .catch(error => console.error(new Error(error)));
