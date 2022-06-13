/*
jQuery.ganttView v.0.8.8
Copyright (c) 2010 JC Grubbs - jc.grubbs@devmynd.com
MIT License Applies
*/

/*
Options
-----------------
showWeekends: boolean
data: object
cellWidth: number
cellHeight: number
slideWidth: number
dataUrl: string
behavior: {
	clickable: boolean,
	draggable: boolean,
	resizable: boolean,
	onClick: function,
	onDrag: function,
	onResize: function
}
*/
var jQuery;
var PID;
export const ganttView = function ($, id, ...args) {
  jQuery = $;
  PID = jQuery(id);
  //   var args = Array.prototype.slice.call(arguments);
  console.log(args);
  if (args.length == 1 && typeof args[0] == "object") {
    build.call(PID, args[0]);
  }

  if (args.length == 2 && typeof args[2] == "string") {
    handleMethod.call(PID, args[2], args[3]);
  }
};

function build(options) {
  var els = this.PID;
  var defaults = {
    showWeekends: true,
    cellWidth: 21,
    cellHeight: 31,
    slideWidth: 400,
    vHeaderWidth: 100,
    behavior: {
      clickable: true,
      draggable: true,
      resizable: true,
    },
  };

  var opts = this.jQuery.extend(true, defaults, options);

  if (opts.data) {
    build();
  } else if (opts.dataUrl) {
    this.jQuery.getJSON(opts.dataUrl, function (data) {
      opts.data = data;
      build();
    });
  }

  function build() {
    var minDays = Math.floor(opts.slideWidth / opts.cellWidth + 5);
    var startEnd = DateUtils.getBoundaryDatesFromData(opts.data, minDays);
    opts.start = startEnd[0];
    opts.end = startEnd[1];

    els.each(function () {
      var container = this.jQuery(this.PID);
      var div = this.jQuery("<div>", { class: "ganttview" });
      Chart(div, opts).render();
      container.append(div);

      var w =
        this.jQuery("div.ganttview-vtheader", container).outerWidth() +
        this.jQuery("div.ganttview-slide-container", container).outerWidth();
      container.css("width", w + 2 + "px");

      Behavior(container, opts).apply();
    });
  }
}

function handleMethod(method, value) {
  if (method == "setSlideWidth") {
    var div = this.$("div.ganttview", this.PID);
    div.each(function () {
      var vtWidth = this.$("div.ganttview-vtheader", div).outerWidth();
      this.$(div).width(vtWidth + value + 1);
      this.$("div.ganttview-slide-container", this.PID).width(value);
    });
  }
}

var Chart = function (div, opts) {
  function render() {
    addVtHeader(div, opts.data, opts.cellHeight);

    var slideDiv = this.jQuery("<div>", {
      class: "ganttview-slide-container",
      css: { width: opts.slideWidth + "px" },
    });

    this.dates = getDates(opts.start, opts.end);
    addHzHeader(slideDiv, this.dates, opts.cellWidth);
    addGrid(slideDiv, opts.data, this.dates, opts.cellWidth, opts.showWeekends);
    addBlockContainers(slideDiv, opts.data);
    addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start);
    div.append(slideDiv);
    applyLastClass(div.parent());
  }

  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Creates a 3 dimensional array [year][month][day] of every day
  // between the given start and end dates
  function getDates(start, end) {
    var dates = [];
    dates[start.getFullYear()] = [];
    dates[start.getFullYear()][start.getMonth()] = [start];
    var last = start;
    while (last.compareTo(end) == -1) {
      var next = last.clone().addDays(1);
      if (!dates[next.getFullYear()]) {
        dates[next.getFullYear()] = [];
      }
      if (!dates[next.getFullYear()][next.getMonth()]) {
        dates[next.getFullYear()][next.getMonth()] = [];
      }
      dates[next.getFullYear()][next.getMonth()].push(next);
      last = next;
    }
    return dates;
  }

  function addVtHeader(div, data, cellHeight) {
    var headerDiv = this.jQuery("<div>", { class: "ganttview-vtheader" });
    for (var i = 0; i < data.length; i++) {
      var itemDiv = this.jQuery("<div>", { class: "ganttview-vtheader-item" });
      itemDiv.append(
        this.jQuery("<div>", {
          class: "ganttview-vtheader-item-name",
          css: { height: data[i].series.length * cellHeight + "px" },
        }).append(data[i].name)
      );
      var seriesDiv = this.jQuery("<div>", {
        class: "ganttview-vtheader-series",
      });
      for (var j = 0; j < data[i].series.length; j++) {
        seriesDiv.append(
          this.jQuery("<div>", {
            class: "ganttview-vtheader-series-name",
          }).append(data[i].series[j].name)
        );
      }
      itemDiv.append(seriesDiv);
      headerDiv.append(itemDiv);
    }
    div.append(headerDiv);
  }

  function addHzHeader(div, dates, cellWidth) {
    var headerDiv = this.jQuery("<div>", { class: "ganttview-hzheader" });
    var monthsDiv = this.jQuery("<div>", {
      class: "ganttview-hzheader-months",
    });
    var daysDiv = this.jQuery("<div>", { class: "ganttview-hzheader-days" });
    var totalW = 0;
    for (var y in dates) {
      for (var m in dates[y]) {
        var w = dates[y][m].length * cellWidth;
        totalW = totalW + w;
        monthsDiv.append(
          this.jQuery("<div>", {
            class: "ganttview-hzheader-month",
            css: { width: w - 1 + "px" },
          }).append(monthNames[m] + "/" + y)
        );
        for (var d in dates[y][m]) {
          daysDiv.append(
            this.jQuery("<div>", { class: "ganttview-hzheader-day" }).append(
              dates[y][m][d].getDate()
            )
          );
        }
      }
    }
    monthsDiv.css("width", totalW + "px");
    daysDiv.css("width", totalW + "px");
    headerDiv.append(monthsDiv).append(daysDiv);
    div.append(headerDiv);
  }

  function addGrid(div, data, dates, cellWidth, showWeekends) {
    var gridDiv = this.jQuery("<div>", { class: "ganttview-grid" });
    var rowDiv = this.jQuery("<div>", { class: "ganttview-grid-row" });
    for (var y in dates) {
      for (var m in dates[y]) {
        for (var d in dates[y][m]) {
          var cellDiv = this.jQuery("<div>", {
            class: "ganttview-grid-row-cell",
          });
          if (DateUtils.isWeekend(dates[y][m][d]) && showWeekends) {
            cellDiv.addClass("ganttview-weekend");
          }
          rowDiv.append(cellDiv);
        }
      }
    }
    var w =
      this.jQuery("div.ganttview-grid-row-cell", rowDiv).length * cellWidth;
    rowDiv.css("width", w + "px");
    gridDiv.css("width", w + "px");
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].series.length; j++) {
        gridDiv.append(rowDiv.clone());
      }
    }
    div.append(gridDiv);
  }

  function addBlockContainers(div, data) {
    var blocksDiv = this.jQuery("<div>", { class: "ganttview-blocks" });
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].series.length; j++) {
        blocksDiv.append(
          this.jQuery("<div>", { class: "ganttview-block-container" })
        );
      }
    }
    div.append(blocksDiv);
  }

  function addBlocks(div, data, cellWidth, start) {
    var rows = this.jQuery(
      "div.ganttview-blocks div.ganttview-block-container",
      div
    );
    var rowIdx = 0;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].series.length; j++) {
        var series = data[i].series[j];
        var size = DateUtils.daysBetween(series.start, series.end) + 1;
        var offset = DateUtils.daysBetween(start, series.start);
        var block = this.jQuery("<div>", {
          class: "ganttview-block",
          title: series.name + ", " + size + " days",
          css: {
            width: size * cellWidth - 9 + "px",
            "margin-left": offset * cellWidth + 3 + "px",
          },
        });
        addBlockData(block, data[i], series);
        if (data[i].series[j].color) {
          block.css("background-color", data[i].series[j].color);
        }
        block.append(
          this.jQuery("<div>", { class: "ganttview-block-text" }).text(size)
        );
        this.jQuery(rows[rowIdx]).append(block);
        rowIdx = rowIdx + 1;
      }
    }
  }

  function addBlockData(block, data, series) {
    // this.PID allows custom attributes to be added to the series data objects
    // and makes them available to the 'data' argument of click, resize, and drag handlers
    var blockData = { id: data.id, name: data.name };
    this.jQuery.extend(blockData, series);
    block.data("block-data", blockData);
  }

  function applyLastClass(div) {
    this.jQuery(
      "div.ganttview-grid-row div.ganttview-grid-row-cell:last-child",
      div
    ).addClass("last");
    this.jQuery(
      "div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child",
      div
    ).addClass("last");
    this.jQuery(
      "div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child",
      div
    ).addClass("last");
  }

  return {
    render: render,
  };
};

var Behavior = function (div, opts) {
  function apply() {
    if (opts.behavior.clickable) {
      bindBlockClick(div, opts.behavior.onClick);
    }

    if (opts.behavior.resizable) {
      bindBlockResize(div, opts.cellWidth, opts.start, opts.behavior.onResize);
    }

    if (opts.behavior.draggable) {
      bindBlockDrag(div, opts.cellWidth, opts.start, opts.behavior.onDrag);
    }
  }

  function bindBlockClick(div, callback) {
    this.jQuery("div.ganttview-block", div).live("click", function () {
      if (callback) {
        callback(this.jQuery(this.PID).data("block-data"));
      }
    });
  }

  function bindBlockResize(div, cellWidth, startDate, callback) {
    this.jQuery("div.ganttview-block", div).resizable({
      grid: cellWidth,
      handles: "e,w",
      stop: function () {
        var block = this.jQuery(this.PID);
        updateDataAndPosition(div, block, cellWidth, startDate);
        if (callback) {
          callback(block.data("block-data"));
        }
      },
    });
  }

  function bindBlockDrag(div, cellWidth, startDate, callback) {
    this.jQuery("div.ganttview-block", div).draggable({
      axis: "x",
      grid: [cellWidth, cellWidth],
      stop: function () {
        var block = this.jQuery(this.PID);
        updateDataAndPosition(div, block, cellWidth, startDate);
        if (callback) {
          callback(block.data("block-data"));
        }
      },
    });
  }

  function updateDataAndPosition(div, block, cellWidth, startDate) {
    var container = this.jQuery("div.ganttview-slide-container", div);
    var scroll = container.scrollLeft();
    var offset = block.offset().left - container.offset().left - 1 + scroll;

    // Set new start date
    var daysFromStart = Math.round(offset / cellWidth);
    var newStart = startDate.clone().addDays(daysFromStart);
    block.data("block-data").start = newStart;

    // Set new end date
    var width = block.outerWidth();
    var numberOfDays = Math.round(width / cellWidth) - 1;
    block.data("block-data").end = newStart.clone().addDays(numberOfDays);
    this.jQuery("div.ganttview-block-text", block).text(numberOfDays + 1);

    // Remove top and left properties to avoid incorrect block positioning,
    // set position to relative to keep blocks relative to scrollbar when scrolling
    block
      .css("top", "")
      .css("left", "")
      .css("position", "relative")
      .css("margin-left", offset + "px");
  }

  return {
    apply: apply,
  };
};

var ArrayUtils = {
  contains: function (arr, obj) {
    var has = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == obj) {
        has = true;
      }
    }
    return has;
  },
};

var DateUtils = {
  daysBetween: function (start, end) {
    if (!start || !end) {
      return 0;
    }
    start = Date.parse(start);
    end = Date.parse(end);
    if (start.getYear() == 1901 || end.getYear() == 8099) {
      return 0;
    }
    var count = 0,
      date = start.clone();
    while (date.compareTo(end) == -1) {
      count = count + 1;
      date.addDays(1);
    }
    return count;
  },

  isWeekend: function (date) {
    return date.getDay() % 6 == 0;
  },

  getBoundaryDatesFromData: function (data, minDays) {
    var minStart: any;
    var maxEnd: any;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].series.length; j++) {
        var start = Date.parse(data[i].series[j].start);
        var end = Date.parse(data[i].series[j].end);
        if (i == 0 && j == 0) {
          minStart = start;
          maxEnd = end;
        }
        if (minStart.compareTo(start) == 1) {
          minStart = start;
        }
        if (maxEnd.compareTo(end) == -1) {
          maxEnd = end;
        }
      }
    }

    // Insure that the width of the chart is at least the slide width to avoid empty
    // whitespace to the right of the grid
    if (DateUtils.daysBetween(minStart, maxEnd) < minDays) {
      maxEnd = minStart.clone().addDays(minDays);
    }

    return [minStart, maxEnd];
  },
};
