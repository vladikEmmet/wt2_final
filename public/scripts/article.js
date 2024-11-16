document.addEventListener('DOMContentLoaded', async () => {
    const articleId = window.location.pathname.split('/').pop();
    const articleTitle = document.querySelector('.article-title');
    const articleDescription = document.querySelector('.article-description');
    const articleAuthor = document.querySelector('.article-author');
    const articleCreationDate = document.querySelector('.article-creation-date');
    const articleUpdateDate = document.querySelector('.article-update-date');
    const articleImagesWrapper = document.querySelector('.swiper-wrapper');
    const deleteArticleButton = document.querySelector('.delete-article-btn');

    deleteArticleButton && deleteArticleButton.addEventListener('click',  async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/portfolio/${articleId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }
            window.location.href='/portfolio';
        } catch(err) {
            console.log(err);
            alert(err);
        }
    });

    try {
        const response = await fetch(`/portfolio/articles/${articleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch article data');
        }

        const article = await response.json();

        articleTitle.textContent = article.title;
        articleDescription.textContent = article.description;
        articleAuthor.textContent = `Author: ${article.createdBy?.username || 'Unknown'}`;
        articleCreationDate.textContent = `Published: ${new Date(article.createdAt).toLocaleDateString()}`;
        articleUpdateDate.textContent = `Last update: ${new Date(article.updatedAt).toLocaleDateString()}`;

        // Добавляем изображения в Swiper
        article.images.forEach(image => {
            const swiperSlide = document.createElement('div');
            swiperSlide.classList.add('swiper-slide');
            const imgElement = document.createElement('img');
            imgElement.src = `/${image}`;
            imgElement.alt = article.title;
            swiperSlide.appendChild(imgElement);
            articleImagesWrapper.appendChild(swiperSlide);
        });

        // Инициализируем Swiper
        new Swiper('.swiper-container', {
            loop: true,
            centeredSlides: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    } catch (error) {
        console.error('Error loading article:', error);
        articleTitle.textContent = 'Error loading article';
        articleDescription.textContent = 'Please try again later.';
    }
});
