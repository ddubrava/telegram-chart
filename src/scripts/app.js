import chartData from '../chart_data.json';
import ChartController from './classes/Controller';

const canvas = document.getElementById('chart');
// eslint-disable-next-line no-new
new ChartController(canvas, chartData[0]);
