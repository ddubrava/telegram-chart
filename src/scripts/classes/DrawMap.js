import MathUtility from './MathUtility';

export default class DrawMap {
  constructor(canvas, ctx, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.heightOffset = heightOffset;
    this.chart = chart;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.emitter = emitter;

    this.mapHeight = 50;
    this.mapYCoordinate = this.canvas.height - this.mapHeight;
    this.zoomX = 1;
    this.zoomY = this.mapYCoordinate;
    this.zoomWidth = 100;
    this.zoomHeight = this.mapHeight;
    this.outterWidthOffset = Math.round((window.innerWidth - this.canvas.width) / 2);
    this.lineYCoordinates = [];

    this.drawMapRect();
    this.drawMapZoom();
    this.drawLinesInMap();
    this.moveRectMap();
    this.changeScale(); // to emit default scale

    emitter.subscribe('event:redraw', data => {
      this.chart = data;

      this.drawMapRect();
      this.drawMapZoom();
      this.drawLinesInMap();
    });
  }

  drawMapRect() {
    this.ctx.fillStyle = '#F5F9FB';
    this.ctx.fillRect(0, this.mapYCoordinate, this.canvas.width, this.mapHeight);
  }

  drawMapZoom() {
    this.ctx.rect(this.zoomX, this.zoomY, this.zoomWidth, this.zoomHeight);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#DDEAF3';
    this.ctx.stroke();
  }

  // TODO extend method instead of repeating (DRY)
  drawLinesInMap() {
    this.chart.columns.forEach((col, index) => {
      if (index > 0) {
        const colName = col[0];
        this.lineYCoordinates = [];

        col.forEach((item, i) => {
          if (i > 0) {
            this.lineYCoordinates.push(
              this.canvas.height - (item - this.minValue)
                * (this.mapHeight / (this.maxValue - this.minValue))
            );
          }
        });

        for (let i = 0; i < this.lineYCoordinates.length - 1; i += 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(
            this.canvas.width / this.lineYCoordinates.length * i,
            this.lineYCoordinates[i]
          );
          this.ctx.lineTo(
            this.canvas.width / this.lineYCoordinates.length * [i + 1],
            this.lineYCoordinates[i + 1]
          );
          this.ctx.lineWidth = 1.5;
          this.ctx.strokeStyle = this.chart.colors[colName];
          this.ctx.stroke();
        }
      }
    });
  }

  moveRectMap() {
    this.canvas.addEventListener('touchmove', event => {
      const rect = event.target.getBoundingClientRect();
      const [x, y] = [
        event.targetTouches[0].clientX - rect.left,
        event.targetTouches[0].clientY - rect.top
      ];

      if (
        x >= this.zoomX
        && x <= this.zoomX + this.zoomWidth
        && y >= this.zoomY
        && y <= this.zoomY + this.zoomHeight
      ) {
        if (x - this.zoomWidth / 2 > 0 && x + this.zoomHeight < this.canvas.width - 2) {
          this.zoomX = x - this.zoomWidth / 2;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.emitter.emit(
          'event:x-change',
          MathUtility.getBeginEndIndexes(
            this.canvas.width,
            this.zoomX,
            this.zoomWidth,
            this.lineYCoordinates.length
          )
        );

        this.drawMapRect();
        this.drawMapZoom();
        this.drawLinesInMap();
      }
    });
  }

  changeScale() {
    const [begin, end] = MathUtility.getBeginEndIndexes(
      this.canvas.width,
      this.zoomX,
      this.zoomWidth,
      this.lineYCoordinates.length
    );
    this.emitter.emit('event:scale-change', end - begin);
  }
}
