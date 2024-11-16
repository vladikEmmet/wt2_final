document.addEventListener('DOMContentLoaded', async () => {
   const qrContainer = document.querySelector('.qr');
   const tfaForm = document.querySelector('#tfa-form');

   // Получение QR-кода
   try {
      const response = await fetch('/auth/2fa/setup', { method: "POST" });
      const data = await response.json();

      if (response.ok) {
         const qrImg = document.createElement('img');
         qrImg.src = data.qrCode;
         qrContainer.appendChild(qrImg);
      } else {
         console.error(data.message);
         qrContainer.innerHTML = `<p class="error">Error: ${data.message}</p>`;
      }
   } catch (error) {
      console.error('Error fetching QR code:', error);
      qrContainer.innerHTML = '<p class="error">Failed to load QR code.</p>';
   }

   // Отправка кода для верификации
   tfaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.querySelector('#code').value;

      try {
         const response = await fetch('/auth/2fa/verify', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: code }),
         });

         const data = await response.json();

         if (response.ok) {
            alert('2FA successfully enabled!');
            window.location.href = '/profile'; // Обновляем страницу или перенаправляем на профиль
         } else {
            alert(`Error: ${data.message}`);
         }
      } catch (error) {
         console.error('Error verifying 2FA token:', error);
         alert('An error occurred. Please try again.');
      }
   });
});
