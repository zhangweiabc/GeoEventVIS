/////////////////////////////////////全局变量////////////////////////////////////
//长宽设置
var width = 1920;
var height = 918;
var defaultZoom = 1;
var defaultTranslateX = 0;
var defaultTranslateY = 0;
var currentScale = defaultZoom,
    currentTranslate = [defaultTranslateX,defaultTranslateY];
//数据变量
var gflightsdata =[];
var gHeatmapdata=[];
var gheatmap;

var gworlddata ;
var gchinadata ;
var gcitydata ;
var gmajorcitydata;
//控制变量
var isshowrighttool=1;
var isshouwpoints=0;
var isshouwlines=0;
var isshouwareas=0;
var isshouwheat=0;
var isshowgraticule=0;
var isshowchina=0;
var isshowcitypoint=1;
var isshowzhuji=0;
var isshow3d=0;

var isshowdata3d=1;
var isshouwairports=1;
//投影3D
var projection = d3.geo.orthographic()//albers//orthographic正射//equirectangular等距圆筒//mercator
                       .scale(400)
				       .translate([400, 400])
				       .clipAngle(90)
				       //.clipExtent([[1, 1], [840,800]])
				       .rotate([250,-30,0])
				       .precision(.1);
var projection1 = d3.geo.orthographic()//albers//orthographic正射//equirectangular等距圆筒//mercator
                       .scale(400)
				       .translate([400, 400])
				       .clipAngle(90)
				       //.clipExtent([[1, 1], [840,800]])
				       .rotate([250,-30,0])
				       .precision(.1);
//投影2D
var projection2 = d3.geo.equirectangular()//albers//orthographic//equirectangular//mercator
                    .center([0, 0])
                    .scale(400)//初始化比例尺
                    .translate([width/2-1300, height/2+200]);
//投影heatmap
var projectionheat=projection2; 
//初始化
var initRotate = projection.rotate();
var initScale = projection.scale();
//经纬度转3D
var path = d3.geo.path().projection(projection);
//经纬度转平面信息
var path2 = d3.geo.path().projection(projection2);
//弧线生成器
var arc = d3.geo.greatArc();

//定义最小值和最大值对应的颜色
var a1 = d3.rgb(255,255,255);
var b1 = d3.rgb(255,255,0);
//颜色插值函数
var interpolateColor = d3.interpolate(a1,b1);

//世界地图颜色设置
var worldColor = "#EEEEEE"//"#222";"#FFFFCC";//世界地图
var overColor = "#ff0";//查询颜色
var oceanColor = "#DDDDDD";//"#333333";//"#CCFFFF";//#mapdiv设置
var worldstroke= "#CCCCCC";
var worldstrokewidth = 1;
//中国地图颜色设置
var aa = d3.rgb(150,200,100);  //浅绿  
var bb = d3.rgb(150,100,200);        //深绿  
var colorChina ="#EEEEEE";//d3.interpolate(aa,bb);    
var chinastroke ="#FFFFCC";
var chinastrokewidth = 0.5;
var chinainterpolatecolor=d3.interpolate(aa,bb);   
var chinalinear;
//var colorSouthSea = "#222";
//分省地图颜色设置
var provenceColor = "#FFFF99";
var provencestroke="#fff";
var provencestrokewidth = 0.3;
//分市地图颜色设置
var cityColor = "#FFFF99";
var citystroke = "#ccc";
var citystrokewidth = 0.1;
//注记颜色设置
var textColor = "#f00";
//多色设置
var color2 = d3.scale.category20();  
var color = d3.scale.category10();  
<!--
// D : "#F16745"
//J : "#FFC65D"
//O : "#7BC8A4"
//E : "#4CC3D9"
//U : "#93648D"
-->
//死亡人数颜色设置
var colorfills = {
    8: "#800000",
    7: "#8A1818",
    6: "#943131",
    5: "#9F4949",
    4: "#A96262",
    3: "#B37A7A",
    2: "#BE9393",
    1: "#C8ABAB",
    0: "#D2C4C4",
    defaultFill: '#DDDDDD'
  };
var colorScale = d3.scale.log()
                    .clamp(true)
                    .domain([1, 3000])
                    .range([0, 8])
                    .nice();
//数据变量
var relationsdata={},
    heatmapsvgdata={},
    flightdata={},
    stacksdata={};