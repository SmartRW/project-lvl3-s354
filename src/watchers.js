import { watch } from 'melanke-watchjs';
import { renderForm, renderTitles, renderArticles } from './renderer';

export default (state) => {
  watch(state.input, () => {
    renderForm(state);
  });

  watch(state.feeds, () => {
    renderTitles(state);
    renderArticles(state);
  });
};
