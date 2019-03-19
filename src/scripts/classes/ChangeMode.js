export default class ChangeMode {
  constructor(canvas) {
    this.constructor.changeMode(canvas);
  }

  static changeMode(canvas) {
    const chartContainer = canvas.parentNode;
    const span = document.createElement('span');

    span.innerHTML = 'Switch to Night Mode';
    span.classList.add('main__switch-mode');
    chartContainer.append(span);

    let mode = 0; // 0 - day, 1 - night

    span.addEventListener('click', () => {
      chartContainer.classList.toggle('main__chart_midnight-blue');

      if (mode) {
        span.innerHTML = 'Switch to Night Mode';
        mode = 0;
      } else {
        span.innerHTML = 'Switch to Day Mode';
        mode = 1;
      }
    });
  }
}
