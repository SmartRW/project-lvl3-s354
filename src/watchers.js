import { watch } from 'melanke-watchjs';
import {
  renderForm,
  renderFeedsTitles,
  renderArticles,
  renderModal,
} from './renderer';
import { initArticlesButtonsControllers } from './controllers';

export default (state) => {
  watch(state.input, () => {
    renderForm(state);
  });

  watch(state.watcherTriggers, () => {
    renderFeedsTitles(state);
    renderArticles(state);
    initArticlesButtonsControllers(state);
    console.dir(state);
  });

  watch(state.modalTitle, () => {
    renderModal(state);
  });
};
