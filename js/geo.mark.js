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
//DrawFlights();
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
      .style("opacity", 1);
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
          .style("opacity", 1);  
      //动画效果
      d3.selectAll("#flight").each(function(d,i){
          var totalLength = d3.select(this).node().getTotalLength();
          var tt= 5000+i*Math.random();
          var aa=d3.select(this);

          d.timeid3d = setInterval(function(){aa.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .style("stroke", "blue")
            .style("stroke-width", 0.2)
            .style("opacity",0.5)
            .transition()
            .duration(tt/2)
            .ease("linear")//cubic//elastic//back//bounce
            .attr("stroke-dashoffset",0)
            .style("stroke", "red")
            .style("stroke-width", 2)
            .style("opacity",0.2); 
        },tt+i*10)});
    });//航线数据
  });
}
function RemoveFlights()
{
    d3.selectAll(".flight").each(function(d,i){
        clearInterval(d.timeid3d);
        d3.select(this).transition()
          .duration(2000)
          .attr("stroke-dasharray", d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength())
          .attr("stroke-dashoffset",0)
          .style("stroke", "blue")
          .style("stroke-width", 1)
          .style("opacity",0)
    });

    SVGMap.svgairport().selectAll("circle").remove();
    SVGMap.svgflights().selectAll("path").remove();
}
///////////////////////////////////////绘制热点数据/////////////////////////////////////////////////////
//绘制热图
function DrawHeatMapData(mgHeatmapdata)
{
  var config = {
    container: document.querySelector('#heatmapcanvas'),//mapdiv#heatmapcanvas
    canvas:document.getElementById("#heatmap-canvas"),
    radius:30,
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

  ////////////////////////////////////////////////////////////
  //Heatmapdata为转换后的屏幕坐标，mHeatmapdata为转换前的经纬度坐标(解析问题，执行先后问题，值会变)
  ////////////////////////////////////////////////////////////////
  var heatmapdata = JSON.parse(JSON.stringify(mgHeatmapdata));
  //console.log(mgHeatmapdata);
  //console.log(heatmapdata);

  if(isshow3d) 
  {
    projectionheat=projection;
    for (var i = 0; i < mgHeatmapdata.length; i++) {
      heatmapdata[i].x = projectionheat([mgHeatmapdata[i].x,mgHeatmapdata[i].y])[0];
      heatmapdata[i].y = projectionheat([mgHeatmapdata[i].x,mgHeatmapdata[i].y])[1];
      heatmapdata[i].value = mgHeatmapdata[i].value;
    };
  }
  else 
  {
    projectionheat=projection2;
    var i = -1, n = heatmapdata.length;
    var d = heatmapdata;
    while (++i < n) {
      heatmapdata[i].x = SVGMap.zoomMap.scale()*projectionheat([d[i].x,d[i].y])[0]+SVGMap.zoomMap.translate()[0];
      heatmapdata[i].y = SVGMap.zoomMap.scale()*projectionheat([d[i].x,d[i].y])[1]+SVGMap.zoomMap.translate()[1];
      heatmapdata[i].value = d[i].value;
    }
  }

  gheatmap.setData({
    max: 100,
    data: heatmapdata
  });
}
//绘制热点数据
function ResetHeatmapData(mHeatmapdata,projectionheat)
{
  //Heatmapdata为转换后的屏幕坐标，mHeatmapdata为转换前的经纬度坐标
  var Heatmapdata = JSON.parse(JSON.stringify(mHeatmapdata));
  var d = Heatmapdata;

  if(isshow3d) 
  {
    for (var i = 0; i < Heatmapdata.length; i++) {
      Heatmapdata[i].x = projectionheat([mHeatmapdata[i].x,mHeatmapdata[i].y])[0];
      Heatmapdata[i].y = projectionheat([mHeatmapdata[i].x,mHeatmapdata[i].y])[1];
    };
  }
  else 
  {
    var i = -1, n = Heatmapdata.length;
    while (++i < n) {
      Heatmapdata[i].x = SVGMap.zoomMap.scale()*projectionheat([d[i].x,d[i].y])[0]+SVGMap.zoomMap.translate()[0];
      Heatmapdata[i].y = SVGMap.zoomMap.scale()*projectionheat([d[i].x,d[i].y])[1]+SVGMap.zoomMap.translate()[1];
    }
  }

  gheatmap.setData({
    max: 100,
    data: Heatmapdata
  });
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