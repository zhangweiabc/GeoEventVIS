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
width: width of the chart in pixels. Default to 1000px.
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


/////////////////////////////////////////StreamGraph????????????????????????//////////////////////////////////////////////
/* Inspired by Lee Byron's test data generator. */
function layers(n, m) {
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return pv.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = 0;
      for (i = 0; i < 5; i++) bump(a);
      return a;
    });
}

/* Another layer generator using gamma distributions. */
function waves(n, m) {
  return pv.range(n).map(function(i) {
    return pv.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return x > 0 ? 2 * x * Math.exp(-.5 * x) : 0;
      });
    });
}

function Draweventstoryn(divId,w,h)
{
    var n = 20, // number of layers
    m = 400, // number of samples per layer
    data = layers(n, m);

     //w = document.body.clientWidth,
        //h = document.body.clientHeight,
    var x = pv.Scale.linear(0, m - 1).range(0, w),
        y = pv.Scale.linear(0, 2 * n).range(0, h);

    var vis = new pv.Panel().width(w).height(h);
    //var vis = d3.select(divId).append("svg").attr("width",w).attr("height",h);

    vis.add(pv.Layout.Stack)
        .layers(data)
        .order("inside-out")
        .offset("wiggle")
        .x(x.by(pv.index))
        .y(y)
        .layer.add(pv.Area)
        .fillStyle(pv.ramp("#aad", "#556").by(Math.random));
        //.strokeStyle(function() this.fillStyle().alpha(.5));

    vis.render();
}

/////////////////////////////////////////StreamGraph????????????????????????//////////////////////////////////////////////