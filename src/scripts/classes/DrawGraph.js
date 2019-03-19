import MathChart from '../math';

export default class DrawGraph {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.minValue = minValue;
    this.maxValue = maxValue;

    emitter.subscribe('event:scale-change', scale => {
      this.drawLines(
        chart,
        MathChart.countYCoordinates(
          chart,
          undefined,
          this.minValue,
          this.maxValue,
          canvasActualHeight,
          heightOffset
        ),
        scale
      );

      this.scale = scale;
    });

    emitter.subscribe('event:x-change', beginEndIndexes => {
      this.drawLines(
        chart,
        MathChart.countYCoordinates(
          chart,
          beginEndIndexes,
          this.minValue,
          this.maxValue,
          canvasActualHeight,
          heightOffset
        ),
        this.scale
      );

      this.beginEndIndexes = beginEndIndexes;
    });

    emitter.subscribe('event:redraw', data => {
      this.drawLines(
        data,
        MathChart.countYCoordinates(
          data,
          undefined,
          this.minValue,
          this.maxValue,
          canvasActualHeight,
          heightOffset
        ),
        this.scale
      );
    });
  }

  drawLines(chart, lineYCoordinates, scale) {
    lineYCoordinates.forEach(line => {
      for (let i = 0; i < line.yCoordinates.length; i += 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / scale * i, line.yCoordinates[i]);
        this.ctx.lineTo(this.canvas.width / scale * [i + 1], line.yCoordinates[i + 1]);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = chart.colors[line.axis];
        this.ctx.stroke();
      }
    });
  }
}
