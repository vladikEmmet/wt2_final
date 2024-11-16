document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('.create-article-form');
    const submitBtn = form.querySelector('.submit-btn');
    const titleInput = form.querySelector('#title');
    const descriptionInput = form.querySelector('#description');
    const imagesInput = form.querySelector('#image-upload');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', titleInput.value);
        formData.append('description', descriptionInput.value);
        if(imagesInput.files.length < 1 || imagesInput.files.length > 3) {
            alert('You must upload between 1 and 3 images.');
            return;
        }
        for (const file of imagesInput.files) {
            formData.append('images', file);
        }

        submitBtn.disabled = true;

        try {
            const response = await fetch('/portfolio', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create portfolio item');
            }

            window.location.href = '/portfolio';
        } catch (error) {
            console.error('Failed to create portfolio item:', error);
            alert('Failed to create portfolio item');
            submitBtn.disabled = false;
        }
    })
});