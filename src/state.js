export const inputStates = {
  pending: 'pending',
  valid: 'valid',
  invalid: 'invalid',
  loading: 'loading',
  failed: 'failed',
};

const POPULAR = [
  {
    name: 'Cars',
    url: 'https://motor.ru/exports/rss',
  },
  {
    name: 'Soccer',
    url: 'http://www.sports.ru/rss/rubric.xml?s=208',
  },
  {
    name: 'Devices',
    url: 'https://mobidevices.ru/news/feed',
  },
  {
    name: 'Test',
    url: 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=30',
  },
];

export const initState = () => ({
  input: { state: inputStates.pending },
  message: 'Add RSS feed URL or choose from those above',
  watcherTriggers: [],
  feedsTitles: new Map(),
  articles: new Map(),
  modal: {
    title: '',
    content: '',
    url: '',
  },
  isBeingUpdated: false,
  unsubscribedWhileUpdating: {
    feedsTitles: [],
    articles: [],
  },
  popular: POPULAR,
});
