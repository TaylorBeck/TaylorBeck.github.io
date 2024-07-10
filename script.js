const container = document.querySelector('.container');

const darkContainer = container.cloneNode(true);
darkContainer.id = 'container-dark';
darkContainer.classList.remove('active');

document.body.appendChild(darkContainer);

const modeSwitch = document.querySelectorAll('.mode-switch');
const icons = document.querySelectorAll('.mode-switch i');

const darkProfile = document.querySelector('#container-dark .profile img');

darkProfile.src = 'taylor-dark.webp';

modeSwitch.forEach(icon => {
  icon.addEventListener('click', () => {
    icon.classList.add('disabled');
    setTimeout(() => {
      icon.classList.remove('disabled');
    }, 1500);

    icons.forEach(icon => {
      icon.classList.toggle('bx-sun');
    });

    container.classList.toggle('active');
    darkContainer.classList.toggle('active');
  })
});
