export default class DrawGraph {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasActualHeight = canvasActualHeight;
    this.heightOffset = heightOffset;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.drawLines(chart);

    emitter.subscribe('event:scale-change', data => {
      this.drawLines(chart, data);
    });
  }

  drawLines(chart, scale = 25) {
    chart.columns.forEach((col, index) => {
      if (index > 0) {
        const colName = col[0];
        const lineYCoordinates = [];

        col.forEach((item, i) => {
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
          this.ctx.strokeStyle = chart.colors[colName];
          this.ctx.stroke();
        }
      }
    });
  }
}
