import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import { initState, addFeed } from './state';
import isUrlValid from './validator';
import { renderForm, renderTitles, renderArticles } from './renderer';

const input = document.getElementById('rss-url');
const submit = document.getElementById('submit-button');
const CORSproxy = 'https://cors-anywhere.herokuapp.com/';
const state = initState();
renderForm(state);

watch(state.urlInput, () => {
  renderForm(state);
});

watch(state.feeds, () => {
  renderTitles(state);
  renderArticles(state);
});

input.addEventListener('input', (e) => {
  state.urlInput.valid = isUrlValid(e.target.value, state);
  state.urlInput.submitEnabled = state.urlInput.valid;
});

submit.addEventListener('click', (e) => {
  e.preventDefault();
  addFeed(CORSproxy, input.value, state)
    .then(() => {
      state.urlInput.valid = 'pending';
      state.urlInput.submitEnabled = false;
    });
});
