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
  articlesTitles: new Map(),
  articlesLinks: new Map(),
  articlesDescriptions: new Map(),
  articlesIDs: new Map(),
  modalTitle: { title: '' },
  modalContent: { content: '' },
});
