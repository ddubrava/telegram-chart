export default class DrawGrid {
  constructor(canvas, ctx, canvasActualHeight, heightOffset, chart, minValue, maxValue, emitter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasActualHeight = canvasActualHeight;
    this.heightOffset = heightOffset;
    this.chart = chart;
    this.minValue = minValue;
    this.maxValue = maxValue;

    emitter.subscribe('event:scale-change', scale => {
      this.scale = scale;
      this.xValues = this.getDates(scale);
      this.yValues = this.findAverageValues();
      this.drawGrid();
    });

    emitter.subscribe('event:x-change', data => {
      this.xValues = this.getDates(this.scale, data[0] + 1);
      this.drawGrid();
    });

    emitter.subscribe('event:redraw', data => {
      this.chart = data;
      this.drawGrid();
    });
  }

  findAverageValues() {
    const step = (this.maxValue - this.minValue) / 5;
    const values = [];
    for (let i = this.minValue; i <= this.maxValue; i += step) {
      values.push(+i.toFixed(2));
    }

    return values.reverse();
  }

  getDates(scale, begin = 1) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDiff = Math.ceil(scale / 6);
    const dates = this.chart.columns[0];
    let filteredDates = [];
    // console.log(begin)
    for (let i = begin; i < dates.length; i += dateDiff) {
      filteredDates.push(dates[i]);
    }

    filteredDates = filteredDates.map(item => {
      const date = new Date(item);
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    });

    return filteredDates;
  }

  drawXLine(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(this.canvas.width, y);
    this.ctx.strokeStyle = '#DFE6EB';
    this.ctx.stroke();
  }

  drawYValue(x, y, i) {
    this.ctx.fillStyle = '#9DA8B0';
    this.ctx.fillText(this.yValues[i], x + 2.5, y - 5);
  }

  drawXValue(x, y, i) {
    this.ctx.fillText(this.xValues[i], x + 15, y);
  }

  drawGrid() {
    for (let i = 0; i < 6; i += 1) {
      this.drawXLine(0, this.canvasActualHeight / 5 * i + this.heightOffset);
      this.drawYValue(0, this.canvasActualHeight / 5 * i + this.heightOffset, i);
      this.drawXValue(
        this.canvas.width / 6 * i, this.canvasActualHeight + this.heightOffset + 25, i
      );
    }
  }
}
