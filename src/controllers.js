import axios from 'axios';
import isURL from 'validator/lib/isURL';
import { inputStates } from './state';
import parse from './parser';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const UPDATE_INTERVAL = 5000;

const switchStateTo = (state, stateName, message = 'Add RSS feed URL or choose from those above') => {
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

const loadFeed = (state, url, proxy) => {
  // eslint-disable-next-line no-param-reassign
  state.isBeingUpdated = true;
  return axios.get(`${proxy}${url}`)
    .then((response) => {
      const { feedTitle, articles } = parse(response.data, 'application/xml');
      const articlesUrls = state.feedsTitles.has(url)
        ? state.feedsTitles.get(url).articlesUrls
        : [];
      articles.forEach((article) => {
        const { link } = article;
        if (!state.articles.has(link)
        && !state.unsubscribedWhileUpdating.articles.includes(link)
        && !state.unsubscribedWhileUpdating.feedsTitles.includes(url)) {
          state.articles.set(link, article);
          articlesUrls.push(link);
          state.watcherTriggers.push(url);
        }
      });
      if (!state.unsubscribedWhileUpdating.feedsTitles.includes(url)) {
        state.feedsTitles.set(url, { feedTitle, articlesUrls, url });
      }
      // eslint-disable-next-line no-param-reassign
      state.isBeingUpdated = false;
    });
};

export const initControllers = (state) => {
  const input = document.getElementById('rss-url');
  const form = document.getElementById('form');

  input.addEventListener('input', (e) => {
    const url = e.target.value;
    validateUserData(state, url);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-param-reassign
    switchStateTo(state, inputStates.loading, 'Please wait...');
    // eslint-disable-next-line no-param-reassign
    state.unsubscribedWhileUpdating.articles = [];
    // eslint-disable-next-line no-param-reassign
    state.unsubscribedWhileUpdating.feedsTitles = [];
    const url = input.value;
    loadFeed(state, url, CORS_PROXY)
      .then(() => {
        switchStateTo(state, inputStates.pending);
      })
      .catch((error) => {
        switchStateTo(state, inputStates.failed, error);
      });
  });
};

const reload = (state, proxy, timeout) => {
  const promises = [...state.feedsTitles.keys()].map(url => loadFeed(state, url, proxy));
  window.setTimeout(() => {
    Promise.all(promises)
      .catch(e => console.error(e))
      .then(() => reload(state, proxy, timeout));
  }, timeout);
};

export const initReload = state => reload(state, CORS_PROXY, UPDATE_INTERVAL);

export const initOpenModalButtonsControllers = (state) => {
  const articleButtons = document.querySelectorAll('button[data-toggle="modal"]');
  articleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const url = e.target.dataset.id;
      const article = state.articles.get(url);
      // eslint-disable-next-line no-param-reassign
      state.modal.title = article.articleTitle;
      // eslint-disable-next-line no-param-reassign
      state.modal.content = article.content;
      // eslint-disable-next-line no-param-reassign
      state.modal.url = url;
    });
  });
};

export const initUnsubscribeButtonsControllers = (state) => {
  const unsubscribeButtons = document.querySelectorAll('.unsubscribe');
  unsubscribeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const url = e.target.dataset.id;
      const { articlesUrls } = state.feedsTitles.get(url);
      if (state.isBeingUpdated) {
        state.unsubscribedWhileUpdating.feedsTitles.push(url);
        articlesUrls.forEach((articleUrl) => {
          state.unsubscribedWhileUpdating.articles.push(articleUrl);
        });
      }
      articlesUrls.forEach((articleUrl) => {
        state.articles.delete(articleUrl);
      });
      state.feedsTitles.delete(url);
      state.watcherTriggers.push(url);
    });
  });
};

export const initPopularControllers = (state) => {
  const popularButtons = document.querySelectorAll('.popular-button');
  popularButtons.forEach((popularButton) => {
    popularButton.addEventListener('click', (e) => {
      const url = e.target.dataset.popularLink;
      const input = document.getElementById('rss-url');
      // eslint-disable-next-line no-param-reassign
      input.value = url;
      validateUserData(state, url);
    });
  });
};
