export default class DrawGraph {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasActualHeight = canvasActualHeight;
    this.heightOffset = heightOffset;
    this.chart = chart;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.drawLine(1);
    this.drawLine(2);

    emitter.subscribe('event:scale-change', data => {
      this.drawLine(1, data);
      this.drawLine(2, data);
    });
  }

  drawLine(chartNumber, scale = 25) {
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
