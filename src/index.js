import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import { initState } from './state';
import initControllers from './controllers';
import { renderForm, renderTitles, renderArticles } from './renderer';

const state = initState();
renderForm(state);
initControllers(state);

watch(state.input, () => {
  renderForm(state);
});

watch(state.feeds, () => {
  renderTitles(state);
  renderArticles(state);
});
