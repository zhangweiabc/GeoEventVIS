//timeline时间插件
// Called when the Visualization API is loaded.
function DrawEventstory(divId,width,height) {
    var timeline;
    // Create a JSON data table
    var data = [];

    // an item every month
    var i, iMax = 1000;
    var num = 0;
    var date = new Date(2012, 0, 1);
    for (i = 0; i < iMax; i++) {
        date.setMonth(date.getMonth() + 1);
        data.push({
            "start": new Date(date),
            "content": "event " + num
        });
        num++;
    }

    // an item every day
    date = new Date(2012, 3, 1);
    for (i = 0; i < iMax; i++) {
        date.setDate(date.getDate() + 1);
        data.push({
            "start": new Date(date),
            "content": "event " + num
        });
        num++;
    }

    // an item every hour
    date = new Date(2012, 6, 1);
    for (i = 0; i < iMax; i++) {
        date.setHours(date.getHours() + 1);
        data.push({
            "start": new Date(date),
            "content": "event " + num
        });
        num++;
    }

    // items on the same spot
    date = new Date(2014, 9, 1);
    for (i = 0; i < iMax; i++) {
        data.push({
            "start": new Date(date),
            "content": "event " + num
        });
        num++;
    }

    // specify options
    var options = {
        'width':  width,
        'height': height,
        'start': new Date(2001, 0, 1),
        'end': new Date(2015, 11, 31),
        'cluster': true,
        // 'axisOnTop': true,
        'editable': true
    };

    // Instantiate our timeline object.
    timeline = new links.Timeline(document.getElementById(divId), options);

    // Draw our timeline with the created data and options
    timeline.draw(data);
}

//EventDrop时间插件
/*start: start date of the scale. Defaults to new Date(0).
end: end date of the scale. Defaults to new Date()
width: width of the chart in pixels. Default to 1000px.---------------height=data.length*40+margin.top+margin.bottom
margin: margins of the graph in pixels. Defaults to { top: 60, left: 200, bottom: 40, right: 50 }
locale: locale used for the X axis labels. See d3.locale for the expected format. Defaults to null (i.e. d3 default locale).
axisFormat: function receiving the d3 axis object, to customize tick number and size.
tickFormat: tickFormat for the X axis. See d3.timeFormat.multi() for expected format.
eventHover: function to be called when hovering an event in the chart. Receives the DOM element hovered (uses event delegation).
eventZoom: function to be called when done zooming on the chart. Receives the d3 scale at the end of the zoom.
eventClick: function to be called on click event of data-point (circle). Receives the DOM element hovered (uses event delegation).
hasDelimiter: whether to draw time boundaries on top of the chart. Defaults to true.
hasTopAxis: whether the chart has a top X axis. Accepts both a boolean or a function receiving the data of the graph that returns a boolean.
hasBottomAxis: same as topAxis but for the bottom X axis
eventLineColor: The color of the event line. Accepts a color (color name or #ffffff notation), or a function receiving the eventData and returning a color. Defaults to 'black'.
eventColor: The color of the event. Accepts a color (color name or #ffffff notation), or a function receiving the eventData and returning a color. Defaults to null. EventLineColor will be ignored if this is used.
minScale: The minimum scaling (zoom out), default to 0.
maxScale: The maximum scaling (zoom in), default to Infinity.*/
function DrawEventstory1(divId,width) {
    var data = [
    { name: "党的一大", dates: [new Date('2015/09/11 13:24:54'), new Date('2015/09/12 13:25:03'), new Date('2015/09/13 13:25:05')] },
    { name: "党的二大", dates: [new Date('2015/09/14 13:24:57'), new Date('2015/09/15 13:25:04'), new Date('2015/09/16 13:25:04')] },
    { name: "党的三大", dates: [new Date('2015/09/17 13:25:12'),new Date('2015/09/18 18:25:12')] }
    ];
    var data2 = [];
    var names = ["党的一大", "党的二大", "党的三大","党的四大","党的五大"];

    var endTime = Date.now();
    var month = 30 * 24 * 60 * 60 * 1000;
    var startTime = endTime - 6 * month;

    function createEvent (name, maxNbEvents) {
        maxNbEvents = maxNbEvents | 200;
        var event = {
            name: name,
            dates: []
        };
        // add up to 200 events
        var max =  Math.floor(Math.random() * maxNbEvents);
        for (var j = 0; j < max; j++) {
            var time = (Math.random() * (endTime - startTime)) + startTime;
            event.dates.push(new Date(time));
        }
        return event;
    }
    for (var i = 0; i < 5; i++) {
        data2.push(createEvent(names[i]));
    }

    var   eventDropsChart = d3.chart.eventDrops().hasTopAxis(true).width(width).margin({ top: 60, left: 150, bottom: 10, right: 50 });
    eventDropsChart.eventLineColor(function (datum, index) {
              return color2(index);
          })
          .start(new Date(startTime))
          .end(new Date(endTime));

    eventDropsChart.eventHover(function (datum, index) {
            tipshow(data2[i],"eventstory1");console.log(datum+":"+index);});

    d3.select(divId).datum(data2).call(eventDropsChart);
    /*d3.json("data/eventdrop.json",function(error,root){
       if (error) return console.error(error);
        console.log(root.children);
      var eventDropsChart = d3.chart.eventDrops().hasTopAxis(true);
      d3.select('#timetool').datum(root.children).call(eventDropsChart);
    });*/
}
//EventDrop时间插件

////////////////////////////////////crossfilter/////////////////////////////////////////////
d3.csv("data/gps.csv",function(error, gpsdata) 
{
    crossfilterRead(gpsdata);
});
function crossfilterRead (allgps) {
  // Various formatters.
  var formatNumber = d3.format(",d"),
      formatChange = d3.format("+,d"),
      formatDate = d3.time.format("%B %d, %Y"),
      formatTime = d3.time.format("%I:%M %p");

  // A nest operator, for grouping the flight list.
  var nestByDate = d3.nest()
      .key(function(d) { return d3.time.day(d.Timestamp); });

  // A little coercion, since the CSV is untyped.
  allgps.forEach(function(d, i) {
    d.index = i;
    d.Timestamp = parseDate(d.Timestamp);
    d.id = d.id;
    /*d.delay = +d.delay;
    d.distance = +d.distance;*/
  });

  // Create the crossfilter for the relevant dimensions and groups.
  var flight = crossfilter(allgps),
      all = flight.groupAll(),
      date = flight.dimension(function(d) { return d.Timestamp; }),
      dates = date.group(d3.time.day),
      hour = flight.dimension(function(d) { return d.Timestamp.getHours() + d.Timestamp.getMinutes() / 60; }),
      hours = hour.group(Math.floor),
      id = flight.dimension(function(d) { return d.id;}),
      ids = id.group();
      /*delay = flight.dimension(function(d) { return Math.max(-60, Math.min(149, d.delay)); }),
      delays = delay.group(function(d) { return Math.floor(d / 10) * 10; }),
      distance = flight.dimension(function(d) { return Math.min(1999, d.distance); }),
      distances = distance.group(function(d) { return Math.floor(d / 50) * 50; });*/

  var charts = [
    barChart()
        .dimension(date)
        .group(dates)
        .round(d3.time.day.round)
        .x(d3.time.scale().domain([new Date(2014, 0, 5), new Date(2014, 0, 8)]).rangeRound([0, 200])),
        //.filter([new Date(2014, 0, 9), new Date(2014, 0, 12)]),

    barChart()
        .dimension(hour)
        .group(hours)
        .x(d3.scale.linear().domain([0, 24]).rangeRound([0, 10 * 24])),

    barChart()
        .dimension(id)
        .group(ids)
        .x(d3.scale.linear().domain([0, 35]).rangeRound([0, 200]))
  ];

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  var chart = d3.selectAll(".chart")
      .data(charts)
      .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

  // Render the initial lists.
  var list = d3.selectAll(".list")
      .data([flightList]);
  
  // Render the total.
  d3.selectAll("#total")
      .text(formatNumber(flight.size()));

  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    //list.each(render);
    d3.select("#active").text(formatNumber(all.value()));
  }

  // Like d3.time.format, but faster.
  function parseDate(d) {
    /*return new Date(2001,
        d.substring(0, 2) - 1,
        d.substring(2, 4),
        d.substring(4, 6),
        d.substring(6, 8));*/
    return new Date(2014,
          d.substring(0, 2) - 1,
          d.substring(3, 5),
          d.substring(11, 13),
          d.substring(14, 16),
          d.substring(17, 19));
  }

  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };

  function flightList(div) {
    var flightsByDate = nestByDate.entries(date.top(40));

    div.each(function() {
      var date = d3.select(this).selectAll(".date")
          .data(flightsByDate, function(d) { return d.key; });

      date.enter().append("div")
          .attr("class", "date")
          .append("div")
          .attr("class", "day")
          .text(function(d) { return formatDate(d.values[0].Timestamp);});

      date.exit().remove();

      var flight = date.order().selectAll(".flight")
          .data(function(d) { return d.values; }, function(d) { return d.index; });

      var flightEnter = flight.enter().append("div")
          .attr("class", "flight");

      flightEnter.append("div")
          .attr("class", "time")
          .text(function(d) { return formatTime(d.Timestamp); });

      flightEnter.append("div")
          .attr("class", "id")
          .text(function(d) { return d.id; });

      flight.exit().remove();

      flight.order();
    });
  }

  function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
        x,
        y = d3.scale.linear().range([100, 0]),
        id = barChart.id++,
        axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
      var width  = x.range()[1],
          height = y.range()[0];

      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
              .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
              .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
            gBrush.selectAll("rect").attr("height", height);
            gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }
        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
          .selectAll(".resize")
          .style("display", null);
      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));
      dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
      }

      //响应函数
      var flightsByDate = nestByDate.entries(date.top(Infinity));
      
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }
};//crossfilter