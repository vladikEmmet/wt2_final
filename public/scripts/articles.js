const shortenDescription = (description, length = 50) => {
    if(description.length <= length) {
        return description;
    }

    return description.slice(0, length) + '...';
}

const createArticleElement = (article) => {
    const articleElement = document.createElement('article');
    articleElement.classList.add('article');

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex-container');

    const imageElement = document.createElement('img');
    imageElement.classList.add('article-image');
    imageElement.src = `/${article.images[0]}`;
    imageElement.alt = article.title;
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    imageContainer.appendChild(imageElement);
    flexContainer.appendChild(imageContainer);

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    const dateElement = document.createElement('p');
    dateElement.classList.add('article-date');
    const date = new Date(article.createdAt);
    dateElement.textContent = date.toLocaleDateString();
    textContainer.appendChild(dateElement);

    const titleElement = document.createElement('h3');
    titleElement.classList.add('article-title');
    titleElement.textContent = article.title;
    textContainer.appendChild(titleElement);

    const descriptionFlex = document.createElement('div');

    const description = document.createElement('p');
    description.classList.add('article-description');
    description.textContent = shortenDescription(article.description);
    descriptionFlex.appendChild(description);

    const readMore = document.createElement('a');
    readMore.classList.add('article-read-more');
    readMore.textContent = 'Read more';
    readMore.href = `/portfolio/${article._id}`;
    descriptionFlex.appendChild(readMore);

    textContainer.appendChild(descriptionFlex);
    flexContainer.appendChild(textContainer);
    articleElement.appendChild(flexContainer);

    return articleElement;
};

const renderArticles = (articles) => {
    const articlesContainer = document.querySelector('.articles');
    articlesContainer.innerHTML = '';

    articles.forEach(article => {
        const articleElement = createArticleElement(article);
        articlesContainer.appendChild(articleElement);
    });
}

const fetchArticles = async() => {
    try {
        const response = await fetch('/portfolio/articles', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        const articles = await response.json();

        if(!response.ok) {
            if(response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                throw new Error(articles.message);
            }
        }

        return articles;
    } catch(err) {
        console.error(err);
        alert(err);
    }
}

const fetchAndRenderArticles = async() => {
    const articles = await fetchArticles();
    renderArticles(articles);
}

document.addEventListener('DOMContentLoaded', async() => {
    await fetchAndRenderArticles();
});