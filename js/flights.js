///////////////////////////////////////世界机场/////////////////////////////////
d3.csv("data/airports.csv",function(error, airportdata) 
{
  if (error) 
    return console.error(error);

    svgairport.selectAll("circle").data(airportdata).enter().append("circle").attr("class","airport").attr({
      cx:function(d,i){return projection2([airportdata[i][" longitude"],airportdata[i][" latitude"]])[0]},
      cy:function(d,i){return projection2([airportdata[i][" longitude"],airportdata[i][" latitude"]])[1]},
      r:function(d,i){return 1}
    })
    .style("fill", "yellow")
    .style("opacity", 0.5)
    .append("animateColor").attr(
        {
          attributeName:"fill",
          attributeType:"XML",
          from:"black",
          to:"red",
          dur:"10s",
          repeatCount:"indefinite"
        });   
  ////////////////////////////////////////航线数据////////////////////////////////
  d3.csv("data/PEK-openflights-export-2012-03-19.csv",function(error, flightsdata) 
  {
    if (error) 
    return console.error(error);
            gflightsdata=flightsdata;

    for (var i=0;i<flightsdata.length;i++) {  
      for(var j=0;j<airportdata.length;j++)
      {
        if(airportdata[j][" IATA"]==flightsdata[i]["From"])
        {
          flightsdata[i]["x1"]=airportdata[j][" longitude"];
          flightsdata[i]["y1"]=airportdata[j][" latitude"];
          continue;
        }
        if(airportdata[j][" IATA"]==flightsdata[i]["To"])
        {
          flightsdata[i]["x2"]=airportdata[j][" longitude"];
          flightsdata[i]["y2"]=airportdata[j][" latitude"];
          continue;
        }
      }
    };
    //svg绘制折线
            /*var lines = svgmaps.append("g").attr("class","flights").selectAll("line").data(flightsdata).enter().append("line").attr("class","flight");  
    lines.attr({
      x1:function(d,i){return projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[0]},
      y1:function(d,i){return projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[1]},
      x2:function(d,i){return projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[0]},
      y2:function(d,i){return projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[1]}
    })
    .style("stroke", "#0aa")
    .style("stroke-width", 0.2)
    .on("mouseover",function(d,i){d3.select(this).style("stroke","red").style("stroke-width", 0.5);lableInfo(d)})
          .on("mouseout",function(d,i){d3.select(this).transition().duration(1000).style("stroke", "#0aa").style("stroke-width", 0.2);})
          .append("animateTransform").attr(
          {
            type:"scale",
            from:"1 1",
            to:"2 3",
            begin:"0s",
            dur:"10s",
            repeatCount:"indefinite"
          });*/
    
    //////////////////////////////////////////d3绘制线///////////////////////////////////////////////////
    //动态的线  
    for (var i = 0; i < flightsdata.length; i++) {
      var x1=projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[0];
      var y1=projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[1];
      var x2=projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[0];
      var y2=projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[1];
      var x=(x1+x2)/2;//-flightsdata[i]["Distance"]*Math.cos(15/90)*0.01;
      var y=(y1+y2)/2-flightsdata[i]["Distance"]*Math.sin(15/90)*0.3;

      var lineData=[{"x":x1,"y":y1},{"x":x,"y":y},{"x":x2,"y":y2}];
      var lineFunction=d3.svg.line()//d3.svg.chord()?????
                .x(function(d){return d.x})
                .y(function(d){return d.y})
                .interpolate("bundle").tension(.9);//basis//bundle
      svgflights2.append("path").attr("id","flight").attr("d",lineFunction(lineData)).datum(flightsdata[i])//.attr("value",flightsdata[i])
                .style("stroke", "#0aa")
                .style("stroke-width", 0.2)
                .style("fill","none")
                .style("opacity", 0)//隐藏元素
    };
    //固定的线
    for (var i = 0; i < flightsdata.length; i++) {
      var x1=projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[0];
      var y1=projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[1];
      var x2=projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[0];
      var y2=projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[1];
      var x=(x1+x2)/2;//-flightsdata[i]["Distance"]*Math.cos(15/90)*0.01;
      var y=(y1+y2)/2-flightsdata[i]["Distance"]*Math.sin(15/90)*0.3;

      var lineData=[{"x":x1,"y":y1},{"x":x,"y":y},{"x":x2,"y":y2}];
      var lineFunction=d3.svg.line()//d3.svg.chord()?????
                .x(function(d){return d.x})
                .y(function(d){return d.y})
                .interpolate("bundle").tension(.9);//basis//bundle
      svgflights1.append("path").attr("id","flight").attr("d",lineFunction(lineData)).datum(flightsdata[i])//.attr("value",flightsdata[i])
                .style("stroke", "#0aa")
                .style("stroke-width", 0.2)
                .style("fill","none")
                .on("mouseover",function(d,i){d3.select(this).style("stroke","red").style("stroke-width", 2);lableInfoshow(d);})
                .on("mouseout",function(d,i){d3.select(this).transition().duration(1000).style("stroke", "#0aa").style("stroke-width", 0.2);lableInfohide()});
    };              
    //////////////////////////////////////////d3绘制线//////////////////////////////////////////////////    
    ///////////////////////////////////////时间轴操作//////////////////////////////////////////////////////
    var Durationmax=d3.max(gflightsdata, function(d) {return parseInt(d["Distance"]);});
    var Durationmin=d3.min(gflightsdata, function(d) {return parseInt(d["Distance"]);});

      //1、设置svg
    var timetoolsvg = d3.select("#timetool").append("svg").attr("width",width).attr("height","100%");
     
    //2、设置时间轴x    
    //x轴刻画          
    var x = d3.scale.linear().range([0, width]).domain([Durationmin,Durationmax]);
    //绘制x轴（d3.svg.axis()）
    timetoolsvg.append("g").attr("class", "x axis").call(d3.svg.axis().scale(x).orient("bottom").ticks(20,d3.format(",d")));
    //3、设置刷子
    //刷子初始化
      var brush = d3.svg.brush().x(x).extent([1000, 1000])
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);
    //绘制刷子弧线（d3.svg.arc()）
    var arc = d3.svg.arc().outerRadius(30).startAngle(0).endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });
    //绘制刷子（d3.svg.brush()）      
    var brushg = timetoolsvg.append("g").attr("class", "brush").call(brush);
      //设置resize类
      brushg.selectAll(".resize").append("path").attr("d", arc);
      //设置rect
      brushg.selectAll("rect").attr("height", 30);
      brushstart();
      brushmove();
      timerbrush();
    //4、刷子响应函数
    function brushstart() {
      //timetoolsvg.classed("selecting", true);
    }
    function brushmove() {
        var s = brush.extent();
        //执行动作
        svgflights1.selectAll("#flight").each(function(d){
          if( (s[0] <= d["Distance"]) && (d["Distance"] <= s[1]))
          {
            var totalLength = d3.select(this).node().getTotalLength();
            d3.select(this).style("stroke","yellow").style("stroke-width", 5).style("opacity", 0.1);
          }
          else
          {
            d3.select(this).style("stroke", "#0aa").style("stroke-width", 0.2);
          }
        });
    }
    function brushend() {
      //timetoolsvg.classed("selecting", !d3.event.target.empty());
    }
    function timerbrush()
    {
      setInterval(function(){
        var s = brush.extent();
          //执行动作
          svgflights2.selectAll("#flight").each(function(d){
            if( (s[0] <= d["Distance"]) && (d["Distance"] <= s[1]))
            {
              var totalLength = d3.select(this).node().getTotalLength();
              d3.select(this).attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .style("stroke", "red")
                .style("stroke-width", 4.9)
                .style("opacity", 0.2)
                .transition()
                //.delay(1000000/d["Distance"])
                .duration(2000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);  
            }
            else
            {
              d3.select(this).style("stroke", "#0aa").style("stroke-width", 0.2);
            }
            //d3.select(this).classed("selected", function(d) { return s[0] <= d["Distance"] && d["Distance"] <= s[1];});
          });
      },3000);
    }
    ///////////////////////////////////////////时间轴操作////////////////////////////////////////        
  });//航线数据
});//世界机场



///////////////////////////////////////////lableInfo固定位置显示信息///////////////////////////////////
var lableInfoshow =function lableInfo(d){
  d3.select("#lableInfo").style("visibility", "visible");
  var content="";
    content += "<center>" + d.Flight_Number + "</center>";
    content += "<br>";  
    content += " "+" Distance:"+d.Distance;
    content += "<br>";  
    content += " Duration:"+d.Duration; 
    content += "<br>";  
    content += " Plane:"+d.Plane;
    content += "<br>";  
    content += " Note:"+d.Note; 
    content += "<br>";  
    content += " from " + d.From + " to " +d.To;
    content += "<br>";  
    content += " From_OID " + d.From_OID + " To_OID " +d.To_OID;
         d3.select("#lableInfo").html(content);
}
var lableInfohide = function lableInfohide(){
  d3.select("#lableInfo").style("visibility", "hidden");
} 
///////////////////////////////////////////lableInfo固定位置显示信息///////////////////////////////////