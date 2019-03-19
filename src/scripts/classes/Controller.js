import EventEmitter from './EventEmitter';
import DrawGrid from './DrawGrid';
import DrawGraph from './DrawGraph';
import DrawMap from './DrawMap';
import ButtonsControl from './ButtonsControl';
import ChangeMode from './ChangeMode';

export default class ChartController {
  constructor(
    canvas,
    chart
  ) {
    this.canvas = canvas;
    this.chart = chart;
    this.currentChart = Object.assign({}, this.chart);
    this.ctx = canvas.getContext('2d');
    this.canvas.width = window.innerWidth - 25;
    this.canvas.height = window.innerHeight / 1.6;
    this.canvasActualHeight = canvas.height / 1.35;
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
    this.drawMap = new DrawMap(
      this.canvas,
      this.ctx,
      this.heightOffset,
      this.chart,
      this.minValue,
      this.maxValue,
      this.emitter
    );
    this.buttonsControl = new ButtonsControl(
      this.canvas,
      this.ctx,
      this.chart,
      this.emitter
    );
    this.ChangeMode = new ChangeMode();

    this.emitter.subscribe('event:toggle-line', line => {
      this.toggleLine(line);
    });
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

  toggleLine(line) {
    if (Object.values(line)[0]) {
      this.currentChart.columns.push(
        this.chart.columns[
          this.chart.columns.findIndex(col => col[0] === Object.keys(line)[0])
        ]
      );
    } else {
      this.currentChart.columns = this.currentChart.columns
        .filter(col => col[0] !== Object.keys(line)[0]);
    }

    this.emitter.emit('event:redraw', this.currentChart);
  }
}
