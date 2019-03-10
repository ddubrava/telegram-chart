const changeMode = () => {
  const main = document.querySelector('.main');
  const span = document.querySelector('.main__switch-mode');
  let mode = 0; // 0 - day, 1 - night

  span.addEventListener('click', () => {
    main.classList.toggle('main_midnight-blue');

    if (mode) {
      span.innerHTML = 'Switch to Night Mode';
      mode = 0;
    } else {
      span.innerHTML = 'Switch to Day Mode';
      mode = 1;
    }
  });
};


changeMode();
