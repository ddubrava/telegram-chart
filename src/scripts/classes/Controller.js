import DrawGrid from './DrawGrid';
import DrawGraph from './DrawGraph';
import EventEmitter from './EventEmitter';

export default class ChartController {
  constructor(
    canvas,
    chart
  ) {
    this.canvas = canvas;
    this.chart = chart;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = window.innerWidth - 25;
    this.canvas.height = window.innerHeight / 1.6;
    this.canvasActualHeight = canvas.height / 1.2;
    this.heightOffset = (canvas.height - canvas.height / 1.2) / 2;
    [this.minValue, this.maxValue] = this.getMinMaxValues();
    this.emitter = new EventEmitter();
    this.drawGrid = new DrawGrid(
      this.canvas,
      this.ctx,
      this.canvasActualHeight,
      this.heightOffset,
      this.chart,
      this.minValue,
      this.maxValue,
      this.emitter
    );
    this.drawGraph = new DrawGraph(
      this.canvas,
      this.ctx,
      this.canvasActualHeight,
      this.heightOffset,
      this.chart,
      this.minValue,
      this.maxValue,
      this.emitter
    );
  }

  getMinMaxValues() {
    const concatenatedData = this.chart.columns[1]
      .concat(this.chart.columns[2])
      .filter(item => typeof item === 'number');

    return [
      Math.min.apply(null, concatenatedData),
      Math.max.apply(null, concatenatedData)
    ];
  }

  changeScale(scale) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.emitter.emit('event:scale-change', scale);
  }
}
