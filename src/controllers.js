import axios from 'axios';
import { uniqueId } from 'lodash';
import isURL from 'validator/lib/isURL';
import { inputStates } from './state';
import parse from './parser';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

const switchStateTo = (state, stateName, message = 'Add RSS feed URL') => {
  state.message = message; // eslint-disable-line no-param-reassign
  state.input.state = inputStates[stateName]; // eslint-disable-line no-param-reassign
};

const validateUserData = (state, data) => {
  if (!data) {
    switchStateTo(state, inputStates.pending);
  } else if (!isURL(data)) {
    switchStateTo(state, inputStates.invalid, 'Link must be valid URL');
  } else if (state.feedsTitles.has(data)) {
    switchStateTo(state, inputStates.invalid, 'You are already subscribed to this feed');
  } else {
    switchStateTo(state, inputStates.valid, 'Ok, let\'s try!');
  }
};

const addFeedTitle = (state, rssData, url) => {
  if (!rssData.querySelector('channel')) {
    throw new Error('This source contains no RSS-feed');
  }
  const title = rssData.querySelector('title').textContent;
  state.feedsTitles.set(url, title);
};

const addArticles = (state, rssData) => {
  const articles = rssData.querySelectorAll('item');
  articles.forEach((data) => {
    const title = data.querySelector('title').textContent;
    const link = data.querySelector('link').textContent || uniqueId('#');
    const content = data.querySelector('description').textContent;
    state.articlesTitles.set(link, title);
    state.articlesDescriptions.set(link, content);
    const articleId = uniqueId('article-');
    state.articlesIDs.set(link, articleId);
    state.articlesLinks.set(articleId, link);
    state.watcherTriggers.push(link);
  });
};

const addNewFeed = (state, url, proxy) => {
  switchStateTo(state, inputStates.loading, 'Please wait...');
  return axios.get(`${proxy}${url}`)
    .then((response) => {
      const rss = parse(response.data, 'application/xml');
      addFeedTitle(state, rss, url);
      addArticles(state, rss);
      switchStateTo(state, inputStates.pending);
    })
    .catch((error) => {
      switchStateTo(state, inputStates.failed, error);
    });
};

export const initControllers = (state) => {
  const input = document.getElementById('rss-url');
  const submit = document.getElementById('submit-button');

  input.addEventListener('input', (e) => {
    const url = e.target.value;
    validateUserData(state, url);
  });

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const url = input.value;
    addNewFeed(state, url, CORS_PROXY);
  });
};

export const initArticlesButtonsControllers = (state) => {
  const articleButtons = document.querySelectorAll('button[data-toggle="modal"]');
  articleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = e.target.dataset.id;
      const articleLink = state.articlesLinks.get(articleId);
      // eslint-disable-next-line no-param-reassign
      state.modalTitle.title = state.articlesTitles.get(articleLink);
      // eslint-disable-next-line no-param-reassign
      state.modalContent.content = state.articlesDescriptions.get(articleLink);
    });
  });
};
