
export default class DrawGraph {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue) {
    this.canvasActualHeight = canvasActualHeight;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.heightOffset = heightOffset;
    this.chart = chart;
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawLine(1, 60);
    this.drawLine(2, 60);
  }

  drawLine(chartNumber, scale = 6) {
    const lineYCoordinates = [];
    this.chart.columns[chartNumber].forEach((item, i) => {
      if (i > 0) {
        lineYCoordinates.push(
          this.canvasActualHeight - (item - this.minValue)
            * (this.canvasActualHeight / (this.maxValue - this.minValue))
              + this.heightOffset
        );
      }
    });

    for (let i = 0; i < lineYCoordinates.length - 1; i += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / scale * i + 15, lineYCoordinates[i]);
      this.ctx.lineTo(this.canvas.width / scale * [i + 1] + 15, lineYCoordinates[i + 1]);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = chartNumber === 1 ? this.chart.colors.y0 : this.chart.colors.y1;
      this.ctx.stroke();
    }
  }
}
