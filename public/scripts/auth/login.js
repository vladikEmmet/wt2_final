const form = document.querySelector('.login-form');
const errorMessage = document.querySelector('.error-message');
const submitBtn = form.querySelector('button[type="submit"]');
const usernameInput = form.querySelector('#username');
const passwordInput = form.querySelector('#password');
const tokenInput = form.querySelector('#token');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMessage.textContent = '';

    submitBtn.disabled = true;

    const username = usernameInput.value;
    const password = passwordInput.value;
    const token = tokenInput.value;

    const data = { username, password, token };

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message);
        }

        localStorage.setItem('token', json.token);
        // Если авторизация успешна, редиректим на главную страницу или нужную вам
        window.location.replace('/'); // или window.location.href = '/';
    } catch (err) {
        // Отображаем сообщение об ошибке, если оно есть
        console.error(err);
        errorMessage.textContent = err.message || 'An unknown error occurred.';
    } finally {
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
    }
});
