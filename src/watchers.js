import { watch } from 'melanke-watchjs';
import {
  renderForm,
  renderFeedsTitles,
  renderArticles,
  renderModal,
} from './renderers';
import { initOpenModalButtonsControllers, initUnsubscribeButtonsControllers } from './controllers';

export default (state) => {
  watch(state.input, () => {
    renderForm(state);
  });

  watch(state.watcherTriggers, () => {
    renderFeedsTitles(state);
    renderArticles(state);
    initOpenModalButtonsControllers(state);
    initUnsubscribeButtonsControllers(state);
  });

  watch(state.modal, () => {
    renderModal(state);
  });
};
