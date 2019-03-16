export default class DrawGraph {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasActualHeight = canvasActualHeight;
    this.heightOffset = heightOffset;
    this.minValue = minValue;
    this.maxValue = maxValue;

    emitter.subscribe('event:scale-change', scale => {
      this.countYCoordinates(chart, scale);
      this.scale = scale;
    });

    emitter.subscribe('event:x-change', beginEndIndexes => {
      this.countYCoordinates(chart, this.scale, beginEndIndexes);
    });
  }

  countYCoordinates(chart, scale, beginEndIndexes) {
    chart.columns.forEach((col, index) => {
      if (index > 0) {
        const colName = col[0];
        const lineYCoordinates = [];

        col.forEach((item, i) => {
          if (!beginEndIndexes && i > 0) {
            lineYCoordinates.push(
              this.canvasActualHeight - (item - this.minValue)
                * (this.canvasActualHeight / (this.maxValue - this.minValue))
                  + this.heightOffset
            );
          } else if (i > 0 && i > beginEndIndexes[0] && i <= beginEndIndexes[1] + 1) {
            lineYCoordinates.push(
              this.canvasActualHeight - (item - this.minValue)
                * (this.canvasActualHeight / (this.maxValue - this.minValue))
                  + this.heightOffset
            );
          }
        });

        this.drawLines(lineYCoordinates, chart, scale, colName);
      }
    });
  }

  drawLines(lineYCoordinates, chart, scale, colName) {
    for (let i = 0; i < lineYCoordinates.length; i += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / scale * i, lineYCoordinates[i]);
      this.ctx.lineTo(this.canvas.width / scale * [i + 1], lineYCoordinates[i + 1]);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = chart.colors[colName];
      this.ctx.stroke();
    }
  }
}
