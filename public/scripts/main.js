const header = document.querySelector('.header');
const nav = header.querySelector('nav');
const navLinks = nav.querySelectorAll('a');

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentLink = nav.querySelector(`a[href="${currentPath}"]`);
    if (currentLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        currentLink.classList.add('active');
    }
});