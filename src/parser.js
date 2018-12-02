import { uniqueId } from 'lodash';

export default (data, dataType) => {
  const parser = new DOMParser();
  const rssData = parser.parseFromString(data, dataType);
  if (!rssData.querySelector('channel')) {
    throw new Error('This source contains no RSS-feed');
  }
  const feedTitleData = rssData.querySelector('title');
  const feedTitle = feedTitleData ? feedTitleData.textContent : '';
  const articlesElements = [...rssData.querySelectorAll('item')];
  const articles = articlesElements
    .map((article) => {
      const linkNode = article.querySelector('link');
      const articleTitleNode = article.querySelector('title');
      const contentNode = article.querySelector('description');
      const link = linkNode
        ? linkNode.textContent || uniqueId('#')
        : uniqueId('#');
      const articleTitle = articleTitleNode
        ? articleTitleNode.textContent
        : '';
      const content = contentNode
        ? contentNode.textContent
        : '';
      return { link, articleTitle, content };
    });
  return { feedTitle, articles };
};
