/* eslint-disable no-param-reassign */
export default class ButtonsControl {
  constructor(canvas, ctx, chart, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.chart = chart;
    this.emitter = emitter;
    this.toggleLine = this.toggleLine.bind(this);

    this.createButtons();
    this.checkMarks = document.querySelectorAll(`.main__check-mark_${this.canvas.parentNode.id.slice(-1)}`);

    this.emitter.subscribe('event:change-mode', mode => {
      this.mode = mode;
      const buttons = [...canvas.parentNode.children[1].children];
      buttons.forEach(btn => {
        if (mode) {
          btn.style.background = 'transparent';
          btn.style.border = '1px solid #344658';
          btn.lastChild.style.color = '#fff';
        } else {
          btn.style.background = '#fff';
          btn.style.border = '1px solid #DDEAF3';
          btn.lastChild.style.color = '#000';
        }
      });
    });
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
      buttonTitle.innerHTML = this.chart.names[name];
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

    if (elem.style.background === 'transparent') {
      elem.style = `background: ${this.chart.colors[event.target.id]}`;
      this.emitter.emit('event:toggle-line', { [event.target.id]: true });
      if (this.mode) elem.classList.toggle('main__check-mark_hidden');
    } else {
      elem.style.background = 'transparent';
      elem.style.border = `1px solid ${color}`;
      this.emitter.emit('event:toggle-line', { [event.target.id]: false });
      if (this.mode) elem.classList.toggle('main__check-mark_hidden');
    }
  }
}
