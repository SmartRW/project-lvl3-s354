import { watch } from 'melanke-watchjs';
import {
  renderForm,
  renderTitles,
  renderArticles,
  renderModal,
} from './renderer';
import { initArticlesButtonsControllers } from './controllers';

export default (state) => {
  watch(state.input, () => {
    renderForm(state);
  });

  watch(state.feeds, () => {
    renderTitles(state);
    renderArticles(state);
    initArticlesButtonsControllers(state);
  });

  watch(state.modal, () => {
    renderModal(state);
  });
};
