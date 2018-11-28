import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import initState from './state';
import render from './renderer';

const input = document.getElementById('rss-url');
const submit = document.getElementById('submit-button');
const feedsList = document.getElementById('feeds');
const articlesList = document.getElementById('articles');
const feedTemplate = document.getElementById('feed-template').content;
const articleTemplate = document.getElementById('article-template').content;
const feeds = [];
const CORSproxy = 'https://cors-anywhere.herokuapp.com/';
const parser = new DOMParser();

const isUrlValid = (url, listOfUrls) => (isURL(url) && !listOfUrls.includes(url));

const state = initState();
render(state);

watch(state, () => {
  render(state);
});

const addFeed = (proxy, url) => {
  axios.get(`${proxy}${url}`)
    .then(response => parser.parseFromString(response.data, 'application/xml'))
    .then((rssData) => {
      const title = rssData.querySelector('title').textContent;
      const feed = feedTemplate.cloneNode(true).querySelector('li');
      feed.textContent = title;
      feedsList.appendChild(feed);

      const articlesData = rssData.querySelectorAll('item');
      articlesData.forEach((data) => {
        const titleText = data.querySelector('title').textContent;
        const linkText = data.querySelector('link').textContent;
        const article = articleTemplate.cloneNode(true);
        const articleLink = article.querySelector('a');
        articleLink.textContent = titleText;
        articleLink.href = linkText;
        articlesList.appendChild(article);
      });
      if (feeds.length === 0) {
        feedsList.classList.remove('invisible');
        articlesList.classList.remove('invisible');
      }
      feeds.push(url);
    })
    .catch(error => console.error(new Error(error)));
};

input.addEventListener('input', (e) => {
  state.urlInput.valid = isUrlValid(e.target.value, feeds);
  state.urlInput.submitEnabled = state.urlInput.valid;
});

submit.addEventListener('click', (e) => {
  e.preventDefault();
  addFeed(CORSproxy, input.value);
  state.urlInput.valid = 'pending';
  state.urlInput.submitEnabled = false;
});
