const getRenderFormAction = () => {
  const input = document.getElementById('rss-url');
  const submit = document.getElementById('submit-button');
  return {
    valid: () => {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.disabled = false;
      submit.disabled = false;
    },
    invalid: () => {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.disabled = false;
      submit.disabled = true;
    },
    loading: () => {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
      input.disabled = true;
      submit.disabled = true;
    },
    failed: () => {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.disabled = false;
      submit.disabled = false;
    },
    pending: () => {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
      input.value = '';
      input.disabled = false;
      submit.disabled = true;
    },
  };
};

export const renderForm = (state) => {
  const stateType = state.input.state;
  const message = document.getElementById('input-message');
  getRenderFormAction()[stateType]();
  message.textContent = state.message;
};

export const renderTitles = (state) => {
  const titlesContainer = document.getElementById('feeds');
  const titlesList = titlesContainer.querySelector('ul');
  const titleTemplate = document.getElementById('feed-template').content;
  titlesList.innerHTML = '';
  const titles = state.feeds
    .reduce((acc, feed) => [...acc, feed.title], []);
  titles.forEach((title) => {
    const node = titleTemplate.cloneNode(true);
    const listItem = node.querySelector('li');
    listItem.textContent = title;
    titlesList.appendChild(node);
  });
  if (state.feeds.length > 0) {
    titlesContainer.classList.remove('invisible');
  }
};

export const renderArticles = (state) => {
  const articlesContainer = document.getElementById('articles');
  const articlesList = articlesContainer.querySelector('ul');
  const articleTemplate = document.getElementById('article-template').content;
  articlesList.innerHTML = '';
  const articles = state.feeds
    .reduce((acc, feed) => [...acc, ...feed.articles], []);
  articles.forEach((article) => {
    const node = articleTemplate.cloneNode(true);
    const link = node.getElementById('article-link');
    const text = node.querySelector('.card-title');
    text.textContent = article.articleTitle;
    link.href = article.articleLink;
    articlesList.appendChild(node);
  });
  if (state.feeds.length > 0) {
    articlesContainer.classList.remove('invisible');
  }
};
