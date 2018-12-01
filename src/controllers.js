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

const getFeedData = (rssData) => {
  const feedTitle = rssData.querySelector('title').textContent;
  const articlesElements = [...rssData.querySelectorAll('item')];
  const articles = articlesElements
    .map((article) => {
      const link = article.querySelector('link').textContent || uniqueId('#');
      const articleTitle = article.querySelector('title').textContent;
      const content = article.querySelector('description').textContent;
      const articleId = uniqueId('article-');
      return {
        link, articleTitle, content, articleId,
      };
    });
  return { feedTitle, articles };
};

const addNewFeed = (state, url, proxy) => axios.get(`${proxy}${url}`)
  .then((response) => {
    const rss = parse(response.data, 'application/xml');
    if (!rss.querySelector('channel')) {
      throw new Error('This source contains no RSS-feed');
    }
    const { feedTitle, articles } = getFeedData(rss);
    articles.forEach((article) => {
      const {
        link, articleTitle, content, articleId,
      } = article;
      if (!state.articlesLinks.has(link)) {
        state.articlesTitles.set(link, articleTitle);
        state.articlesDescriptions.set(link, content);
        state.articlesIDs.set(link, articleId);
        state.articlesLinks.set(articleId, link);
        state.watcherTriggers.push(link);
      }
    });
    if (!state.articlesLinks.has(url)) {
      state.feedsTitles.set(url, feedTitle);
    }
  });

export const initControllers = (state) => {
  const input = document.getElementById('rss-url');
  const submit = document.getElementById('submit-button');

  input.addEventListener('input', (e) => {
    const url = e.target.value;
    validateUserData(state, url);
  });

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    switchStateTo(state, inputStates.loading, 'Please wait...');
    const url = input.value;
    addNewFeed(state, url, CORS_PROXY)
      .catch((error) => {
        switchStateTo(state, inputStates.failed, error);
      });
    switchStateTo(state, inputStates.pending);
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
