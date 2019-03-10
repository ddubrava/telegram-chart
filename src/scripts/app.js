const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 25;
canvas.height = window.innerHeight / 1.5;

const chartData = [
  {
    columns: [
      ['x', 1542412800000, 1542499200000, 1542585600000, 1542672000000, 1542758400000, 1542931200000],
      ['y0', 370, 200, 320, 390, 320],
      ['y1', 220, 120, 300, 400]
    ],
    types: {
      y0: 'line',
      y1: 'line',
      x: 'x'
    },
    names: {
      y0: '#0',
      y1: '#1'
    },
    colors: {
      y0: '#3DC23F',
      y1: '#F34C44'
    }
  }
];

const drawGrid = chart => {
  // Calculates 6 average values of chart
  const findAverageValues = () => {
    const concatedData = chart.columns[1]
      .concat(chart.columns[2])
      .filter(item => typeof item === 'number');

    const [min, max] = [Math.min.apply(null, concatedData), Math.max.apply(null, concatedData)];

    const step = (max - min) / 3.5;
    const values = [];
    for (let i = min - step; i <= max + step; i += step) {
      values.push(Math.floor(i));
    }

    return values.reverse();
  };

  const getDates = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dates = [];

    chart.columns[0].forEach(item => {
      if (typeof item === 'number') {
        const date = new Date(item);
        dates.push(`${monthNames[date.getMonth()]} ${date.getDate()}`);
      }
    });

    return dates;
  };

  const xValues = findAverageValues();
  const yValues = getDates();

  const drawXLines = (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(canvas.width, y);
    ctx.strokeStyle = '#DFE6EB';
    ctx.stroke();
  };

  const drawXValues = (x, y, i) => {
    ctx.fillStyle = '#9DA8B0';
    ctx.fillText(xValues[i - 1], x + 5, y - 5);
  };

  const drawYValues = (x, y, i) => {
    ctx.fillText(yValues[i - 1], x + 10, y);
  };

  for (let i = 1; i < 7; i += 1) {
    drawXLines(0, canvas.height / 6 * i - 20);
    drawXValues(0, canvas.height / 6 * i - 20, i);
    drawYValues(canvas.width / 6 * (i - 1), canvas.height, i);
  }
};

drawGrid(chartData[0]);
