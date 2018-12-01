const getInputElement = () => document.getElementById('rss-url');
const getSubmitElement = () => document.getElementById('submit-button');

/* eslint-disable no-param-reassign */
const renderFormActions = {
  valid: (input, submit) => {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.disabled = false;
    submit.disabled = false;
  },
  invalid: (input, submit) => {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.disabled = false;
    submit.disabled = true;
  },
  loading: (input, submit) => {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
    input.disabled = true;
    submit.disabled = true;
  },
  failed: (input, submit) => {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.disabled = false;
    submit.disabled = false;
  },
  pending: (input, submit) => {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
    input.value = '';
    input.disabled = false;
    submit.disabled = true;
  },
};
/* eslint-enable no-param-reassign */

const getRenderFormAction = stateType => renderFormActions[stateType];

export const renderForm = (state) => {
  const stateType = state.input.state;
  const message = document.getElementById('input-message');
  const input = getInputElement();
  const submit = getSubmitElement();
  getRenderFormAction(stateType)(input, submit);
  message.textContent = state.message;
};

export const renderFeedsTitles = (state) => {
  const titlesContainer = document.getElementById('feeds');
  const titlesList = titlesContainer.querySelector('ul');
  const titleTemplate = document.getElementById('feed-template').content;
  titlesList.innerHTML = '';
  const titles = [...state.feedsTitles.values()].reverse();
  titles.forEach((title) => {
    const node = titleTemplate.cloneNode(true);
    const listItem = node.querySelector('li');
    listItem.textContent = title;
    titlesList.appendChild(node);
  });
  if (state.feedsTitles.size > 0) {
    titlesContainer.classList.remove('invisible');
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
    title.textContent = state.articles.get(article.link).content;
    button.dataset.id = article.link;
    articlesList.appendChild(node);
  });
  if (state.articles.size > 0) {
    articlesContainer.classList.remove('invisible');
  }
};

export const renderModal = (state) => {
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-body');
  title.textContent = state.modal.title;
  content.textContent = state.modal.content;
};
