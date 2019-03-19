export default class MathChart {
  static getMinMaxValues(chart) {
    const concatenatedData = chart.columns[1]
      .concat(chart.columns[2])
      .filter(item => typeof item === 'number');

    return [
      Math.min.apply(null, concatenatedData),
      Math.max.apply(null, concatenatedData)
    ];
  }

  static getCurrentChartModel(line, currentChart, initialChart) {
    const result = currentChart;

    if (Object.values(line)[0]) {
      result.columns.push(
        initialChart.columns[
          initialChart.columns.findIndex(col => col[0] === Object.keys(line)[0])
        ]
      );
    } else {
      result.columns = currentChart.columns.filter(col => col[0] !== Object.keys(line)[0]);
    }

    return result;
  }
}
