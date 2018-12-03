export const inputStates = {
  pending: 'pending',
  valid: 'valid',
  invalid: 'invalid',
  loading: 'loading',
  failed: 'failed',
};

export const initState = () => ({
  input: { state: inputStates.pending },
  message: 'Add RSS feed URL',
  watcherTriggers: [],
  feedsTitles: new Map(),
  articles: new Map(),
  modal: {
    title: '',
    content: '',
  },
  isBeingUpdated: false,
  unsubscribedWhileUpdating: {
    feedsTitles: [],
    articles: [],
  },
});
