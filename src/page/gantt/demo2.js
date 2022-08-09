import React, { useRef, useState, useMemo, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import highchartsGantt from "highcharts/modules/gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import highchartsDraggable from "highcharts/modules/draggable-points";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import "antd/dist/antd.css";

const { Option } = Select;

if (typeof Highcharts === "object") {
  highchartsGantt(Highcharts);
  highchartsMore(Highcharts);
  highchartsDraggable(Highcharts);
}

export default function GanttDEMOTwo() {
  const ganttRef = useRef();
  var today = +Date.now(),
    minutes = 60 * 1000,
    hours = 60 * minutes,
    days = 24 * hours,
    dateFormat = function (date) {
      var format = "%e. %b";
      return Highcharts.dateFormat(format, date);
    },
    find = Highcharts.find,
    xAxisMin = today - 10 * days,
    xAxisMax = xAxisMin + 90 * days,
    data;

  /**
   * The data used in this visualization.
   */
  data = {
    // The different events in a lap of a journey.
    events: {
      loading: {
        color: "#395627",
        tooltipFormatter: function (point) {
          return [
            "<b>Loading</b><br/>",
            "Start: " + dateFormat(point.start) + "<br/>",
            "End: " + dateFormat(point.end) + "<br/>",
          ].join("");
        },
      },
      voyage: {
        color: "#558139",
        tooltipFormatter: function (point) {
          var indicator = point.indicator;
          return [
            "<b>Voyage</b><br/>",
            "Start: (" +
              point.startLocation +
              ") " +
              dateFormat(point.start) +
              "<br/>",
            "End: (" +
              point.endLocation +
              ") " +
              dateFormat(point.end) +
              "<br/>",
            indicator ? "EPR: " + dateFormat(indicator.x) : "",
          ].join("");
        },
      },
      unloading: {
        color: "#aad091",
        tooltipFormatter: function (point) {
          return [
            "<b>Unloading</b><br/>",
            "Start: " + dateFormat(point.start) + "<br/>",
            "End: " + dateFormat(point.end) + "<br/>",
          ].join("");
        },
      },
    },
    // All the vessels and its sceduled journeys
    vessels: [
      {
        name: "Vessel 1",
        journeys: [
          {
            name: "Contract 1",
            start: today + days,
            laps: [
              {
                duration: 21 * days,
                startLocation: "USGLS",
                endLocation: "BEZEE",
                loadDuration: 1 * days + 2 * hours + 45 * minutes,
                unloadDuration: 1 * days + 2 * hours + 45 * minutes,
              },
              {
                duration: 11 * days,
                startLocation: "BEZEE",
                endLocation: "USCP6",
                loadDuration: 0,
                unloadDuration: 0,
                color: "#c6dfb6",
              },
            ],
          },
        ],
      },
      {
        name: "Vessel 2",
        journeys: [
          {
            name: "Contract 2",
            start: today - 5 * days,
            laps: [
              {
                duration: 13 * days,
                startLocation: "USGLS",
                endLocation: "BEZEE",
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 2 * days + 2 * hours + 45 * minutes,
              },
              {
                duration: 8 * days,
                startLocation: "BEZEE",
                endLocation: "USCP6",
                loadDuration: 0,
                unloadDuration: 0,
                color: "#c6dfb6",
              },
            ],
            earliestPossibleReturn: today - 5 * days + 20 * days,
          },
          {
            name: "Contract 3",
            start: today + 23 * days,
            laps: [
              {
                duration: 5 * days,
                startLocation: "USGLS",
                endLocation: "BEZEE",
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 2 * days + 2 * hours + 45 * minutes,
              },
              {
                duration: 14 * days,
                startLocation: "BEZEE",
                endLocation: "USCP6",
                loadDuration: 0,
                unloadDuration: 0,
                color: "#c6dfb6",
              },
            ],
          },
          {
            name: "Contract 4",
            start: today + 60 * days,
            laps: [
              {
                duration: 11 * days,
                startLocation: "USGLS",
                endLocation: "BEZEE",
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 2 * days + 2 * hours + 45 * minutes,
              },
              {
                duration: 6 * days,
                startLocation: "BEZEE",
                endLocation: "USCP6",
                loadDuration: 0,
                unloadDuration: 0,
                color: "#c6dfb6",
              },
            ],
          },
        ],
      },
    ],
  };

  /**
   * Creates a point in a lap.
   */
  var getPoint = function (params) {
    var start = params.start,
      tripName = params.tripName,
      type = params.type,
      vessel = params.vessel,
      duration = params.duration,
      voyage = params.voyage,
      indicator,
      earliestPossibleReturn = params.epr,
      end = start + duration;

    indicator =
      Highcharts.isNumber(earliestPossibleReturn) &&
      start < earliestPossibleReturn &&
      earliestPossibleReturn < end
        ? {
            enabled: true,
            x: earliestPossibleReturn - start,
          }
        : undefined;

    return {
      start: start,
      end: end,
      color: (voyage && voyage.color) || data.events[type].color,
      vessel: vessel.name,
      indicator: indicator,
      y: params.y,
      type: type,
      startLocation: voyage && voyage.startLocation,
      endLocation: voyage && voyage.endLocation,
      name: tripName,
      trip: tripName,
      dragDrop: {
        draggableStart: type === "voyage",
        draggableEnd: type === "voyage",
      },
    };
  };

  /**
   * Creates a set of points based on a lap. These points are grouped together.
   */
  var getGroupFromTrip = function (trip, vessel, y) {
    return trip.laps.reduce(
      function (group, voyage) {
        var points = [];

        if (voyage.loadDuration) {
          points.push(
            getPoint({
              start: group.end,
              duration: voyage.loadDuration,
              tripName: trip.name,
              type: "loading",
              vessel: vessel,
              y: y,
            })
          );
          group.end += voyage.loadDuration;
        }

        points.push(
          getPoint({
            start: group.end,
            duration: voyage.duration,
            voyage: voyage,
            epr: trip.earliestPossibleReturn,
            tripName: trip.name,
            type: "voyage",
            vessel: vessel,
            y: y,
          })
        );
        group.end += voyage.duration;

        if (voyage.unloadDuration) {
          points.push(
            getPoint({
              start: group.end,
              duration: voyage.unloadDuration,
              tripName: trip.name,
              type: "unloading",
              vessel: vessel,
              y: y,
            })
          );
          group.end += voyage.unloadDuration;
        }

        // Add the points
        group.points = group.points.concat(points);
        return group;
      },
      {
        end: trip.start, // Previous point end
        points: [],
      }
    );
  };

  /**
   * Parses the data and creates all the series of the chart.
   */
  var getSeriesFromInformation = function (info) {
  console.log("🚀 ~ file: demo2.js ~ line 316 ~ getSeriesFromInformation ~ info", info)
    var vessels = info.vessels;
    const res = vessels.map(function (vessel, i) {
      var data = vessel.journeys.reduce(function (result, trip) {
        var group = getGroupFromTrip(trip, vessel, i);
        return result.concat(group.points);
      }, []);

      // One series per vessel
      return {
        name: vessel.name,
        data: data,
        id: i,
      };
    });
    console.log("🚀 ~ file: demo2.js ~ line 305 ~ getSeriesFromInformation ~ res", res)
    return res
  };

  /**
   * Modify event to handle modifying other points in group when resizing
   */
  var customResize = function (e, chart) {
    var newPoints = e.newPoints,
      defined = Highcharts.defined,
      objectEach = Highcharts.objectEach,
      start,
      end,
      diff,
      resizePoint;

    if (e.newPoint && defined(e.newPoint.start) !== defined(e.newPoint.end)) {
      start = e.newPoint.start;
      end = e.newPoint.end;
      resizePoint = chart.get(e.newPointId);

      diff =
        (defined(start) && start - resizePoint.options.start) ||
        (defined(end) && end - resizePoint.options.end);

      objectEach(e.origin.points, function (pointOrigin) {
        var point = pointOrigin.point;
        if (
          point.id !== e.newPointId &&
          ((defined(start) && point.end <= resizePoint.options.start) ||
            (defined(end) && point.start >= resizePoint.options.end))
        ) {
          newPoints[point.id] = {
            point: point,
            newValues: {
              start: point.start + diff,
              end: point.end + diff,
            },
          };
        }
      });
    }
  };

  /**
   * Check if new points collide with existing ones
   */
  var newPointsColliding = function (newPoints, chart) {
    var reduce = Highcharts.reduce,
      keys = Highcharts.keys,
      pick = Highcharts.pick,
      inArray = Highcharts.inArray,
      groupedPoints = chart.dragDropData && chart.dragDropData.groupedPoints,
      y,
      minX = reduce(
        keys(newPoints),
        function (acc, id) {
          y = pick(newPoints[id].newValues.y, newPoints[id].point.y);
          return Math.min(
            acc,
            pick(newPoints[id].newValues.start, newPoints[id].point.start)
          );
        },
        Infinity
      ),
      maxX = reduce(
        keys(newPoints),
        function (acc, id) {
          return Math.max(
            acc,
            pick(newPoints[id].newValues.end, newPoints[id].point.end)
          );
        },
        -Infinity
      ),
      newSeries = chart.get(y),
      i,
      collidePoint,
      pointOverlaps = function (point) {
        return (
          (point.end >= minX && point.start <= minX) ||
          (point.start <= maxX && point.end >= maxX) ||
          (point.start <= minX && point.end >= maxX) ||
          (point.start >= minX && point.end <= maxX)
        );
      };

    if (newSeries) {
      i = newSeries.points ? newSeries.points.length : 0;
      while (i--) {
        collidePoint = newSeries.points[i];
        if (
          inArray(collidePoint, groupedPoints) < 0 &&
          pointOverlaps(collidePoint)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Add collision detection on move/resize
   */
  var customDrag = function (e) {
    var series = this.series,
      chart = series.chart;

    // Handle the resize
    customResize(e, chart);

    // Check collision
    if (newPointsColliding(e.newPoints, chart)) {
      chart.dragDropData.isColliding = true;
      chart.setGuideBoxState("collide", series.options.dragDrop.guideBox);
    } else if (chart.dragDropData) {
      delete chart.dragDropData.isColliding;
      chart.setGuideBoxState("default", series.options.dragDrop.guideBox);
    }
  };

  /**
   * Implement custom drop. Do normal update, but move points between series when
   * changing their y value.
   */
  var customDrop = function (e) {
    var newPoints = e.newPoints,
      chart = this.series.chart,
      defined = Highcharts.defined,
      objectEach = Highcharts.objectEach;

    // Just return if we are colliding.
    if (chart.dragDropData.isColliding) {
      return false;
    }

    // Stop further dragdrops while we update
    chart.isDragDropAnimating = true;

    // Update the points
    objectEach(newPoints, function (update) {
      var newValues = update.newValues,
        oldPoint = update.point,
        newSeries = defined(newValues.y)
          ? chart.get(newValues.y)
          : oldPoint.series;

      // Destroy any old heat indicator objects
      if (oldPoint.heatIndicator) {
        oldPoint.heatIndicator = oldPoint.heatIndicator.destroy();
      }
      if (oldPoint.indicatorObj) {
        oldPoint.indicatorObj = oldPoint.indicatorObj.destroy();
      }

      // Update the point
      if (newSeries !== oldPoint.series) {
        newValues = Highcharts.merge(oldPoint.options, newValues);
        update.point = oldPoint = oldPoint.remove(false);
        newSeries.addPoint(newValues, false);
      } else {
        oldPoint.update(newValues, false);
      }
    });

    // Redraw with specific animation
    chart.redraw({
      duration: 400,
    });
    setTimeout(function () {
      delete chart.isDragDropAnimating;
      if (chart.hoverPoint && !chart.dragHandles) {
        chart.hoverPoint.showDragHandles();
      }
    }, 400);

    // Don't do the default drop
    return false;
  };

  /**
   * Custom formatter for data labels which are left aligned.
   */
  var leftLabelFormatter = function () {
    if (this.point.type === "voyage") {
      return this.point.startLocation;
    }
  };

  /**
   * Custom formatter for data labels which are center aligned.
   */
  var centerLabelFormatter = function () {
    if (this.point.type === "voyage") {
      return " " + this.point.name + " ";
    }
  };

  /**
   * Custom formatter for data labels which are right aligned.
   */
  var rightLabelFormatter = function () {
    if (this.point.type === "voyage") {
      return this.point.endLocation;
    }
  };

  /**
   * Custom formatter for axis labels displaying the series name.
   */
  var gridColumnFormatterSeriesName = function () {
    var chart = this.chart,
      series = chart.get(this.value);
      console.log("🚀 ~ file: demo2.js ~ line 517 ~ gridColumnFormatterSeriesName ~ series", series)
    return series.name;
  };

  /**
   * Creates a category label and formats it based on the value.
   */
  var getCategoryFromIdleTime = function (utilized, idle) {
    var thresholds = {
        25: "bad",
        50: "ok",
        75: "good",
        100: "great",
      },
      threshold = find(Object.keys(thresholds), function (threshold) {
        return utilized < +threshold;
      }),
      className = thresholds[threshold];
    return [
      '<span class="info-span ' + className + '">',
      '    <span class="utilized">' + utilized + "%</span><br/>",
      "    <span>t: " + idle + " days</span>",
      "</span>",
    ].join("\n");
  };

  /**
   * Custom formatter for axis labels displaying the vessels number of idle days,
   * and its percentage of utilized time.
   */
  var gridColumnFormatterSeriesIdle = function () {
    var chart = this.chart,
      series = chart.get(this.value),
      xAxis = series.xAxis,
      total = xAxis.max - xAxis.min,
      idle = series.idle || 0,
      used = total - idle,
      percentage = Math.round((100 / total) * used),
      idleDays = Math.round(idle / days);
    return getCategoryFromIdleTime(percentage, idleDays);
  };

  /**
   * Custom formatter for the tooltip.
   */
  var tooltipFormatter = function () {
    var point = this.point,
      trip = point.trip,
      series = point.series,
      formatter = data.events[point.type].tooltipFormatter;
    return "<b>" + trip + " - " + series.name + "</b><br/>" + formatter(point);
  };
  const options = {
    plotOptions: {
      series: {
        dragDrop: {
          draggableX: true,
          draggableY: true,
          dragMinY: 0,
          dragMaxY: data.vessels.length - 1,
          liveRedraw: false,
          groupBy: "trip",
          guideBox: {
            collide: {
              color: "rgba(200, 0, 0, 0.4)",
            },
          },
        },
        heatIndicator: {
          enabled: true,
          filter: function (indicator) {
            var start = indicator.start,
              end = indicator.end,
              idleTime = end - start;
            return idleTime > 10 * days;
          },
        },
        stickyTracking: true,
        cursor: "move",
        borderRadius: 0,
        borderWidth: 0,
        pointPadding: 0,
        dataLabels: [
          {
            enabled: true,
            labelrank: 1,
            formatter: leftLabelFormatter,
            align: "left",
            style: {
              fontSize: "8px",
            },
          },
          {
            enabled: true,
            labelrank: 2,
            formatter: centerLabelFormatter,
            align: "center",
            borderWidth: 1,
            padding: 3,
            style: {
              fontSize: "10px",
            },
          },
          {
            enabled: true,
            labelrank: 1,
            formatter: rightLabelFormatter,
            align: "right",
            style: {
              fontSize: "8px",
            },
          },
        ],
        point: {
          events: {
            drag: customDrag,
            drop: customDrop,
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    rangeSelector: {
      enabled: true,
      selected: 1,
    },
    scrollbar: {
      enabled: true,
    },
    series: getSeriesFromInformation(data),
    tooltip: {
      formatter: tooltipFormatter,
    },
    xAxis: [
      {
        type: "datetime",
        currentDateIndicator: true,
        grid: false,
        labels: {
          format: undefined,
        },
        min: xAxisMin,
        max: xAxisMax,
        tickInterval: undefined,
      },
    ],
    yAxis: [
      {
        type: "category",
        // reversed: true,
        // maxPadding: 0,
        // staticScale: 100,
        // labels: {
        //   useHTML: true,
        // },
        // // categories: ['Vessel 1', 'Vessel 2'],
        // // grid: {
        // //   enabled: true,
        // //   columns: [
        // //     {
        // //       labels: {
        // //         formatter: gridColumnFormatterSeriesName,
        // //       },
        // //     },
        // //   ],
        // // },
      },
    ],
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType="ganttChart"
        ref={ganttRef}
      />
    </>
  );
}
