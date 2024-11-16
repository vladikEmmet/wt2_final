document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('.create-article-form');
    const submitBtn = form.querySelector('.submit-btn');
    const titleInput = form.querySelector('#title');
    const descriptionInput = form.querySelector('#description');
    const imagesInput = form.querySelector('#image-upload');
    const articleId = window.location.pathname.split('/').pop();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('submit');

        const formData = new FormData();
        formData.append('title', titleInput.value);
        formData.append('description', descriptionInput.value);
        if(imagesInput.files.length) {
            for (const file of imagesInput.files) {
                formData.append('images', file);
            }
        }

        submitBtn.disabled = true;

        try {
            const response = await fetch(`/portfolio/${articleId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update portfolio item');
            }

            const data = await response.json();
            console.log(data);

            window.location.href = `/portfolio/${articleId}`;
        } catch (error) {
            console.error('Failed to update portfolio item:', error);
            alert('Failed to create portfolio item');
            submitBtn.disabled = false;
        }
    });
});