import DrawGrid from './DrawGrid';
import DrawGraph from './DrawGraph';

export default class ChartController {
  constructor(
    canvas,
    chart
  ) {
    this.canvas = canvas;
    this.chart = chart;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = window.innerWidth - 25;
    this.canvas.height = window.innerWidth - 25;
    this.canvasActualHeight = canvas.height / 1.2;
    this.heightOffset = (canvas.height - canvas.height / 1.2) / 2;
    [this.minValue, this.maxValue] = this.getMinMaxValues();
    this.drawGrid = new DrawGrid(
      this.canvas,
      this.ctx,
      this.canvasActualHeight,
      this.heightOffset,
      this.chart,
      this.minValue,
      this.maxValue
    );
    this.drawGraph = new DrawGraph(
      this.canvas,
      this.ctx,
      this.canvasActualHeight,
      this.heightOffset,
      this.chart,
      this.minValue,
      this.maxValue
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

  changeScale() {
    console.log(this.canvas);
  }
}
