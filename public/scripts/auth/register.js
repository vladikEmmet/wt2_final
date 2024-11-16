const form = document.querySelector('.register-form');
const errorMessage = document.querySelector('.error-message');
const submitBtn = form.querySelector('button[type="submit"]');
const passwordMatch = form.querySelector('#password-match');

form.addEventListener('submit', async (e) => {
    errorMessage.textContent = '';
    submitBtn.disabled = true;
    e.preventDefault();
    const data = {};

    for (let input of form.elements) {
        if (input.type !== 'submit' && input.id !== 'password-match') {
            data[input.name] = input.value;
        }
    }

    try {
        if(data.password !== passwordMatch.value) {
            throw new Error('Passwords do not match');
        }
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            const { message } = await response.json();
            throw new Error(message);
        }

        window.location.replace('/auth/login');
    } catch(err) {
        console.error(err);
        errorMessage.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
    }
});