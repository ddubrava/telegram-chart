export default class ButtonsControl {
  constructor(canvas, ctx, chart, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.chart = chart;
    this.emitter = emitter;
    this.toggleLine = this.toggleLine.bind(this);

    this.createButtons();
    this.checkMarks = document.querySelectorAll(`.main__check-mark_${this.canvas.parentNode.id.slice(-1)}`);
  }

  createButtons() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('main__button-container');

    Object.keys(this.chart.names).forEach(name => {
      const button = document.createElement('button');
      const buttonTitle = document.createElement('span');
      const checkMark = document.createElement('span');

      button.className = 'main__button';
      button.id = name;
      buttonTitle.innerHTML = name;
      buttonTitle.id = name;
      checkMark.classList.add('main__check-mark', `main__check-mark_${this.canvas.parentNode.id.slice(-1)}`);
      checkMark.style = `background: ${this.chart.colors[name]}`;
      checkMark.id = name;
      button.addEventListener('click', this.toggleLine, false);

      this.canvas.parentNode.insertBefore(buttonsContainer, this.canvas.nextSibling);
      button.append(checkMark);
      button.append(buttonTitle);
      buttonsContainer.append(button);
    });
  }

  toggleLine(event) {
    const array = Array.prototype.slice.call(this.checkMarks);
    const elem = array[array.findIndex(item => item.id === event.target.id)];
    const color = elem.style.cssText.slice(12, elem.style.cssText.length - 1);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (elem.style.background === 'rgb(255, 255, 255)') {
      this.emitter.emit('event:toggle-line', { [event.target.id]: true });
      elem.style = `background: ${this.chart.colors[event.target.id]}`;
    } else {
      elem.style.background = '#fff';
      elem.style.border = `1px solid ${color}`;
      this.emitter.emit('event:toggle-line', { [event.target.id]: false });
    }
  }
}
