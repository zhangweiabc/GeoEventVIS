/////////////////////////////////////创建toolpan工具//////////////////////////////
d3.select("#pantool").append("g")
  .append("input")
  .attr("id","ptbuttonQuantu")
  .attr("type","button")
  .attr("value","全图")
  .on("click",function(){});

var marginsl = {top: 20, right: 10, bottom: 20, left: 10},
    widthsl = 100 - marginsl.left - marginsl.right,
    heightsl = 200 - marginsl.bottom - marginsl.top;

var ysl = d3.scale.linear()
    .domain([1, 20])
    .range([heightsl,0])
    .clamp(true);

var brushsl = d3.svg.brush()
    .y(ysl)
    .extent([0, 0])
    .on("brush", brushedsl);

var svgsl = d3.select("#pantool").append("svg")
    .attr("width", widthsl + marginsl.left + marginsl.right)
    .attr("height", heightsl + marginsl.top + marginsl.bottom)
    .append("g")
    .attr("transform", "translate(" + marginsl.left + "," + marginsl.top + ")");

svgsl.append("g")
    .attr("class", "axissl")
    .attr("transform", "translate("+ marginsl.left +",0)")
    .call(d3.svg.axis()
            .scale(ysl)
            .orient("left")
            //.tickFormat(function(d) { return d ; })
            .tickFormat("")
            .tickSize(0)
            .tickPadding(5))
    .select(".domain")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halosl");

var slidersl = svgsl.append("g")
    .attr("class", "slidersl")
    .call(brushsl);

slidersl.selectAll(".extent,.resize")
    .remove();

slidersl.select(".background")
    .attr("height", heightsl);

var handlesl = slidersl.append("circle")
    .attr("class", "handlesl")
    .attr("transform", "translate("+ marginsl.left +",0)")
    .attr("r", 8);

slidersl.call(brushsl.event)
    .transition() // gratuitous intro!
    .duration(750)
    .call(brushsl.extent([1, 1]))
    .call(brushsl.event);

function brushedsl() {
	var value = brushsl.extent()[0];

	if (d3.event.sourceEvent) { // not a programmatic event
	value = ysl.invert(d3.mouse(this)[1]);
	brushsl.extent([value, value]);
	}

  	handlesl.attr("cy", ysl(value));

	currentTranslate=zoomMap.translate();

	currentScale = value;
	zoomMap.scale(value);

	scaleLOD();
}

d3.select("#pantool").append("g")
  .append("input")
  .attr("id","ptbuttonAdd")
  .attr("type","button")
  .attr("value","加载")
  .on("click",function(){});
d3.select("#pantool").append("g")
  .append("input")
  .attr("id","ptbuttonGraticule")
  .attr("type","button")
  .attr("value","格网")
  .on("click",function(){});
d3.select("#pantool").append("g")
  .append("input")
  .attr("id","ptbuttonChina")
  .attr("type","button")
  .attr("value","中国")
  .on("click",function(){});
d3.select("#pantool").append("g")
  .append("input")
  .attr("id","ptbuttonZhuji")
  .attr("type","button")
  .attr("value","注记")
  .on("click",function(){});
d3.select("#pantool").append("g")
  .append("input")
  .attr("id","ptbuttonTree")
  .attr("type","button")
  .attr("value","三维")
  .on("click",function(){});
/////////////////////////////////////创建rightpantool//////////////////////////////
d3.select("#rightpanel")
  .append("input").attr("id","ptbutton_rightpanel")
  .attr("type","button")
  .attr("value","X")
  .style("width","20%")
  .style("position","absolute")
  .style("left","80%")
  .on("click",function(){
      if(isshowrighttool==1) {
          d3.select("#rightpanel").style("opacity",0.8);
          d3.select("#rightpanel").on("mouseover",null);
          d3.select("#rightpanel").on("mouseout",null);
          isshowrighttool=0;
      }
      else {
          d3.select("#rightpanel").style("opacity",0);
          d3.select("#rightpanel").on("mouseover",function(){ d3.select("#rightpanel").style("opacity",0.8)});
          d3.select("#rightpanel").on("mouseout",function(){ d3.select("#rightpanel").style("opacity",0)});
          isshowrighttool=1;
      }
  });
/////////////////////////////////////创建bottompantool//////////////////////////////
var svgAxisTime = d3.select("#bottompanel").append("svg").attr("class","svgAxisTime").attr("width",$("#bottompanel").width()).attr("height",$("#bottompanel").height());
DrawTimeAxis("",svgAxisTime,$("#bottompanel").width(),$("#bottompanel").height(),[]);

function DrawTimeAxis(filename, svg, w, h, d){
  var intervalEvent;
  d3.select("#bottompanel")
    .append("input").attr("id","ptbutton_bottompanel")
    .attr("type","button")
    .attr("value","Play")
    .style("width","20px")
    .style("position","absolute")
    .style("left","5px")
    .style("top","40px")
    .on("click",function(){
        intervalEvent = setInterval(mIntervalFun,1000);
    });

  var data = ["1921", "1922", "1923","1924","1925","1928","1948"];
  var padding = 40;
  var axisw  = w - 2*padding;
  var axish = h/2;


  var svgTimeAxis = svg.append("g").attr("class", "axisTime");
        
  //画坐标线<line x1="0" y1="0" x2="500" y2="50" stroke="black"/>
  svgTimeAxis.append("line")
             .attr("x1", padding)
             .attr("y1", axish)
             .attr("x2", axisw+padding)
             .attr("y2", axish)
             .attr("stroke", "#111111")
             .attr("stroke-width", 3);
  //设置坐标轴的比例尺
  var length = data.length;
  //序数坐标比例尺
  var xScale = d3.scale.linear()
                        .domain([0, length-1])
                        .range([padding, axisw+padding]);
  var r = 5;
  //画原点
  var circles = svgTimeAxis.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circleTimeAxis")
    .attr("id", function(d,i){
      return i;
    })
    .attr("fill", function(d, i) {
      return "#63B8FF";
    });

    circles.attr("cx", function(d, i) {
      return xScale(i);
    })
    .attr("cy", axish)
    .attr("r", r)
    .on("click", function(d){

    })
    .on("mouseover",function(d,i){
        d3.select(this).attr({
          "r" : r*2,
          "fill":"red"
        });
    })
    .on("mouseout",function(d,i){
        d3.select(this).attr({
          "r" : r,
          "fill":"#63B8FF"
        });
    });

  //画坐标值 <text x="250" y="25">Easy-peasy</text>
  var texts = svgTimeAxis.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d, i){
      return d;
    })
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", axish+30)
    .attr("text-anchor", "middle");//文本居中

    var icount=0;
    var mIntervalFun = function IntervalFun(){
      if(icount<7)
      {
        circles.each(function(d,i){
            if(i==icount)
            {
              d3.select(this).attr({
                "r" : r*2,
                "fill":"red"
              });
            }
            else
            {
               d3.select(this).attr({
                "r" : r,
                "fill":"#63B8FF"
              });
            }
        });
        icount++;
      }
      else
      {
        icount=0;
        circles.each(function(d,i){
           d3.select(this).attr({
            "r" : r,
            "fill":"#63B8FF"
          });
        });
        clearInterval(intervalEvent);
      }
      console.log(icount);
    }
}
/////////////////////////////////////创建bottompantool3d//////////////////////////////
DrawTimeAxis3d(0,2000,"#bottompanel3d",$("#bottompanel").width(),$("#bottompanel").height()*0.8);

function DrawTimeAxis3d(Durationmin,Durationmax,divId,w,h){
    //var Durationmax=d3.max(gflightsdata, function(d) {return parseInt(d["Distance"]);});
    //var Durationmin=d3.min(gflightsdata, function(d) {return parseInt(d["Distance"]);});
    var margin = {top: 30, right: 20, bottom: 10, left: 20}
      , width = w - margin.left - margin.right
      , height = h - margin.top - margin.bottom;
    //1、设置svg
    var timetoolsvg = d3.select(divId).append("svg")
                        .attr("width",width + margin.right + margin.left)
                        .attr("height",height + margin.top + margin.bottom);

    //2、设置时间轴x    
    //x轴刻画          
    var x = d3.scale.linear().range([0, width]).domain([Durationmin,Durationmax]);
    //绘制x轴（d3.svg.axis()）
    timetoolsvg.append("g")
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
              .attr("class", "x axis").call(d3.svg.axis().scale(x).orient("bottom").ticks(20,d3.format(",d")));
    //3、设置刷子
    //刷子初始化
      var brush = d3.svg.brush().x(x).extent([500, 1000])
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);
    //绘制刷子弧线（d3.svg.arc()）
    var arc = d3.svg.arc().outerRadius(height/2).startAngle(0).endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });
    //绘制刷子（d3.svg.brush()）      
    var brushg = timetoolsvg.append("g")
                            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
                            .attr("class", "brush").call(brush);
    //设置resize类
    brushg.selectAll(".resize").append("path").attr("d", arc);
    //设置rect
    brushg.selectAll("rect").attr("height", height);
    brushstart();
    brushmove();
    timerbrush();
    //4、刷子响应函数
    function brushstart() {
      //timetoolsvg.classed("selecting", true);
    }
    function brushmove() {
        var s = brush.extent();
    }
    function brushend() {
      //timetoolsvg.classed("selecting", !d3.event.target.empty());
    }
    function timerbrush()
    {
      setInterval(function(){
        var s = brush.extent();
          //执行动作
            if( (s[0] <= 1000) && (1000<= s[1]))
            {
              
            }
            else
            {
              
            }
      },3000);
    }
}
////////////////////////////////////////////////////////////////////////////////////
//搜索地名
/*d3.select("#SearchLoc").attr("click",function(){
    console.log(d3.select("#SearchText").value);
    d3.select(this).attr("href","http://geocontext.svail.com:8080/gaz?req=get&q.gaz="+d3.select("#SearchText").text+"&q.txt=1001&q.evd=on&t.start=20130830&t.end=20150830")
});*/