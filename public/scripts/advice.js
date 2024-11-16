const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

document.addEventListener('DOMContentLoaded', async() => {
    const dateContainer = document.querySelector('.date');
    const dateContent = document.querySelector('.date-content');

    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    dateContainer.textContent = `${months[month-1]}, ${day}`;

    try {
        const dateInfo = await fetch(`/date`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        const json = await dateInfo.json();
        const data = json.date;
        if(!dateInfo.ok) {
            if(dateInfo.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                throw new Error(data.message);
            }
        }

        dateContent.textContent = data;
        const adviceContent = document.querySelector('.advice-content');
        const adviceResponse = await fetch(`/advice/advice`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if(!adviceResponse.ok) {
            if(adviceResponse.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                throw new Error(data.message);
            }
        }

        const advice = await adviceResponse.json();
        adviceContent.textContent = advice.advice;
    } catch(err) {
        console.error(err);
        alert(err);
    }
});