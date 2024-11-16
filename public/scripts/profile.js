document.addEventListener('DOMContentLoaded', async() => {
    const infoContainer = document.querySelector('.profile-info');
    const profileLogoutBtn = document.querySelector('.profile-logout-button').querySelector('button');

    profileLogoutBtn.addEventListener('click', async(e) => {
       localStorage.removeItem('token');
       await fetch('/auth/logout', {
          method: 'POST',
       });
         window.location.replace('/auth/login');
    });

    try {
        const response = await fetch('/profile/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        console.log(data);
        if(!response.ok) {
            throw new Error(data.message);
        }

        const {username, age, gender, email, role, firstName, lastName} = data;
        infoContainer.querySelector('.username').querySelector('p').textContent = username;
        infoContainer.querySelector('.email').querySelector('p').textContent = email;
        infoContainer.querySelector('.age').querySelector('p').textContent = age;
        infoContainer.querySelector('.gender').querySelector('p').textContent = gender;
        infoContainer.querySelector('.role').querySelector('p').textContent = role;
        infoContainer.querySelector('.firstName').querySelector('p').textContent = firstName;
        infoContainer.querySelector('.lastName').querySelector('p').textContent = lastName;
        infoContainer.querySelector('.tfa').querySelector('p').textContent = data.twoFactorAuthEnabled ? "Enabled" : "Disabled";
        if(!data.twoFactorAuthEnabled) {
            const warning = document.createElement('a');
            warning.href = '/auth/tfa';
            warning.textContent = "Enable";
            warning.classList.add('tfa-warning');
            infoContainer.querySelector('.tfa').appendChild(warning);
        }
    } catch(err) {
        console.error(err);
        // localStorage.removeItem('token');
        // window.location.replace('/auth/login');
    }
});