const input = document.getElementById('rss-url');
const submit = document.getElementById('submit-button');
const titlesContainer = document.getElementById('feeds');
const titlesList = titlesContainer.querySelector('ul');
const articlesContainer = document.getElementById('articles');
const articlesList = articlesContainer.querySelector('ul');
const titleTemplate = document.getElementById('feed-template').content;
const articleTemplate = document.getElementById('article-template').content;

const renderForm = (state) => {
  switch (state.urlInput.valid) {
    case true:
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      break;
    case false:
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      break;
    default:
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
      input.value = '';
      break;
  }
  switch (state.urlInput.submitEnabled) {
    case true:
      submit.disabled = false;
      break;
    case false:
      submit.disabled = true;
      break;
    default:
      submit.disabled = false;
  }
};

const renderTitles = (state) => {
  titlesList.innerHTML = '';
  const titles = state.feeds
    .reduce((acc, feed) => [...acc, feed.title], []);
  titles.forEach((title) => {
    const node = titleTemplate.cloneNode(true);
    const listItem = node.querySelector('li');
    listItem.textContent = title;
    titlesList.appendChild(node);
  });
};

const renderArticles = (state) => {
  articlesList.innerHTML = '';
  const articles = state.feeds
    .reduce((acc, feed) => [...acc, ...feed.articles], []);
  articles.forEach((article) => {
    const node = articleTemplate.cloneNode(true);
    const link = node.querySelector('a');
    link.textContent = article.articleTitle;
    link.href = article.articleLink;
    articlesList.appendChild(node);
  });
};

export default (state) => {
  renderForm(state);
  renderTitles(state);
  renderArticles(state);
  if (state.feeds.length > 0) {
    titlesContainer.classList.remove('invisible');
    articlesContainer.classList.remove('invisible');
  }
};
