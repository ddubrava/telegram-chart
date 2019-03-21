import MathUtility from './MathUtility';

export default class DrawGrid {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasActualHeight = canvasActualHeight;
    this.heightOffset = heightOffset;
    this.chart = chart;

    emitter.subscribe('event:redraw', ([data, beginEndIndexes, minMaxValues]) => {
      const xValues = MathUtility.getDates(data, beginEndIndexes[1] - beginEndIndexes[0]);
      const yValues = MathUtility.findAverageValues([minMaxValues[0], minMaxValues[1]]);
      this.drawGrid(xValues, yValues);
    });
  }

  drawXLine(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(this.canvas.width, y);
    this.ctx.strokeStyle = '#DFE6EB';
    this.ctx.stroke();
  }

  drawYValue(x, y, yValues, i) {
    this.ctx.fillStyle = '#9DA8B0';
    this.ctx.fillText(yValues[i], x + 2.5, y - 5);
  }

  drawXValue(x, y, xValues, i) {
    this.ctx.fillText(xValues[i], x + 15, y);
  }

  drawGrid(xValues, yValues) {
    for (let i = 0; i < 6; i += 1) {
      this.drawXLine(0, this.canvasActualHeight / 5 * i + this.heightOffset);
      this.drawYValue(0, this.canvasActualHeight / 5 * i + this.heightOffset, yValues, i);
      this.drawXValue(
        this.canvas.width / 6 * i, this.canvasActualHeight + this.heightOffset + 25, xValues, i
      );
    }
  }
}
