/*var d4 =(function() {

  var tooo = function(){console.log("alternative")};

  return{tooo:tooo};
})();*/
!function() {
  var dthree = {
    version: "1.1.1"
  };

  dthree.tool={};
  dthree.event={};
  //平行坐标
  dthree.tool.DarwParallel = function(selection,data,w,h)
  {
    var marginpd = {top: 30, right: 10, bottom: 10, left: 10},
        widthpd = w - marginpd.right - marginpd.left,
        heightpd = h - marginpd.top - marginpd.bottom;

      var xpd = d3.scale.ordinal()
          .rangePoints([0, widthpd], 1);

      var ypd = {};

      var linepd = d3.svg.line(),
          axispd = d3.svg.axis().orient("left"),
          backgroundpd,
          foregroundpd;


      var svg =selection.append("svg")
                        .attr("width", widthpd + marginpd.right + marginpd.left)
                        .attr("height", heightpd + marginpd.top + marginpd.bottom)
                        .append("g")
                        .attr("transform", "translate(" + marginpd.left + "," + marginpd.top + ")");

      // Extract the list of dimensions and create a scale for each.
      xpd.domain(dimensions = d3.keys(data[0]).filter(function(d) {
        return d != "name" && (ypd[d] = d3.scale.linear()
            .domain(d3.extent(data, function(p) { return +p[d]; }))
            .range([heightpd, 0]));
      }));

      // Add grey background lines for context.
      backgroundpd = svg.append("g")
          .attr("class", "backgroundpd")
          .selectAll("path")
          .data(data)
          .enter().append("path")
          .attr("d", pathpd);

      // Add blue foreground lines for focus.
      foregroundpd = svg.append("g")
          .attr("class", "foregroundpd")
          .selectAll("path")
          .data(data)
          .enter().append("path")
          .attr("d", pathpd)
          .on("mouseover",function(d,i){tipshow(d.name);})
          .on("mouseout",function(){tiphide();});

      // Add a group element for each dimension.
      var gpd = svg.selectAll(".dimensionpd")
          .data(dimensions)
          .enter().append("g")
          .attr("class", "dimensionpd")
          .attr("transform", function(d) { return "translate(" + xpd(d) + ")"; });

      // Add an axis and title.
      gpd.append("g")
          .attr("class", "axispd")
          .each(function(d) { d3.select(this).call(axispd.scale(ypd[d])); })
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", -9)
          .text(String);

      // Add and store a brush for each axis.
      gpd.append("g")
          .attr("class", "brushpd")
          .each(function(d) { d3.select(this).call(ypd[d].brushpd = d3.svg.brush().y(ypd[d]).on("brush", brushpd)); })
          .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);

      // Returns the path for a given data point.
      function pathpd(d) {
        return linepd(dimensions.map(function(p) { return [xpd(p), ypd[p](d[p])]; }));
      }

      // Handles a brush event, toggling the display of foreground lines.
      function brushpd() {
        var actives = dimensions.filter(function(p) { return !ypd[p].brushpd.empty(); }),
            extents = actives.map(function(p) { return ypd[p].brushpd.extent(); });
        foregroundpd.style("display", function(d) {
          return actives.every(function(p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
          }) ? null : "none";
        });
      }
  }
  //绘制坐标轴
  dthree.tool.DrawAxis = function(svg,width,height)
  {
    var svglinetool =svg
      .attr("width", width)
      .attr("height", height)
      .append("g").attr("class","line");

    var data = d3.range(100).map(function(){return Math.random()*100})
    var scalex = d3.scale.linear().domain([0, 99]).range([30,width]);
    var scaley = d3.scale.linear().domain([0, 99]).range([height, 10]);

    var x_axis=d3.svg.axis().scale(scalex),
        y_axis=d3.svg.axis().scale(scaley).orient("left").ticks(10).tickFormat(d3.format("s"));

    svglinetool.append("g").attr("class","axis").call(x_axis).attr("transform","translate(0,"+(height-20)+")");
    svglinetool.append("g").attr("class","axis").call(y_axis).attr("transform","translate(30,0)").append("text").text("测试").attr("transform","translate(15,10),rotate(-90)").attr("text-anchor","end");

    /*var line = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d,i) {return scalex(i);})
      .y(function(d) {return scaley(d);})*/

    var line = d3.svg.area()
      .x(function(d,i) {return scalex(i);})
      .y0(height-20)
      .y1(function(d) {return scaley(d);})
      .interpolate("cardinal");


    var pathsvgline = svglinetool.append("path")
      .attr("d", line(data))
      .attr("stroke", "steelblue")
      .attr("stroke-width", "2")
      .attr("fill", "steelblue");

    var totalLength = pathsvgline.node().getTotalLength();

    pathsvgline
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

    svglinetool.on("click", function(){
      pathsvgline      
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", totalLength);
    })
  }
  //Sunburst
  dthree.tool.DrawSunburst = function (svg,w,h,r,x,y,data) {
    var arc = d3.svg.arc()
                .startAngle(function(d) { return d.x; })
                .endAngle(function(d) { return d.x + d.dx; })
                .innerRadius(function(d) { return d.y; })
                .outerRadius(function(d) { return d.y + d.dy; });

    var svg1=svg.attr("width", w)
         .attr("height", h)
         .append("svg:g").attr("id","svgsun")
         .attr("transform", "translate(" + x + "," + y + ")");

      var partition = d3.layout.partition()
          .size([2 * Math.PI, r])
          .value(function(d) { return d.size; });

      d3.json("./data/relations.json", function(root) {
      var  path = svg1.data([root]).selectAll("path")
            .data(partition.nodes)
            .enter().append("svg:path")
            .attr("d", arc)
            .style("fill", function(d) { return color2((d.children ? d : d.parent).name); })
            .style("stroke-width",0.5)
            .on("click", magnify)
            .on("mouseover",function(d){tipshow(d.name);})
            .on("mouseout",function(){tiphide();})
            .each(stash);
      
      // Distort the specified node to 80% of its parent.
      function magnify(node) {
        if (parent = node.parent) {
          var parent,
              x = parent.x,
              k = .8;
          parent.children.forEach(function(sibling) {
            x += reposition(sibling, x, sibling === node
                ? parent.dx * k / node.value
                : parent.dx * (1 - k) / (parent.value - node.value));
          });
        } else {
          reposition(node, 0, node.dx / node.value);
        }

        path.transition()
            .duration(750)
            .attrTween("d", arcTween);
      }

      // Recursively reposition the node at position x with scale k.
      function reposition(node, x, k) {
        node.x = x;
        if (node.children && (n = node.children.length)) {
          var i = -1, n;
          while (++i < n) x += reposition(node.children[i], x, k);
        }
        return node.dx = node.value * k;
      }

      // Stash the old values for transition.
      function stash(d) {
        d.x0 = d.x;
        d.dx0 = d.dx;
      }

      // Interpolate the arcs in data space.
      function arcTween(a) {
        var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
        return function(t) {
          var b = i(t);
          a.x0 = b.x;
          a.dx0 = b.dx;
          return arc(b);
        };
      }
    });
  }
  //RadialTeee
  dthree.tool.DrawRadialTree = function(selection,data,w,h)
  {
    var zoomrelations = d3.behavior.zoom()
          .scaleExtent([0, 8])//设置缩放范围
          .on("zoom", zoomedrelations);
    function zoomedrelations() {
          d3.select("#RadialTeee").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
    d3.select("#relations").call(zoomrelations);

    var tree = d3.layout.tree()
        .size([360, w / 2])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = selection.append("svg");
    var svgRadialTree = svg
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("id","RadialTeee")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
    var i = 0;

    update(data);

    function update(source)
    {
      var nodes = tree.nodes(data),
          links = tree.links(nodes);

      var link = svgRadialTree.selectAll(".link")
          .data(links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);
      var node =svgRadialTree.selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); });

      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "rotate(" + (source.x - 90) + ")translate(" + source.y + ")"; })
          .on("mouseover",function(d){tipshow(d.name);})
          .on("mouseout",function(){tiphide();})
          .on("click",function(d){treeclick(d);});

      nodeEnter.append("circle")
          .attr("r", 4.5);


      nodeEnter.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
          .text(function(d) { return d.name; });

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(750)
        .attr("transform", function(d) { return"rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

      nodeUpdate.select("circle")
        .attr("r",4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(750)
        .attr("transform", function(d) { return "rotate(" + (source.x - 90) + ")translate(" + source.y + ")";  })
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
        });

      // Transition links to their new position.
      link.transition()
        .duration(750)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(750)
        .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
      });
    }

    function treeclick(d)
    {
      if (d.children) {
      d._children = d.children;
      d.children = null;
      } else {
      d.children = d._children;
      d._children = null;
      }
      update(d);
    }

    d3.select(self.frameElement).style("height", h - 150 + "px");  
  }   
  //HeatMap
  dthree.tool.DrawHeatMap = function(selection,data,w,h)
  {
    var margin = {top: 20, right: 90, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
    var parseDate = d3.time.format("%Y-%m-%d").parse,
        formatDate = d3.time.format("%b %d");
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        z = d3.scale.linear().range(["white", "steelblue"]);
    // The size of the buckets in the CSV data file.
    // This could be inferred from the data if it weren't sparse.
    var xStep = 864e5,
        yStep = 100;
    var svgheatmap = selection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Coerce the CSV data to the appropriate types.
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.bucket = +d.bucket;
      d.count = +d.count;
    });
    // Compute the scale domains.
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.bucket; }));
    z.domain([0, d3.max(data, function(d) { return d.count; })]);
    // Extend the x- and y-domain to fit the last bucket.
    // For example, the y-bucket 3200 corresponds to values [3200, 3300].
    x.domain([x.domain()[0], + x.domain()[1] + xStep]);
    y.domain([y.domain()[0], y.domain()[1] + yStep]);
    // Display the tiles for each non-zero bucket.
    // See http://bl.ocks.org/3074470 for an alternative implementation.
    svgheatmap.selectAll(".tile")
        .data(data)
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.bucket + yStep);})
        .attr("width", x(xStep) - x(0))
        .attr("height", y(0) - y(yStep))
        .style("fill", function(d) { return z(d.count); })
        .on("mouseover",function(d){tipshow(d);})
        .on("mouseout",function(){tiphide();});
    // Add a legend for the color values.
    var legend = svgheatmap.selectAll(".legend")
        .data(z.ticks(6).slice(1).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", z);
    legend.append("text")
        .attr("x", 26)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(String);
    svgheatmap.append("text")
        .attr("class", "label")
        .attr("x", width + 20)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Count");
    // Add an x-axis with label.
    svgheatmap.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).ticks(d3.time.days).tickFormat(formatDate).orient("bottom"))
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .attr("text-anchor", "end")
        .text("Date");
    // Add a y-axis with label.
    svgheatmap.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"))
        .append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("Value");
  }
  //ForceGraph
  dthree.tool.DrawForceGraph = function (selection,data,width,height)
  {
    var fisheye = d3.fisheye.circular()
        .radius(120);

    var force = d3.layout.force()
        .size([width, height])
        .on("tick", tick);

    var svg =selection.append("svg").attr("width", width).attr("height", height);

    var link = svg.selectAll(".Forcelink"),
        node = svg.selectAll(".Forcenode");

    update();
    
    function update() {
      var nodes = flatten(data),
          links = d3.layout.tree().links(nodes);
      
      // Restart the force layout.
      force.nodes(nodes)
          .links(links)
          .start();

      // Update the links…
      link = link.data(links, function(d) { return d.target.id; });

      // Exit any old links.
      link.exit().remove();

      // Enter any new links.
      link.enter().insert("line", ".Forcenode")
          .attr("class", "Forcelink")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      // Update the nodes…
      node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

      // Exit any old nodes.
      node.exit().remove();

      // Enter any new nodes.
      node.enter().append("circle")
          .attr("class", "Forcenode")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
          .style("fill", color)
          .on("click", click)
          .on("mouseover",function(d){tipshow(d.name);})
          .on("mouseout",function(){tiphide();})
          .call(force.drag);

        svg.on("mousemove", function() {
        fisheye.focus(d3.mouse(this));

        node.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; });
            //.attr("r", function(d) { return d.fisheye.z * 4.5; });

        link.attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return d.target.fisheye.x; })
            .attr("y2", function(d) { return d.target.fisheye.y; });
      });
    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
      return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }

    // Toggle children on click.
    function click(d) {
      if (!d3.event.defaultPrevented) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update();
      }
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(data);
      return nodes;
    }
  }
  // DrawCircularheat
  dthree.tool.DrawCircularheat = function(dviID,w,h)
  {
    var data = [];
    for(var i=0; i<168; i++) data[i] = Math.random();

    var chart = circularHeatChart()
        .innerRadius(10)
        .segmentHeight(13)
        .range(["white", "steelblue"])
        .radialLabels(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        .segmentLabels(["Midnight", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am",
        "11am", "Midday", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]);

    d3.select(dviID)
        .selectAll('svg')
        .data([data])
        .enter()
        .append('svg')
        //.attr("width",w)
        //.attr("height",h)
        .style('width', w+'px')
        .style('height', h+'px')  
        .call(chart);
        /* Add a mouseover event */
    d3.selectAll(dviID+" path").on('mouseover', function(d,i) {
        //var d = d3.select(this).data()[0];
        tipshow(d);
        //d3.select("#info").text(d.title + ' has value ' + d.value);
    }).on("mouseout",function(){tiphide();});
  }
  //DrawBarChart
  dthree.tool.DrawBarChart = function(divID,w,h)
  {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/databarchart.csv", function(error, data) {
      if (error) throw error;

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

      data.forEach(function(d) {
        var y0 = 0;
        d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.ages[d.ages.length - 1].y1;
      });

      data.sort(function(a, b) { return b.total - a.total; });

      x.domain(data.map(function(d) { return d.State; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Population");

      var state = svg.selectAll(".state")
          .data(data)
          .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

      state.selectAll("rect")
          .data(function(d) { return d.ages; })
          .enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .style("fill", function(d) { return color(d.name); });

      var legend = svg.selectAll(".legend")
          .data(color.domain().slice().reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
    });
  }
  //DrawCircleChart
  dthree.tool.DrawCircleChart = function(divID,w,h)
  {
    var svg = d3.select(divID)
    .append("svg")
    .attr("width",w)
    .attr("height",h)
    .append("g")
    .attr("class","CircleChart");
    

    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");

    var width = w,
        height = h,
      radius = Math.min(width, height) / 2;

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    var arc = d3.svg.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d){ return d.data.label; };

    var color = d3.scale.ordinal()
      .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    function randomData (){
      var labels = color.domain();
      return labels.map(function(label){
        return { label: label, value: Math.random() }
      });
    }

    change(randomData());

    d3.select(".randomize")
      .on("click", function(){
        change(randomData());
      });


    function change(data) {

      /* ------- PIE SLICES -------*/
      var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), key);

      slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

      slice   
        .transition().duration(1000)
        .attrTween("d", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            return arc(interpolate(t));
          };
        })

      slice.exit()
        .remove();

      /* ------- TEXT LABELS -------*/

      var text = svg.select(".labels").selectAll("text")
        .data(pie(data), key);

      text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
          return d.data.label;
        });
      
      function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      text.transition().duration(1000)
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
          };
        });

      text.exit()
        .remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/

      var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), key);
      
      polyline.enter()
        .append("polyline");

      polyline.transition().duration(1000)
        .attrTween("points", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };      
        });
      
      polyline.exit()
        .remove();
    };
  }
  //DrawStackedBarChart
  dthree.tool.DrawStackedBarChart = function(divID,w,h)
  {
    var margin = {top: 50, right: 20, bottom: 10, left: 65},
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .3);

    var x = d3.scale.linear()
        .rangeRound([0, width]);

    var color = d3.scale.ordinal()
        .range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

      d3.csv("data/raw_data.csv", function(error, data) {

      data.forEach(function(d) {
        // calc percentages
        d["Strongly disagree"] = +d[1]*100/d.N;
        d["Disagree"] = +d[2]*100/d.N;
        d["Neither agree nor disagree"] = +d[3]*100/d.N;
        d["Agree"] = +d[4]*100/d.N;
        d["Strongly agree"] = +d[5]*100/d.N;
        var x0 = -1*(d["Neither agree nor disagree"]/2+d["Disagree"]+d["Strongly disagree"]);
        var idx = 0;
        d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
      });

      var min_val = d3.min(data, function(d) {
              return d.boxes["0"].x0;
              });

      var max_val = d3.max(data, function(d) {
              return d.boxes["4"].x1;
              });

      x.domain([min_val, max_val]).nice();
      y.domain(data.map(function(d) { return d.Question; }));

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)

      var vakken = svg.selectAll(".question")
          .data(data)
        .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(0," + y(d.Question) + ")"; });

      var bars = vakken.selectAll("rect")
          .data(function(d) { return d.boxes; })
        .enter().append("g").attr("class", "subbar");

      bars.append("rect")
          .attr("height", y.rangeBand())
          .attr("x", function(d) { return x(d.x0); })
          .attr("width", function(d) { return x(d.x1) - x(d.x0); })
          .style("fill", function(d) { return color(d.name); });

      bars.append("text")
          .attr("x", function(d) { return x(d.x0); })
          .attr("y", y.rangeBand()/2)
          .attr("dy", "0.5em")
          .attr("dx", "0.5em")
          .style("font" ,"10px sans-serif")
          .style("text-anchor", "begin")
          .text(function(d) { return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : "" });

      vakken.insert("rect",":first-child")
          .attr("height", y.rangeBand())
          .attr("x", "1")
          .attr("width", width)
          .attr("fill-opacity", "0.5")
          .style("fill", "#F5F5F5")
          .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });

      svg.append("g")
          .attr("class", "y axis")
      .append("line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y2", height);

      var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
      // this is not nice, we should calculate the bounding box and use that
      var legend_tabs = [0, 120, 200, 375, 450];
      var legend = startp.selectAll(".legend")
          .data(color.domain().slice())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });

      legend.append("rect")
          .attr("x", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", 22)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "begin")
          .style("font" ,"10px sans-serif")
          .text(function(d) { return d; });

      d3.selectAll(".axis path")
          .style("fill", "none")
          .style("stroke", "#000")
          .style("shape-rendering", "crispEdges")

      d3.selectAll(".axis line")
          .style("fill", "none")
          .style("stroke", "#000")
          .style("shape-rendering", "crispEdges")

      var movesize = width/2 - startp.node().getBBox().width/2;
      d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");
    });
  }
  //DrawMultiLine
  dthree.tool.DrawMultiLine = function (divID,w,h)
  {
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); });

    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data/datamultline.tsv", function(error, data) {
      if (error) throw error;

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      data.forEach(function(d) {
        d.date = parseDate(d.date);
      });

      var cities = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, temperature: +d[name]};
          })
        };
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));

      y.domain([
        d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
        d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
      ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Temperature (ºF)");

      var city = svg.selectAll(".city")
          .data(cities)
          .enter().append("g")
          .attr("class", "city");

      city.append("path")
          .attr("class", "linemultiline")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

      city.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
    });
  }
  //DrawScatterPlot
  dthree.tool.DrawScatterPlot = function(divID,w,h)
  {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data/datascatter.tsv", function(error, data) {
      if (error) throw error;

      data.forEach(function(d) {
        d.sepalLength = +d.sepalLength;
        d.sepalWidth = +d.sepalWidth;
      });

      x.domain(d3.extent(data, function(d) { return d.sepalWidth; })).nice();
      y.domain(d3.extent(data, function(d) { return d.sepalLength; })).nice();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Sepal Width (cm)");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Sepal Length (cm)")

      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", function(d) { return x(d.sepalWidth); })
          .attr("cy", function(d) { return y(d.sepalLength); })
          .style("fill", function(d) { return color(d.species); });

      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

    });
  }
  //Draw3DDonut
  !function(){
    var Donut3D={};
    
    function pieTop(d, rx, ry, ir ){
      if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
      var sx = rx*Math.cos(d.startAngle),
        sy = ry*Math.sin(d.startAngle),
        ex = rx*Math.cos(d.endAngle),
        ey = ry*Math.sin(d.endAngle);
        
      var ret =[];
      ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
      ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
      return ret.join(" ");
    }

    function pieOuter(d, rx, ry, h ){
      var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
      var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
      
      var sx = rx*Math.cos(startAngle),
        sy = ry*Math.sin(startAngle),
        ex = rx*Math.cos(endAngle),
        ey = ry*Math.sin(endAngle);
        
        var ret =[];
        ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
        return ret.join(" ");
    }

    function pieInner(d, rx, ry, h, ir ){
      var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
      var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
      
      var sx = ir*rx*Math.cos(startAngle),
        sy = ir*ry*Math.sin(startAngle),
        ex = ir*rx*Math.cos(endAngle),
        ey = ir*ry*Math.sin(endAngle);

        var ret =[];
        ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
        return ret.join(" ");
    }

    function getPercent(d){
      return (d.endAngle-d.startAngle > 0.2 ? 
          Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
    } 
    
    Donut3D.transition = function(id, data, rx, ry, h, ir){
      function arcTweenInner(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return pieInner(i(t), rx+0.5, ry+0.5, h, ir);  };
      }
      function arcTweenTop(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return pieTop(i(t), rx, ry, ir);  };
      }
      function arcTweenOuter(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return pieOuter(i(t), rx-.5, ry-.5, h);  };
      }
      function textTweenX(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return 0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
      }
      function textTweenY(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return 0.6*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
      }
      
      var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
      
      d3.select("#"+id).selectAll(".innerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenInner); 
        
      d3.select("#"+id).selectAll(".topSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenTop); 
        
      d3.select("#"+id).selectAll(".outerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenOuter);  
        
      d3.select("#"+id).selectAll(".percent").data(_data).transition().duration(750)
        .attrTween("x",textTweenX).attrTween("y",textTweenY).text(getPercent);  
    }
    
    Donut3D.draw=function(id, data, x /*center x*/, y/*center y*/, 
        rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){
    
      var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
      
      var slices = d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
        .attr("class", "slices");
        
      slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
        .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
        .each(function(d){this._current=d;});
      
      slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
        .style("fill", function(d) { return d.data.color; })
        .style("stroke", function(d) { return d.data.color; })
        .attr("d",function(d){ return pieTop(d, rx, ry, ir);})
        .each(function(d){this._current=d;});
      
      slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
        .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
        .each(function(d){this._current=d;});

      slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
        .attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
        .attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
        .text(getPercent).each(function(d){this._current=d;});        
    }
    
    this.Donut3D = Donut3D;
  }();
  dthree.tool.Draw3DDonut = function(divID,w,h)
  {
    var salesData=[
      {label:"Basic", color:"#3366CC"},
      {label:"Plus", color:"#DC3912"},
      {label:"Lite", color:"#FF9900"},
      {label:"Elite", color:"#109618"},
      {label:"Delux", color:"#990099"}
    ];

    var svg = d3.select(divID).append("svg").attr("width",w).attr("height",h);

    svg.append("g").attr("id","salesDonut");
    svg.append("g").attr("id","quotesDonut");

    Donut3D.draw("salesDonut", randomData(), w*0.5, h*0.5-10, w*0.4, h*0.4, h*0.1, 0.3);
    //Donut3D.draw("quotesDonut", randomData(), w*0.75, h*0.5, 130, 100, 30, 0);
      
    function changeData(){
      Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
      //Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
    }

    function randomData(){
      return salesData.map(function(d){ 
        return {label:d.label, value:1000*Math.random(), color:d.color};});
    }
  }
  //DrawTreeMap
  dthree.tool.DrawTreeMap = function(selection,data,w,h)
  {
    var x = d3.scale.linear().range([0, w]),
      y = d3.scale.linear().range([0, h]),
      color = d3.scale.category20c(),
      root,
      node;
      
    var treemap = d3.layout.treemap()
        .round(false)
        .size([w, h])
        .sticky(true)
        .value(function(d) { return d.size; });

    var svg = selection.append("div")
        .attr("class", "chart")
        .style("width", w + "px")
        .style("height", h + "px")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(.5,.5)");

  
    node = root = data;

    var nodes = treemap.nodes(root)
        .filter(function(d) { return !d.children; });

    var cell = svg.selectAll("g")
        .data(nodes)
        .enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

    cell.append("svg:rect")
        .attr("width", function(d) { return d.dx - 1; })
        .attr("height", function(d) { return d.dy - 1; })
        .style("fill", function(d) { return color(d.parent.name); });

    cell.append("svg:text")
        .attr("x", function(d) { return d.dx / 2; })
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("opacity", 0);//function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

    d3.select(window).on("click", function() { zoom(root); });

    d3.select("select").on("change", function() {
      treemap.value(this.value == "size" ? size : count).nodes(root);
      zoom(node);
    });

    function size(d) {
      return d.size;
    }

    function count(d) {
      return 1;
    }

    function zoom(d) {
      var kx = w / d.dx, ky = h / d.dy;
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      var t = svg.selectAll("g.cell").transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

      t.select("rect")
          .attr("width", function(d) { return kx * d.dx - 1; })
          .attr("height", function(d) { return ky * d.dy - 1; })

      t.select("text")
          .attr("x", function(d) { return kx * d.dx / 2; })
          .attr("y", function(d) { return ky * d.dy / 2; })
          .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

      node = d;
      d3.event.stopPropagation();
    }
  }
  //DrawAreaTime
  dthree.tool.DrawAreaTime = function(divID,w,h)
  {
    var margin = {top: 10, right: 10, bottom: w*0.3, left: 40},
      margin2 = {top: w*0.75, right: 10, bottom: 20, left: 40},
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom,
      height2 = h - margin2.top - margin2.bottom;

    var parseDate = d3.time.format("%b %Y").parse;

    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.price); });

    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x2(d.date); })
        .y0(height2)
        .y1(function(d) { return y2(d.price); });

    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv("data/sp500.csv", type, function(error, data) {
      x.domain(d3.extent(data.map(function(d) { return d.date; })));
      y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      focus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);

      focus.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      focus.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      context.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area2);

      context.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

      context.append("g")
          .attr("class", "x brush")
          .call(brush)
          .selectAll("rect")
          .attr("y", -6)
          .attr("height", height2 + 8);
    });

    function brushed() {
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      focus.select(".area").attr("d", area);
      focus.select(".x.axis").call(xAxis);
    }

    function type(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
    }
  }
  //DrawCirclePacking
  dthree.tool.DrawCirclePacking = function(divID,w,h,r)
  {
    var x = d3.scale.linear().range([0, r]),
        y = d3.scale.linear().range([0, r]),
        node,
        root;

    var pack = d3.layout.pack()
        .size([r, r])
        .value(function(d) { return d.size; })

    var vis = d3.select(divID).insert("svg:svg", "h2")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

    d3.json("data/relations.json", function(data) {
      node = root = data;

      var nodes = pack.nodes(root);

      vis.selectAll("circle")
          .data(nodes)
          .enter().append("svg:circle")
          .attr("class", function(d) { return d.children ? "parent" : "child"; })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.r; })
          .on("click", function(d) { return zoom(node == d ? root : d); });

      vis.selectAll("text")
          .data(nodes)
          .enter().append("svg:text")
          .attr("class", function(d) { return d.children ? "parent" : "child"; })
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
          .text(function(d) { return d.name; });

      d3.select(window).on("click", function() { zoom(root); });
    });

    function zoom(d, i) {
      var k = r / d.r / 2;
      x.domain([d.x - d.r, d.x + d.r]);
      y.domain([d.y - d.r, d.y + d.r]);

      var t = vis.transition()
          .duration(d3.event.altKey ? 7500 : 750);

      t.selectAll("circle")
          .attr("cx", function(d) { return x(d.x); })
          .attr("cy", function(d) { return y(d.y); })
          .attr("r", function(d) { return k * d.r; });

      t.selectAll("text")
          .attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

      node = d;
      d3.event.stopPropagation();
    }
  }
  //DrawFlameGraph
  dthree.tool.DrawFlameGraph = function(selection,data,w,h)
  {
    var flameGraph = d3.flameGraph()
        .height(h)
        .width(w)
        .cellHeight(18)
        .tooltip(true)
        .tooltipDirection("s")
        .tooltipOffset([8, 0])
        .transitionDuration(750)
        .transitionEase('cubic-in-out')
        .title("");

      selection.datum(data).call(flameGraph);

    /*<div class="pull-right">
      <form class="form-inline" id="form">
            <a class="btn" href="javascript: clear();">Clear</a>
            <div class="form-group">
              <input type="text" class="form-control" id="term">
            </div>
            <a class="btn btn-primary" href="javascript: search();">Search</a>
      </form>
    </div>*/
    /*document.getElementById("form").addEventListener("submit", function(event){
      event.preventDefault()
      search();
    });

    function search() {
      var term = document.getElementById("term").value;
      flameGraph.search(term);
    }

    function clear() {
      document.getElementById("term").value = '';
      flameGraph.clear();
    }*/
  }
  //DrawFlameGraph
  dthree.tool.DrawWordCloud = function(svg,width,height,wordsdata)
  {
   var wordshaddle= d3.layout.cloud()
        .size([width, height])//矩形大小
        .words(wordsdata.map(function(d) {
          return {text: d, size: 10 + Math.random() * 90};
        }))
        .padding(1)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")//字体
        .fontSize(function(d) { return d.size; })
        //.fontStyle(function(d) { return d.style; })
        //.fontWeight(function(d) { return d.weight;} )
        //.text(function(d) { return d.text; })
        .on("end", draw)
        //.on("word", draw)
        //.stop()
        .start();


    function draw(words) {
      svg.attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate("+width/2+","+height/2+")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return color(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }

  }
  //this.dthree = dthree
  if (typeof define === "function" && define.amd) define(this.dthree = dthree); else if (typeof module === "object" && module.exports) module.exports = dthree; else this.dthree = dthree;
}();

/////////////////////////tooltip动态显示信息///////////////////////////////////////////
//动态位置显示
var tiptext = "no data";
var tooltipdiv = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  //.attr("id", "details")
                  //.style("visibility", "hidden");
                  .style("opacity", 1e-6);
var details = d3.select("body")
                .append("div")
                .attr("id", "details");


var tipshow = function(d) {
  //tooltipdiv.style("visibility", "visible");
  tooltipdiv.style("opacity", 1);

  tooltipdiv.html(function() {
      var tt = '<table><tr><td  style="color:#ff00ff;">' + d + '</td></tr></table>';
      return tt;
    })
    .style("left", (d3.event.pageX + 15) + "px")
    .style("top", (d3.event.pageY ) + "px");
    /*.style("left", d3.mouse(this)[0]*currentScale+currentTranslate[0] + "px")
    .style("top", d3.mouse(this)[1]*currentScale+currentTranslate[1] + 95 + "px") //头文字的间距80*/
}
var tiphide = function() {
  //tooltipdiv.style("visibility", "hidden");
  tooltipdiv.style("opacity", 1e-6);
} 
/////////////////////////tooltip动态显示信息///////////////////////////////////////////
