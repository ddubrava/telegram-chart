/* eslint-disable no-new */
import chartData from '../chart_data.json';
import ChartController from './classes/Controller';

const chartContainer0 = document.getElementById('chart_0');
new ChartController(chartContainer0.children[0], chartData[0]);

const chartContainer1 = document.getElementById('chart_1');
new ChartController(chartContainer1.children[0], chartData[1]);

const chartContainer2 = document.getElementById('chart_2');
new ChartController(chartContainer2.children[0], chartData[2]);

const chartContainer3 = document.getElementById('chart_3');
new ChartController(chartContainer3.children[0], chartData[3]);
