export default class MathUtility {
  // Controller
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

  // DrawGrid
  static findAverageValues([min, max]) {
    const step = (max - min) / 5;
    const values = [];
    for (let i = min; i <= max; i += step) {
      values.push(+i.toFixed(2));
    }

    return values.reverse();
  }

  static getDates(chart, scale, begin = 1) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDiff = Math.ceil(scale / 6);
    const dates = chart.columns[0];
    let filteredDates = [];

    for (let i = begin; i < dates.length; i += dateDiff) {
      filteredDates.push(dates[i]);
    }

    filteredDates = filteredDates.map(item => {
      const date = new Date(item);
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    });

    return filteredDates;
  }

  // DrawMap
  static getBeginEndIndexes(canvasWidth, zoomX, zoomWidth, lineYCoordinatesLength) {
    const begin = Math.floor(zoomX / (canvasWidth / lineYCoordinatesLength));
    return [
      begin,
      begin + Math.ceil(zoomWidth / (canvasWidth / lineYCoordinatesLength))
    ];
  }

  // DrawGraph
  static countYCoordinates(chart, beginEndIndexes, min, max, canvasActualHeight, heightOffset) {
    const lineYCoordinates = [];

    chart.columns.forEach((col, index) => {
      if (index > 0) {
        lineYCoordinates.push({
          axis: Object.keys(chart.names)[index - 1],
          yCoordinates: []
        });

        col.forEach((item, i) => {
          const axisReferenceFormula = canvasActualHeight - (item - min)
            * (canvasActualHeight / (max - min))
              + heightOffset;

          if (!beginEndIndexes && i > 0) {
            lineYCoordinates[index - 1].yCoordinates.push(axisReferenceFormula);
          } else if (i > 0 && i > beginEndIndexes[0] && i <= beginEndIndexes[1] + 1) {
            lineYCoordinates[index - 1].yCoordinates.push(axisReferenceFormula);
          }
        });
      }
    });

    return lineYCoordinates;
  }
}
