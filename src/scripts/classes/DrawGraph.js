import MathUtility from './MathUtility';

export default class DrawGraph {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.chart = chart;
    this.minValue = minValue;
    this.maxValue = maxValue;

    emitter.subscribe('event:scale-change', beginEndIndexes => {
      this.drawLines(
        chart,
        MathUtility.countYCoordinates(
          chart,
          beginEndIndexes,
          this.minValue,
          this.maxValue,
          canvasActualHeight,
          heightOffset
        ),
        beginEndIndexes[1] - beginEndIndexes[0]
      );

      this.scale = beginEndIndexes[1] - beginEndIndexes[0];
    });

    emitter.subscribe('event:x-change', beginEndIndexes => {
      this.drawLines(
        this.chart,
        MathUtility.countYCoordinates(
          this.chart,
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
      this.chart = data;

      this.drawLines(
        data,
        MathUtility.countYCoordinates(
          data,
          this.beginEndIndexes,
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
