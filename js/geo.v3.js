//////////////////////////////////////////2DMap缩放设置//////////////////////////////////////
var currentScale = defaultZoom;
    currentTranslate = [defaultTranslateX,defaultTranslateY];
var xScalezoom = d3.scale.linear()
          .domain([0, width])
          .range([0, width]);
var yScalezoom = d3.scale.linear()
          .domain([0, height])
          .range([height, 0]);

var zoomMap = d3.behavior.zoom().x(xScalezoom).y(yScalezoom)
                .center([width / 2, height / 2])
                .scaleExtent([defaultZoom, 20])//设置缩放范围
                .on("zoom", zoomed);
var ii=0;
function zoomed() {
 
  handlesl.attr("cy", ysl(currentScale));

  currentScale = d3.event.scale;
  currentTranslate = d3.event.translate;
  
  scaleLOD();
  //ResetHeatmapData(gHeatmapdata);
}
function zoomed3() {
      projection.rotate([initRotate[0]+180*d3.event.translate[0]/width,
          initRotate[1]-180*d3.event.translate[1]/height,
          initRotate[2]
        ]);
      projection.scale(initScale*d3.event.scale);
  
      d3.selectAll(".graticule").attr("d", path);
      d3.selectAll(".worldpath").attr("d", function(d) { return path(d);}); 
      d3.selectAll(".chinapath").attr("d", function(d) { return path(d);}); 
      d3.selectAll(".chinacity").attr({
          cx:function(d,i){return projection([d.x,d.y])[0]},
          cy:function(d,i){return projection([d.x,d.y])[1]}
      }); 
      d3.selectAll(".chinatext").attr({
          x:function(d,i){return projection(d.properties.cp)[0]},
          y:function(d,i){return projection(d.properties.cp)[1]}
      });       
}
/////////////////////////////////3DMap缩放设置///////////////////////////////////////////
var zoom3DMap = d3.behavior.zoom()
    //.center([width / 2, height / 2])
    .scaleExtent([defaultZoom, 20])//设置缩放范围
    .on("zoom", zoom3ded);
var initRotate = projection.rotate();
    initScale = projection.scale();
function zoom3ded() {
    projection.rotate([initRotate[0]+180*d3.event.translate[0]/width,
        initRotate[1]-180*d3.event.translate[1]/height,
        initRotate[2]
      ]);
    projection.scale(initScale*d3.event.scale);

    d3.selectAll("#path3d").attr("d", path);
    d3.selectAll("#flight3d").attr("d",function(d) { return path(arc(d));});  
    d3.selectAll("#airport3d").attr({
      cx:function(d,i){return projection([d[" longitude"],d[" latitude"]])[0];},
      cy:function(d,i){return projection([d[" longitude"],d[" latitude"]])[1]}});
    d3.selectAll("#graticule3d").attr("d", path);  
    d3.selectAll("#pathsphere").attr("d", path);  
}

/////////////////////////////////////绘制leaflet在线，添加图层////////////////////////////////////////////
/*var mapleaf = new L.Map("mapdiv", {center: [40, 115], zoom: 4})
        .addLayer(new L.TileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png"));

var svgleaflet = d3.select(mapleaf.getPanes().overlayPane).append("svg"),
        gleaflet = svgleaflet.append("g").attr("class", "leaflet-zoom-hide");
d3.json("data/mapdata/world-nochina.json", function (collection) {
 
    var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);
    var feature = gleaflet.selectAll(".province")
            .data(collection.features)
            .enter().append("path").attr("class", "province")
            .style("stroke",worldstroke)
            .style("stroke-width",worldstrokewidth)
            .style("fill",worldColor)
            .style("fill-opacity",0.4);
    mapleaf.on("viewreset", reset);
    reset();
    // Reposition the SVG to cover the features.
    function reset() {
        var bounds = path.bounds(collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];
        svgleaflet.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");
        gleaflet.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        feature.attr("d", path).on("mouseover", mouseOver).on("mouseout", mouseOut);
        ;
    }
    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = mapleaf.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
});
function mouseOver(d) {
}
function mouseOut() {
}*/
//绘制leaflet

/////////////////////////////////////设置3D画布/////////////////////////////////////////////////
var svg3dmaps= d3.select("#global3Ddiv").call(zoom3DMap)
    .append("svg")
    .attr("class", "tdmaps")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g").attr("id","tdmaps");
//海洋
var svgocean3d = svg3dmaps.append("g").attr("class","ocean3d").attr("id","ocean3d");
//世界地图
var svgworldmap3d =  svg3dmaps.append("g").attr("class","worldmap3d").attr("id","worldmap3d");
//机场数据
var svgairport3d = svg3dmaps.append("g").attr("class","airports3d").attr("id","airports3d");
//飞机航线静止
var svgflights3d = svg3dmaps.append("g").attr("class","flights3d").attr("id","flights3d");
//经纬网
var svggraticule3d = svg3dmaps.append("g").attr("class","graticule3d").attr("id","graticule3d");
var graticule3d = d3.geo.graticule();
                        //.extent([-180,-90],[180,90])
                        //.step([10,10]);
    svggraticule3d.append("path")
                .datum(graticule3d)
                .attr("class", "graticule3d")
                .attr("id", "graticule3d")
                .attr("d", path);
//设置3D画布

//////////////////////////////////////////////设置2D画布///////////////////////////////////////////////
var svgmaps= d3.select("#mapdiv").call(zoomMap)
    .append("svg")//.call(zoomMap)
    .attr("class", "maps")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g").attr("id","maps");
//heatmap_d3
var svgheatmap = svgmaps.append("g").attr("class","svgheatmap");
//海洋
var svgocean = svgmaps.append("g").attr("class","ocean");
//世界地图
var svgworldmap =  svgmaps.append("g").attr("class","worldmap").attr("id","worldmap");
//中国地图
var svgchinamap = svgmaps.append("g").attr("class","chinamaps").attr("id","chinamaps");
//经纬网
var svggraticule = svgmaps.append("g").attr("class","graticule").attr("id","graticule");
//分省地图
var svgprovencmaps = svgmaps.append("g").attr("class","provencemaps").attr("id","provencemaps");
//城市地图
var svgcitymaps = svgmaps.append("g").attr("class","citymaps").attr("id","citymaps");
//中国南海
var svgsouthsea = svgmaps.append("g").attr("class","southsea").attr("id","southsea");


//中国地图注记
var svgchinatexts = svgmaps.append("g").attr("class","chinatexts").attr("id","chinatexts");
//分省地图注记
var svgprovencetexts = svgmaps.append("g").attr("class","provencetexts").attr("id","provencetexts");
//分市地图注记
var svgcitytexts = svgmaps.append("g").attr("class","citytexts").attr("id","citytexts");
//线性标绘
var svglines = svgmaps.append("g").attr("class","lines").attr("id","lines");
//重点目标
var svgpoints = svgmaps.append("g").attr("class","points").attr("id","points");

//机场数据
var svgairport = svgmaps.append("g").attr("class","airports").attr("id","airports");
//飞机航线动态
var svgflights2=svgmaps.append("g").attr("class","flights2").attr("id","flights2");
//飞机航线静止
var svgflights1=svgmaps.append("g").attr("class","flights1").attr("id","flights1");

//预定义高斯滤镜
var defs = svgchinamap.append("defs");
var gaussian = defs.append("filter").attr("id","gaussian");
    gaussian.append("feGaussianBlur")
            .attr("in","SourceGraphic")
            .attr("stdDeviation","1");
var gaussian2 = defs.append("filter").attr("id","gaussian2");
    gaussian2.append("feGaussianBlur")
            .attr("in","SourceGraphic")
            .attr("stdDeviation","20");
//背景海洋
/*svgocean.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width","100%")
  .attr("height","100%")
  .attr("d", path2)//投影
  .attr("stroke","#000")
  .attr("stroke-width",0.5)
  .attr("fill", "#008");*/
////////////////////////////////////绘制经纬网/////////////////////////////////////
var graticule = d3.geo.graticule();
svggraticule.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path2)
            .attr("opacity",0);
//设置背景颜色
d3.select("#mapdiv").style("background-color",oceanColor);
////////////////////////////////////世界地图/////////////////////////////////////////
//世界地图
d3.json("data/mapdata/world-countries.json", function(error, root) {    
  if (error) return console.error(error);
  gworlddata = root.features;

  svgworldmap.selectAll("path").data(gworlddata)
        .enter()
        .append("path").attr("class","worldpath")
        .style("stroke",worldstroke)
        .style("stroke-width",worldstrokewidth)
        //.attr("fill", function(d,i){return color2(i);})
        .style("fill",worldColor)
        .attr("d", path2)//投影
        .each(function(d,i){if(d.id=="CHN") d3.select(this).style("fill","#fff").style("filter","url(#"+ gaussian2.attr("id") +")");})
        /*.style("fill-opacity",0.5)
       .on("mouseover",function(d,i){
            d3.select(this).style("fill",overColor);
        })
        .on("mouseout",function(d,i){
            d3.select(this).transition().duration(1000).style("fill",worldColor);
        })*/;
});
////////////////////////////中国地图及注记//////////////////////////////////////////
d3.json("data/mapdata/china.json", function(error, root) {

  if (error) return console.error(error);
  //设置映射比例范围
  var linear = d3.scale.linear().domain([0, root.features.length]).range([0, 1]);
  gchinadata = root.features;
  //中国地图
  svgchinamap.selectAll("path").append("g").attr("class","chinapaths").data(root.features)
    .enter()
    .append("path")
    .attr("class","chinapath")
    .attr("id","chinapath")
    .attr("d", path2)
    .style("stroke",chinastroke)
    .style("stroke-width",chinastrokewidth)
    .style("fill", function(d,i){
      return colorChina;// colorChina(linear(i));
    })
    .attr("opacity",0)
    //.style("filter","url(#"+ gaussian2.attr("id") +")")
    /*.on("mouseover",function(d,i){
        d3.select(this).style("fill",overColor);
        //tooltipdiv.style("visibility", "visible");
        })
    .on("mouseout",function(d,i){ d3.select(this).transition().duration(1000).style("fill", colorChina(linear(i)));//.style("fill","#001");
        //tiphide();
        })*/
    .each(function(d,i){
         var id = d.properties.id;
         //drawPrivenceMap(d, id, "data/mapdata/geometryProvince/" + id + ".json");
    });
  //显示注记
  svgchinatexts.selectAll("text").data(root.features)
      .enter()
      .append("text")
      .attr("class","chinatext")            
      .text(function(d){return d.properties.name})
      .attr({
          x:function(d){if(d.properties.name=="澳门") return projection2(d.properties.cp)[0]+10;else return projection2(d.properties.cp)[0]-10},
          y:function(d){if(d.properties.name=="香港") return projection2(d.properties.cp)[1]+10;else return projection2(d.properties.cp)[1]}
      })
      .style("font-size",6)
      .style("fill", "#ff0")
      .attr("opacity",0);
});//中国地图及注记
////////////////////////////////////////城市坐标 /////////////////////////////////////////////////////////// 
d3.json("data/mapdata/china.city.json", function(error, root) {
  if (error) 
    return console.error(error);
    //console.log(root);

  var dataCity=[];
  var dataMajorCity=[];
  var heatmapdata=[];

  for (var aa in root) {  
    var i=0;
    for(var bb in root[aa]){
      if(i==0) {
        root[aa][bb].name=bb;
        dataMajorCity.push(root[aa][bb]);
        i=1;
        root[aa][bb].value=Math.random(100)*100;
        heatmapdata.push(root[aa][bb]);
      };
      dataCity.push(root[aa][bb]);
    }
  };
  gcitydata=dataCity;
  gmajorcitydata=dataMajorCity;

  var circles = svgchinamap.append("g").attr("class","chinacitys")
                  .selectAll("circle")
                  //.data(dataMajorCity)
                  .data(dataCity)
                  .enter().append("circle")
                  .attr("class","chinacity");  
  circles.attr({
        //cx:function(d,i){return projection2([dataMajorCity[i].x,dataMajorCity[i].y])[0]},
        //cy:function(d,i){return projection2([dataMajorCity[i].x,dataMajorCity[i].y])[1]},
        cx:function(d,i){return projection2([d.x,d.y])[0]},//Math.random()*width},
        cy:function(d,i){return projection2([d.x,90])[1]},
        r:function(d,i){return 1}
    })
    //.style("filter","url(#"+ gaussian.attr("id") +")")
    /*.style("fill",function(d){
        var color = interpolateColor(Math.random());
        return color.toString();
    })*/
    .style("fill", function(d,i){return color2(i)})
    .attr("opacity",0);

  //绘制标签
  //DrawPointLable(dataMajorCity);
  //绘制热图
  //canvas热图数据
  /*var heatmapdata=[];
  for (var aa in root) {  
    var i=0;
    for(var bb in root[aa]){
      if(i==0) {
        root[aa][bb].name=bb;
        dataMajorCity.push(root[aa][bb]);
        i=1;
        root[aa][bb].value=Math.random(100)*100;
        heatmapdata.push(root[aa][bb]);
      };
      dataCity.push(root[aa][bb]);
    }
  };
  var gHeatmapdata = JSON.parse(JSON.stringify(heatmapdata));//Object.create(heatmapdata);//heatmapdata.clone();//heatmapdata.slice(0);.concat();
  
  for (var i = 0; i < heatmapdata.length; i++) {
    gHeatmapdata[i].x = projection2([heatmapdata[i].x,heatmapdata[i].y])[0];
    gHeatmapdata[i].y = projection2([heatmapdata[i].x,heatmapdata[i].y])[1];
    gHeatmapdata[i].value = heatmapdata[i].value;
  };*/
  //DrawHeatMapData(heatmapdata);
});//城市坐标
//////////////////////////////////////////////////中国地图南海部分//////////////////////////////////////////
d3.xml("data/mapdata/southchinasea.svg", function(error, xmlDocument) {
    svgsouthsea.html(function(d){
      return d3.select(this).html() + xmlDocument.getElementsByTagName("g")[0].outerHTML;
    }); 
    d3.select("#southseachina").attr("transform", "translate(550,450)scale(0.5)");
});
//中国地图南海部分
//////////////////////////////////////////////////绘制省级数据//////////////////////////////////////////////
function drawPrivenceMap(d, id, mapPath) {  
  d3.json(mapPath, function(error, root) {    
    if (error) 
        return console.log(error);
  
    //显示边界
    svgprovencmaps.selectAll(".pathProvince_"+id)//selectAll("path")
      .data( root.features )
      .enter()
      .append("path")
      .attr("class", "pathProvince_"+id)
      .attr("id", "Provincepath")
      .attr("d", path2)
      .style("stroke",provencestroke)
      .style("stroke-width",provencestrokewidth)
      .style("fill", provenceColor)
      .on("mouseover",function(d,i){
          d3.select(this).style("fill-opacity",1).style("fill",overColor);           
      })
      .on("mouseout",function(d,i){
          d3.select(this).style("fill-opacity",0).style("fill",provenceColor);
      })
      .on("click",function(d,i){
        console.log("provence");
      })
      .each(function(d,i){
          var id = d.properties.id;
          if(id.length>4) 
            {
              id=id.substring(0,4);
            }
          var mapPath = "data/mapdata/geometryCouties/" + id + "00.json";
          //香港
          if(id.substring(0,2)=="66")  mapPath = "data/mapdata/geometryCouties/810100.json";
          //台湾
          if(id.substring(0,2)=="70")  mapPath = "data/mapdata/geometryCouties/710000.json";

          drawCoutyMap(d, id, mapPath);
      });
      //显示注记
      svgprovencetexts.selectAll("textprovence").data(root.features)
          .enter()
          .append("text")
          .attr("class","textprovence")            
          .text(function(d){return d.properties.name}).attr({
          x:function(d){
            if(d.properties.cp==null) 
                  return path2.centroid(d)[0];
            else  return projection2(d.properties.cp)[0]-10},
          y:function(d){
            if(d.properties.cp==null) 
                  return path2.centroid(d)[1];
            else  return projection2(d.properties.cp)[1]}
      })
      .style("font-size",2)
      .style("fill", textColor);
  });
}//省级数据（地级市）
//////////////////////////////////////////////绘制市级数据///////////////////////////////////////////
function drawCoutyMap(d, id, mapPath) {
  d3.json(mapPath, function(error, root) {
    if (error) 
        return console.log(error);
    //console.log(root.features);
    //显示边界
    svgcitymaps.selectAll(".pathCity"+id)
      .data(root.features)
      .enter()
      .append("path")
      .attr("class", "pathCity"+id)
      .attr("id", "Citypath")
      .style("stroke",citystroke)
      .style("stroke-width",citystrokewidth)
      .style("fill", cityColor)
      .attr("d", path2)
      .on("mouseover",function(d,i){
            d3.select(this).style("fill-opacity",1).style("fill",overColor);
          })
      .on("mouseout",function(d,i){
            d3.select(this).style("fill-opacity",0).style("fill",cityColor);
          })
      .on("click",function(d,i){
        console.log("city");
      });
      
      //显示注记
      svgcitytexts.selectAll("textcity").data(root.features)
          .enter()
          .append("text")
          .attr("class","textcity")            
          .text(function(d){return d.properties.name}).attr({
          x:function(d){return  path2.centroid(d)[0]},
          y:function(d){return  path2.centroid(d)[1]}//获取中心点坐标
      })
      .style("font-size",0.8)
      .style("fill", textColor);
  });
}//市级数据（分县显示）

//绘制目标点
//DrawPointsData();
//////////////////////////////////////绘制目标点/////////////////////////////////////////////////
function DrawPointsData()
{
  d3.json("data/points.json", function(error, root) {
    if (error) 
      return console.error(error);
      //console.log(root);

    var locations = svgpoints.append("g").attr("class","locations").selectAll(".location")
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
            DrawSunburst(svgpoints,250,250,60,projection2([d.log,d.lat])[0],projection2([d.log,d.lat])[1],d);
        });     
  });
}//绘制目标点
//绘制标签
function DrawPointLable(dataPointLable)
{
  var biaojis = svgpoints.append("g").attr("class","biaojis").selectAll(".biaoji").data(dataPointLable).enter()
    .append("image").attr("class","biaoji"); 
  biaojis
    .attr("x",function(d,i){return projection2([dataPointLable[i].x,dataPointLable[i].y])[0]-30})
    .attr("y",function(d,i){return projection2([dataPointLable[i].x,dataPointLable[i].y])[1]-30})
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
  svglines.append("line")
          .attr("class","routeline")
          .attr("x1",shanghai[0])
          .attr("y1",shanghai[1])
          .attr("x2",peking[0])
          .attr("y2",peking[1])
          .attr("marker-end","url(#arrow)")
          .attr("marker-start","url(#startPoint)"); 
  svglines.append("line")
          .attr("class","routeline")
          .attr("x1",shanghai[0])
          .attr("y1",shanghai[1])
          .attr("x2",guangdong[0])
          .attr("y2",guangdong[1])
          .attr("marker-end","url(#arrow)")
          .attr("marker-start","url(#startPoint)"); 
  svglines.append("line")
          .attr("class","routeline")
          .attr("x1",shanghai[0])
          .attr("y1",shanghai[1])
          .attr("x2",chongqing[0])
          .attr("y2",chongqing[1])
          .attr("marker-end","url(#arrow)")
          .attr("marker-start","url(#startPoint)"); 
}//绘制线目标数据
////////////////////////////////////////////绘制机场数据///////////////////////////////////////////
//DrawFlightData();
function DrawFlightData()
{
  //世界机场
  d3.csv("data/airports.csv",function(error, airportdata) 
  {
    if (error) 
      return console.error(error);

    var circles = svgairport.selectAll("circle").data(airportdata).enter().append("circle").attr("class","airport");  
      circles.attr({
        cx:function(d,i){return projection2([airportdata[i][" longitude"],airportdata[i][" latitude"]])[0]},
        cy:function(d,i){return projection2([airportdata[i][" longitude"],airportdata[i][" latitude"]])[1]},
        r:function(d,i){return 1}
      })
      .style("fill", "blue")
      .style("opacity", 0.5);   
    //航线数据
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
      /*var lines = svgflights1.append("g").attr("class","flights").selectAll("line").data(flightsdata).enter().append("line").attr("class","flight");  
      lines.attr({
        x1:function(d,i){return projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[0]},
        y1:function(d,i){return projection2([flightsdata[i]["x1"],flightsdata[i]["y1"]])[1]},
        x2:function(d,i){return projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[0]},
        y2:function(d,i){return projection2([flightsdata[i]["x2"],flightsdata[i]["y2"]])[1]}
      })
      .style("stroke", "#0aa")
      .style("stroke-width", 0.2)
      .on("mouseover",function(d,i){d3.select(this).style("stroke","red").style("stroke-width", 0.5);})
      .on("mouseout",function(d,i){d3.select(this).transition().duration(1000).style("stroke", "#0aa").style("stroke-width", 0.2);});*/

      svgflights1.selectAll("path")
          .data(links)
          .enter().append("path").attr("class","flight")
          .style("fill","#0aa")
          .style("fill-opacity",0)
          .style("stroke", "#00a")
          .style("stroke-width", 0.2)
          .attr("d", function(d) { return path2(arc(d));});
    });//航线数据
  });//世界机场
}//绘制机场数据
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
    data: mgHeatmapdata
  });
  gHeatmapdata=mgHeatmapdata;

  gcanvas = d3.selectAll(".heatmap-canvas")
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
//Draw3DMapCanvas(400);
function Draw3DMapCanvas(diameter)
{
  //设置3D画布Canvas
  var global3DCanvs = d3.select("#global3Ddiv").selectAll("canvas")
                        .data(d3.range(3)).enter()
                        .append("canvas")
                        .attr("width", diameter)
                        .attr("height", diameter);

  var radius = diameter*3 >> 1,
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
//////////////////////////////////绘制3DMap（svg）///////////////////////////////////////////
Draw3DMapSVG();
function Draw3DMapSVG( )
{
 d3.json("data/mapdata/world-countries.json", function(error, root) {
  if (error) throw error;

  /*海描画*/
  var sea = svgocean3d.append("path")
    .datum({type: "Sphere"})
    .attr("fill", "#111111")//"#ccccff"
    .attr("id","pathsphere")
    .attr("d", path);
     
  /*地形追加*/
  var map = svgworldmap3d
    .selectAll("path")
    .data(root.features) 
    .enter()
    .append("svg:path")
    .style("background-color", "blue")
    .attr({
    "class": "path tip",
    "id": "path3d",
    "d":path,
    "fill-opacity":1,
    //"fill":"green",
    "stroke":"white"
    })
    .style("fill",
      "#222222"
      //function(d,i){return color2(i);}
     );
  });
}
//绘制机场数据3D
DrawFlights3D();
////////////////////////////////////////////////////////////////////////////////////////
function DrawFlights3D()
{
  d3.csv("data/airports.csv",function(error, airportdata) 
  {
    if (error) 
      return console.error(error);

      svgairport3d.selectAll("circle").data(airportdata).enter().append("circle").attr("id","airport3d").attr({
          cx: function(d,i){return projection([airportdata[i][" longitude"],airportdata[i][" latitude"]])[0]},
          cy: function(d,i){return projection([airportdata[i][" longitude"],airportdata[i][" latitude"]])[1]},
          r : function(d,i){return 1}
      })
      .style("fill", "yellow")
      .style("opacity", 0.5);
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
      svgflights3d.selectAll("path")
          .data(links)
          .enter().append("path").attr("id","flight3d")
          .style("fill","#0aa")
          .style("fill-opacity",0)
          .style("stroke", "blue")
          .style("stroke-width", 0.2)
          .attr("d", function(d) { return path(arc(d));});  
    });//航线数据
  });
}
/////////////////////////////////////////////////////////////////////////////
////////////////////////////functions////////////////////////////////////////////
//设置LOD动作
var scaleLOD=function(){

    d3.select("#worldmap").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#chinamaps").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#chinatexts").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#provencemaps").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#provencetexts").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#citymaps").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#citytexts").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#points").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#graticule").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")"); 
    d3.select("#lines").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#airports").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#flights1").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
    d3.select("#southsea").attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");


    if((currentScale>=4)&&(currentScale<12))//显示省级
    {
        d3.select("#worldmap").attr("display","none");
        //d3.select("#chinamaps").attr("display","none");
        d3.select("#chinatexts").attr("display","block");
        d3.select("#provencemaps").attr("display","block");
        d3.selectAll("#Provincepath").style("fill-opacity",0);
        d3.select("#provencetexts").attr("display","block");
        d3.select("#citymaps").attr("display","none");
        d3.select("#citytexts").attr("display","none");
    }
    else if(currentScale>=12)//显示县级
    {
        d3.select("#worldmap").attr("display","none");
        //d3.select("#chinamaps").attr("display","none");
        d3.select("#chinatexts").attr("display","block");
        //d3.select("#provencemaps").attr("display","none");
        d3.selectAll("#Provincepath").style("fill-opacity",0);
        d3.select("#provencetexts").attr("display","none");
        d3.select("#citymaps").attr("display","block");
        d3.selectAll("#Citypath").style("fill-opacity",0);
        d3.select("#citytexts").attr("display","block");
    }
    else//currentScale<4显示全国
    {
      d3.select("#worldmap").attr("display","block");
      d3.select("#chinamaps").attr("display","block");
      d3.select("#chinatexts").attr("display","block");
      d3.select("#provencemaps").attr("display","none");
      //d3.selectAll("#Provincepath").style("fill-opacity",0);
      d3.select("#provencetexts").attr("display","none");
      d3.select("#citymaps").attr("display","none");
      //d3.selectAll("#Citypath").style("fill-opacity",0);
      d3.select("#citytexts").attr("display","none");
    }
}
///////////////////////////////////////////////////////////////////////////////////////


