//绘制目标点
//DrawPointsData();
//////////////////////////////////////绘制目标点/////////////////////////////////////////////////
function DrawPointsData()
{
  d3.json("data/points.json", function(error, root) {
    if (error) 
      return console.error(error);
      //console.log(root);

    var locations = SVGMap.svgpoints().append("g").attr("class","locations").selectAll(".location")
                .data(root.location).enter()
                //.append("a")
                //.attr("xlink:href", function(d) {
                //return "http://geocontext.svail.com:8080/gaz?req=get&q.gaz="+d.name+"&q.txt=1001&q.evd=on&t.start=20130830&t.end=20150830";})
                .append("image").attr("class","location"); 
      locations
        .attr("x",function(d){return projection2([d.log,d.lat])[0]-30;})
        .attr("y",function(d){return projection2([d.log,d.lat])[1]-30;})
        .attr("width",60)
        .attr("height",60)
        .attr("xlink:href",function(d){return d.img;})
        .attr("opacity",1)
        .on("mouseover",function(){})
        .on("mouseout",function(){})
        .on("click",function(d){
            DrawSunburst(SVGMap.svgpoints(),250,250,60,projection2([d.log,d.lat])[0],projection2([d.log,d.lat])[1],d);
        });     
  });
}//绘制目标点
//绘制标签
//DrawPointLable(gmajorcitydata);
function DrawPointLable(dataPointLable,mprojection)
{
  var biaojis = SVGMap.svgpoints().append("g").attr("class","biaojis").selectAll(".biaoji").data(dataPointLable).enter()
    .append("image").attr("class","biaoji"); 
  biaojis
    .attr("x",function(d,i){return mprojection([dataPointLable[i].x,dataPointLable[i].y])[0]-30})
    .attr("y",function(d,i){return mprojection([dataPointLable[i].x,dataPointLable[i].y])[1]-30})
    .attr("width",30)
    .attr("height",30)
    .attr("xlink:href","img/blue.png");
}
//////////////////////////////////绘制线目标数据///////////////////////////////////////////
//绘制线目标
//DrawArrowLines();
function DrawArrowLines()
{
  var peking = projection2([116.3, 39.9]);
  var guilin = projection2([110.3, 25.3]);
  var shanghai = projection2([121.4648,31.2891]);
  var guangdong = projection2([113.4668,22.8076]);
  var chongqing = projection2([107.7539,30.1904]);
  //绘制线目标
  SVGMap.svglines().append("line")
          .attr("class","routeline")
          .attr("x1",shanghai[0])
          .attr("y1",shanghai[1])
          .attr("x2",peking[0])
          .attr("y2",peking[1])
          .attr("marker-end","url(#arrow)")
          .attr("marker-start","url(#startPoint)"); 
  SVGMap.svglines().append("line")
          .attr("class","routeline")
          .attr("x1",shanghai[0])
          .attr("y1",shanghai[1])
          .attr("x2",guangdong[0])
          .attr("y2",guangdong[1])
          .attr("marker-end","url(#arrow)")
          .attr("marker-start","url(#startPoint)"); 
  SVGMap.svglines().append("line")
          .attr("class","routeline")
          .attr("x1",shanghai[0])
          .attr("y1",shanghai[1])
          .attr("x2",chongqing[0])
          .attr("y2",chongqing[1])
          .attr("marker-end","url(#arrow)")
          .attr("marker-start","url(#startPoint)"); 
}//绘制线目标数据
////////////////////////////////////////////绘制机场数据///////////////////////////////////////////
DrawFlights();
function DrawFlights()
{
  d3.csv("data/airports.csv",function(error, airportdata) 
  {
    if (error) 
      return console.error(error);

      SVGMap.svgairport().selectAll("circle").data(airportdata).enter().append("circle").attr("id","airport").attr("class","airport").attr({
          cx: function(d,i){return projection2([airportdata[i][" longitude"],airportdata[i][" latitude"]])[0]},
          cy: function(d,i){return projection2([airportdata[i][" longitude"],airportdata[i][" latitude"]])[1]},
          r : function(d,i){return 1}
      })
      .style("fill", "yellow")
      .style("opacity", 0);
    ////////////////////////////////////////航线数据////////////////////////////////
    d3.csv("data/PEK-openflights-export-2012-03-19.csv",function(error, flightsdata) 
    {
      if (error) 
          return console.error(error);
      var links=[];

      for (var i=0;i<flightsdata.length;i++) {        
        for(var j=0;j<airportdata.length;j++)
        {
          if(airportdata[j][" IATA"]==flightsdata[i]["From"])
          {
            flightsdata[i]["x1"]=airportdata[j][" longitude"];
            flightsdata[i]["y1"]=airportdata[j][" latitude"];
          }
          if(airportdata[j][" IATA"]==flightsdata[i]["To"])
          {
            flightsdata[i]["x2"]=airportdata[j][" longitude"];
            flightsdata[i]["y2"]=airportdata[j][" latitude"];
          }

        }
        links.push({
              source: [flightsdata[i]["x1"],flightsdata[i]["y1"]],
              target: [flightsdata[i]["x2"],flightsdata[i]["y2"]]
          })  ;
        
      };
      SVGMap.svgflights().selectAll("path")
          .data(links)
          .enter().append("path").attr("id","flight").attr("class","flight")
          .style("fill","#0aa")
          .style("fill-opacity",0)
          .style("stroke", "blue")
          .style("stroke-width", 0.2)
          .attr("d", function(d) { return path2(arc(d));})
          .style("opacity", 0);  
    });//航线数据
  });
}
function RemoveFlights()
{
    svgairport.selectAll("#flight").exit().remove();
    svgflights1.selectAll("#airport").exit().remove();
}
///////////////////////////////////////绘制热点数据/////////////////////////////////////////////////////
function DrawHeatMapData(mgHeatmapdata)
{
  var config = {
    container: document.querySelector('#heatmapcanvas'),
    radius:45,
    maxOpacity:0.5,
    minOpacity:0,
    blur:0.75,
    gradient: {
      // enter n keys between 0 and 1 here
      // for gradient color customization
      '.5': 'blue',
      '.8': 'red',
      '.95': 'white'
    }
  }
  gheatmap = h337.create(config);

  var gHeatmapdata = JSON.parse(JSON.stringify(mgHeatmapdata));

  for (var i = 0; i < mgHeatmapdata.length; i++) {
    gHeatmapdata[i].x = projection2([mgHeatmapdata[i].x,mgHeatmapdata[i].y])[0];
    gHeatmapdata[i].y = projection2([mgHeatmapdata[i].x,mgHeatmapdata[i].y])[1];
    gHeatmapdata[i].value = mgHeatmapdata[i].value;
  };

  gheatmap.setData({
    max: 100,
    data: gHeatmapdata
  });

  var gcanvas = d3.selectAll(".heatmap-canvas")
    .call(d3.behavior.zoom().x(xScalezoom).y(yScalezoom).scaleExtent([1, 20])
    .on("zoom", zoomed))
    .node().getContext("2d");
}//绘制热点数据
function ResetHeatmapData(mHeatmapdata)
{
  var i = -1, n = mHeatmapdata.length, d;
    while (++i < n) {
      d  = mHeatmapdata[i];
      mHeatmapdata[i].x  = xScalezoom(d.x);
      mHeatmapdata[i].y = yScalezoom(d.y);
  }
  gheatmap.setData({
    max: 100,
    data: mHeatmapdata
  });
  //gcanvas.translate(d3.event.translate[0], d3.event.translate[1]);
  //gcanvas.scale(d3.event.scale, d3.event.scale);
  gHeatmapdata=mHeatmapdata;
}
//////////////////////////////////绘制3DMap（Canvase）///////////////////////////////////////////
//Draw3DMapCanvas(800);
function Draw3DMapCanvas(diameter)
{
  //设置3D画布Canvas
  var global3DCanvs = d3.select("#global3Ddiv").selectAll("canvas")
                        .data(d3.range(1)).enter()
                        .append("canvas")
                        .attr("width", diameter)
                        .attr("height", diameter);

  var radius = diameter*1 >> 1,
      velocity = .01,
      then = Date.now();

  d3.json("data/mapdata/world-110m.json", function(error, world) {
    if (error) throw error;

    var land = topojson.feature(world, world.objects.land),
        globe = {type: "Sphere"};

    d3.timer(function() {
      var angle = velocity * (Date.now() - then);
      global3DCanvs.each(function(i) {
            var rotate = [0, 0, 0], context = this.getContext("2d");
            rotate[i] = angle, projection.rotate(rotate);
            context.clearRect(0, 0, diameter, diameter);
            context.beginPath(), path.context(context)(land), context.fill();
            context.beginPath(), path(globe), context.stroke();
       });
    });
  });
}
/////////////////////////////////////////////////////////////////////////////