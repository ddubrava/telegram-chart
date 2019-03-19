/* eslint-disable no-param-reassign */
import EventEmitter from './EventEmitter';
import DrawGrid from './DrawGrid';
import DrawGraph from './DrawGraph';
import DrawMap from './DrawMap';
import ButtonsControl from './ButtonsControl';
import ChangeMode from './ChangeMode';
import MathUtility from './MathUtility';

export default class ChartController {
  constructor(
    canvas,
    chart
  ) {
    if (window.innerHeight < 600) {
      canvas.height = window.innerHeight / 1.4;
      this.canvasActualHeight = canvas.height / 1.5;
    } else {
      canvas.height = window.innerHeight / 1.6;
      this.canvasActualHeight = canvas.height / 1.5;
    }

    if (window.innerWidth < 400) {
      canvas.width = window.innerWidth - 25;
    } else {
      canvas.width = 390;
    }

    this.heightOffset = (canvas.height - canvas.height / 1.2) / 2;
    this.ctx = canvas.getContext('2d');

    this.currentChart = Object.assign({}, chart);
    [this.minValue, this.maxValue] = MathUtility.getMinMaxValues(chart);

    this.emitter = new EventEmitter();
    this.drawGrid = new DrawGrid(
      canvas,
      this.ctx,
      this.canvasActualHeight,
      this.heightOffset,
      chart,
      this.minValue,
      this.maxValue,
      this.emitter
    );
    this.drawGraph = new DrawGraph(
      canvas,
      this.ctx,
      this.canvasActualHeight,
      this.heightOffset,
      chart,
      this.minValue,
      this.maxValue,
      this.emitter
    );
    this.drawMap = new DrawMap(
      canvas,
      this.ctx,
      this.heightOffset,
      chart,
      this.minValue,
      this.maxValue,
      this.emitter
    );
    this.buttonsControl = new ButtonsControl(
      canvas,
      this.ctx,
      chart,
      this.emitter
    );
    this.ChangeMode = new ChangeMode(canvas);

    this.emitter.subscribe('event:toggle-line', line => {
      MathUtility.getCurrentChartModel(line, this.currentChart, chart);
      this.emitter.emit('event:redraw', this.currentChart);
    });
  }
}
