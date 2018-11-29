import { addFeed } from './state';

const CORSproxy = 'https://cors-anywhere.herokuapp.com/';

export default (state) => {
  const input = document.getElementById('rss-url');
  const submit = document.getElementById('submit-button');

  input.addEventListener('input', (e) => {
    state.validate(e.target.value);
  });

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    addFeed(CORSproxy, input.value, state);
  });
};
