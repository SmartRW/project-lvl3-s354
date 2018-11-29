import axios from 'axios';
import isUrlValid from './validator';

const parser = new DOMParser();

function State() {
  this.inputStates = {
    pending: 'pending',
    valid: 'valid',
    invalid: 'invalid',
    loading: 'loading',
    failed: 'failed',
  };
  this.input = { state: this.inputStates.pending };
  this.initialMessage = 'Add RSS feed URL';
  this.message = this.initialMessage;
  this.feeds = [];

  this.switchStateTo = (stateName, message = this.initialMessage) => {
    this.message = message;
    this.input.state = this.inputStates[stateName];
  };

  this.validate = (url) => {
    if (!url) {
      this.switchStateTo(this.inputStates.pending);
    } else if (isUrlValid(url, this.feeds)) {
      this.switchStateTo(this.inputStates.valid, 'Ok, let\'s try!');
    } else {
      this.switchStateTo(this.inputStates.invalid, 'Link must be valid URL');
    }
  };
}

export const addFeed = (proxy, url, state) => {
  const promise = new Promise(resolve => resolve(state.switchStateTo(state.inputStates.loading, 'Please wait...')));
  return promise
    .then(() => axios.get(`${proxy}${url}`))
    .then(
      (response) => {
        if (response.headers['content-type'] !== 'application/rss+xml') {
          throw new Error('This source contains no RSS-feed');
        }
        return parser.parseFromString(response.data, 'application/xml');
      },
      () => {
        throw new Error('Server is not responding. It may be dead, as well as your connection');
      },
    )
    .then((rssData) => {
      const title = rssData.querySelector('title').textContent;
      const articles = [];
      const articlesData = rssData.querySelectorAll('item');
      articlesData.forEach((data) => {
        const articleTitle = data.querySelector('title').textContent;
        const articleLink = data.querySelector('link').textContent;
        const articleContent = data.querySelector('description').textContent;
        articles.push({ articleTitle, articleLink, articleContent });
      });
      state.feeds.push({ url, title, articles });
      state.switchStateTo(state.inputStates.pending);
    })
    .catch((error) => {
      state.switchStateTo(state.inputStates.failed, error);
    });
};

export const initState = () => new State();
