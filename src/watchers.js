import { watch } from 'melanke-watchjs';
import {
  renderForm,
  renderFeedsTitles,
  renderArticles,
  renderModal,
} from './renderers';
import { initArticlesButtonsControllers } from './controllers';

export default (state) => {
  watch(state.input, () => {
    renderForm(state);
  });

  watch(state.watcherTriggers, () => {
    renderFeedsTitles(state);
    renderArticles(state);
    initArticlesButtonsControllers(state);
  });

  watch(state.modal, () => {
    renderModal(state);
  });
};
