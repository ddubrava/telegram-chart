import MathUtility from './MathUtility';

export default class DrawMap {
  constructor(canvas, ctx, heightOffset, chart, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.heightOffset = heightOffset;
    this.chart = chart;
    this.emitter = emitter;
    [this.minValue, this.maxValue] = MathUtility.getMinMaxValues(chart);

    this.mapHeight = 50;
    this.mapYCoordinate = this.canvas.height - this.mapHeight;
    this.zoomX = 1; // lineWidth
    this.zoomY = this.mapYCoordinate + 2.5; // 2.5 = lineWidth / 2
    this.zoomWidth = 100;
    this.zoomHeight = this.mapHeight - 5; // - lineWidth
    this.outterWidthOffset = Math.round((window.innerWidth - this.canvas.width) / 2);
    this.lineYCoordinates = [];

    this.redrawDrawMapClass();
    this.emitBeginEndIndexes(); // emit beginEndIndexes in controller

    emitter.subscribe('event:redraw', ([currentChart, ...rest]) => {
      [this.mode] = [rest[2]];
      this.chart = currentChart;
      this.redrawDrawMapClass();
    });

    // listeners
    this.canvas.ontouchstart = touchStartEvent => {
      const shiftX = MathUtility.getXY(true, touchStartEvent)[0] - this.zoomX;
      this.canvas.ontouchmove = event => {
        const [x, y] = MathUtility.getXY(true, event);
        this.handleMove([x, y], shiftX);
        this.handleResize([x, y]);
      };
    };

    this.canvas.onmousedown = mouseDownEvent => {
      const shiftX = MathUtility.getXY(false, mouseDownEvent)[0] - this.zoomX;
      this.canvas.onmousemove = event => {
        const [x, y] = MathUtility.getXY(false, event);
        this.handleMove([x, y], shiftX);
        this.handleResize([x, y]);
      };
    };

    this.canvas.onmouseup = () => {
      this.canvas.onmousemove = null;
    };
  }

  drawMapRect() {
    this.ctx.fillStyle = this.mode ? '#1F2A38' : '#F5F9FB';
    this.ctx.fillRect(0, this.mapYCoordinate, this.canvas.width, this.mapHeight);
  }

  drawMapZoom() {
    this.ctx.rect(this.zoomX, this.zoomY, this.zoomWidth, this.zoomHeight);
    this.ctx.lineWidth = 5;
    this.ctx.fillStyle = this.mode ? '#242F3E' : '#FFF';
    this.ctx.fill();
    this.ctx.strokeStyle = this.mode ? '#344658' : '#DDEAF3';
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

  handleMove([x, y], shiftX) {
    if (
      x >= this.zoomX + 5 // lineWidth (not / 2 for empty space)
      && x <= this.zoomX + this.zoomWidth - 5
      && y >= this.zoomY
      && y <= this.zoomY + this.zoomHeight
    ) {
      if (x - shiftX > 0 && x - shiftX + this.zoomWidth < this.canvas.width) {
        this.zoomX = x - shiftX;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.redrawDrawMapClass();
      this.emitBeginEndIndexes();
    }
  }

  handleResize([x, y]) {
    // if - left size, else if - right side
    if (
      x >= this.zoomX - 15
      && x <= this.zoomX + 2.5
      && y >= this.zoomY
      && y <= this.zoomY + this.zoomHeight
      && this.zoomX > 2.5
    ) {
      this.zoomWidth += this.zoomX - x;
      this.zoomX = x;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.redrawDrawMapClass();
      this.emitBeginEndIndexes();
    } else if (
      x >= this.zoomX + this.zoomWidth - 2.5
      && x <= this.zoomX + this.zoomWidth + 15
      && y >= this.zoomY
      && y <= this.zoomY + this.zoomHeight
      && this.zoomX + this.zoomWidth < this.canvas.width - 2.5
    ) {
      this.zoomWidth = Math.abs(this.zoomX - x);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.redrawDrawMapClass();
      this.emitBeginEndIndexes();
    }
  }

  redrawDrawMapClass() {
    this.drawMapRect();
    this.drawMapZoom();
    this.drawLinesInMap();
  }

  emitBeginEndIndexes() {
    const [begin, end] = MathUtility.getBeginEndIndexes(
      this.canvas.width,
      this.zoomX,
      this.zoomWidth,
      this.lineYCoordinates.length
    );

    this.emitter.emit('event:begin-end-indexes', [begin, end]);
  }
}
