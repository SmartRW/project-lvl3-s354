const getInputElement = () => document.getElementById('rss-url');
const getSubmitElement = () => document.getElementById('submit-button');
const getPopularButtons = () => document.querySelectorAll('.popular-button');

/* eslint-disable no-param-reassign */
const renderFormActions = {
  valid: (input, submit, buttons) => {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.disabled = false;
    submit.disabled = false;
    buttons.forEach((button) => { button.disabled = false; });
  },
  invalid: (input, submit, buttons) => {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.disabled = false;
    submit.disabled = true;
    buttons.forEach((button) => { button.disabled = false; });
  },
  loading: (input, submit, buttons) => {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
    input.disabled = true;
    submit.disabled = true;
    buttons.forEach((button) => { button.disabled = true; });
  },
  failed: (input, submit, buttons) => {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.disabled = false;
    submit.disabled = false;
    buttons.forEach((button) => { button.disabled = false; });
  },
  pending: (input, submit, buttons) => {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
    input.value = '';
    input.disabled = false;
    submit.disabled = true;
    buttons.forEach((button) => { button.disabled = false; });
  },
};
/* eslint-enable no-param-reassign */

const getRenderFormAction = stateType => renderFormActions[stateType];

export const renderForm = (state) => {
  const stateType = state.input.state;
  const message = document.getElementById('input-message');
  const input = getInputElement();
  const submit = getSubmitElement();
  const buttons = getPopularButtons();
  getRenderFormAction(stateType)(input, submit, buttons);
  message.textContent = state.message;
};

export const renderFeedsTitles = (state) => {
  const titlesContainer = document.getElementById('feeds');
  const titlesList = titlesContainer.querySelector('ul');
  const titleTemplate = document.getElementById('feed-template').content;
  titlesList.innerHTML = '';
  const feeds = [...state.feedsTitles.values()].reverse();
  feeds.forEach((feed) => {
    const node = titleTemplate.cloneNode(true);
    const listItem = node.querySelector('.list-group-item h4');
    const articleCounter = node.querySelector('.badge');
    const button = node.querySelector('.unsubscribe');
    button.dataset.id = feed.url;
    listItem.textContent = feed.feedTitle;
    articleCounter.textContent = feed.articlesUrls.length;
    titlesList.appendChild(node);
  });
  if (state.feedsTitles.size > 0) {
    titlesContainer.classList.remove('invisible');
  } else {
    titlesContainer.classList.add('invisible');
  }
};

export const renderArticles = (state) => {
  const articlesContainer = document.getElementById('articles');
  const articlesList = articlesContainer.querySelector('ul');
  const articleTemplate = document.getElementById('article-template').content;
  articlesList.innerHTML = '';
  const articles = [...state.articles.values()].reverse();
  articles.forEach((article) => {
    const node = articleTemplate.cloneNode(true);
    const url = node.querySelector('.article-link');
    const title = node.querySelector('.card-title');
    const button = node.querySelector('button[data-toggle="modal"]');
    url.href = article.link;
    title.textContent = state.articles.get(article.link).articleTitle;
    button.dataset.id = article.link;
    articlesList.appendChild(node);
  });
  if (state.articles.size > 0) {
    articlesContainer.classList.remove('invisible');
  } else {
    articlesContainer.classList.add('invisible');
  }
};

export const renderModal = (state) => {
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-body');
  const fullArticleButton = document.querySelector('.full-article');
  title.textContent = state.modal.title;
  content.innerHTML = state.modal.content;
  fullArticleButton.href = state.modal.url;
};

export const renderPopular = (state) => {
  const container = document.getElementById('popular');
  const template = document.getElementById('popular-button-template').content;
  state.popular.forEach((popularItem) => {
    const node = template.cloneNode(true);
    const button = node.querySelector('.popular-button');
    button.textContent = popularItem.name;
    button.dataset.popularLink = popularItem.url;
    container.appendChild(button);
  });
};
