import chartData from '../chart_data.json';
import ChartController from './classes/Controller';

const canvas = document.getElementById('chart');
const chart = new ChartController(canvas, chartData[0]);

setTimeout(() => {
  chart.changeScale(50);
}, 1000);
