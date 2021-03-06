export default class MathUtility {
  // Controller
  static getMinMaxValues(chart, beginEndIndexes) {
    if (beginEndIndexes) {
      const concatenatedData = [];

      chart.columns.forEach((item, i) => {
        if (i > 0) {
          concatenatedData.push(...item.slice(beginEndIndexes[0] + 1, beginEndIndexes[1] + 2));
        }
      });

      return [
        Math.min.apply(null, concatenatedData),
        Math.max.apply(null, concatenatedData)
      ];
    }

    // for DrawingMap
    const concatenatedData = []
      .concat(...chart.columns.slice(-chart.columns.length + 1))
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

  static getDates(chart, beginEndIndexes) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDiff = Math.ceil((beginEndIndexes[1] - beginEndIndexes[0]) / 6);
    const dates = chart.columns[0];
    let filteredDates = [];

    // + 1 as [0] is 'x' && + 1 as xValues arent starting from the X(0)
    for (let i = beginEndIndexes[0] + 2; i < dates.length; i += dateDiff) {
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

  static getXY(mobile, event) {
    let [x, y] = [null, null];

    if (mobile) {
      const rect = event.target.getBoundingClientRect();
      [x, y] = [
        event.targetTouches[0].clientX - rect.left,
        event.targetTouches[0].clientY - rect.top
      ];
    } else {
      const rect = event.target.getBoundingClientRect();
      [x, y] = [
        event.clientX - rect.left,
        event.clientY - rect.top
      ];
    }

    return [x, y];
  }

  // DrawGraph
  static countYCoordinates(chart, beginEndIndexes, min, max, canvasActualHeight, heightOffset) {
    const lineYCoordinates = [];

    chart.columns.forEach((col, index) => {
      if (index > 0) {
        lineYCoordinates.push({
          axis: col[0],
          yCoordinates: []
        });

        col.slice(beginEndIndexes[0], beginEndIndexes[1]).forEach((item, i) => {
          const axisReferenceFormula = canvasActualHeight - (item - min)
            * (canvasActualHeight / (max - min))
              + heightOffset;

          if (i > 0) {
            lineYCoordinates[index - 1].yCoordinates.push(axisReferenceFormula);
          }
        });
      }
    });

    return lineYCoordinates;
  }
}
