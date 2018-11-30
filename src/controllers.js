import axios from 'axios';
import { uniqueId } from 'lodash';
import isUrlValid from './validator';
import { inputStates } from './state';

const CORSproxy = 'https://cors-anywhere.herokuapp.com/';
const parser = new DOMParser();

const switchStateTo = (state, stateName, message = 'Add RSS feed URL') => {
  state.message = message; // eslint-disable-line no-param-reassign
  state.input.state = inputStates[stateName]; // eslint-disable-line no-param-reassign
};

const validate = (state, url) => {
  if (!url) {
    switchStateTo(state, inputStates.pending);
  } else if (isUrlValid(url, state.feeds)) {
    switchStateTo(state, inputStates.valid, 'Ok, let\'s try!');
  } else {
    switchStateTo(state, inputStates.invalid, 'Link must be valid URL');
  }
};

const rssDataHandler = (rssData, state, url) => {
  if (!rssData.querySelector('rss')) {
    throw new Error('This source contains no RSS-feed');
  }
  const title = rssData.querySelector('title').textContent;
  const articles = [];
  const articlesData = rssData.querySelectorAll('item');
  articlesData.forEach((data) => {
    const articleTitle = data.querySelector('title').textContent;
    const articleLink = data.querySelector('link').textContent;
    const articleContent = data.querySelector('description').textContent;
    articles.push({
      articleTitle, articleLink, articleContent, id: uniqueId('article'),
    });
  });
  state.feeds.push({ url, title, articles });
};

export const addFeed = (proxy, url, state) => new Promise(resolve => resolve(switchStateTo(state, inputStates.loading, 'Please wait...')))
  .then(() => axios.get(`${proxy}${url}`))
  .then(
    response => parser.parseFromString(response.data, 'application/xml'),
    () => {
      throw new Error('Server is not responding. It may be dead, as well as your connection');
    },
  )
  .then((rssData) => {
    rssDataHandler(rssData, state, url);
    switchStateTo(state, inputStates.pending);
  })
  .catch((error) => {
    switchStateTo(state, inputStates.failed, error);
  });

export const initControllers = (state) => {
  const input = document.getElementById('rss-url');
  const submit = document.getElementById('submit-button');

  input.addEventListener('input', (e) => {
    validate(state, e.target.value);
  });

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    addFeed(CORSproxy, input.value, state);
  });
};

export const initArticlesButtonsControllers = (state) => {
  const articleButtons = document.querySelectorAll('button[data-toggle="modal"]');
  articleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.dir(e.target);
      const articleId = e.target.dataset.id;
      const article = state.feeds
        .reduce((acc, feed) => [...acc, ...feed.articles], [])
        .filter(item => item.id === articleId)[0];
      state.modal.title = article.articleTitle; // eslint-disable-line no-param-reassign
      state.modal.content = article.articleContent; // eslint-disable-line no-param-reassign
    });
  });
};
