d3.GeoEvent={};
d3.GeoEvent.SVGMap = function() {
  "use strict";
  var svgairport,
      svgflights,
      svglines,
      svgpoints,
      zoomed,
      zoomed3,
      zoomMap;

  function SVGMap(selection) {
    //////////////////////////////////////////2DMap缩放设置//////////////////////////////////////  
    var xScalezoom = d3.scale.linear()
              .domain([0, width])
              .range([0, width]);
    var yScalezoom = d3.scale.linear()
              .domain([0, height])
              .range([height, 0]);

    //通过标签元素移动改变
    SVGMap.zoomed = function(){
     
      //handlesl.attr("cy", ysl(currentScale));

      currentScale = d3.event.scale;
      currentTranslate = d3.event.translate;
      
      SVGMap.scaleLOD(currentTranslate,currentScale);
    }
    //通过投影变换改变位置
    SVGMap.zoomed3 = function(){
        //handlesl.attr("cy", ysl(currentScale));
        
        currentScale = d3.event.scale;
        currentTranslate = d3.event.translate;

        projection.rotate([initRotate[0]+180*currentTranslate[0]/width,
            initRotate[1]-180*currentTranslate[1]/height,
            initRotate[2]
          ]);
        projection.scale(initScale*currentScale);

        SVGMap.projectionChange(projection);
    }
    SVGMap.zoomMap = d3.behavior.zoom().x(xScalezoom).y(yScalezoom)
                    .center([width / 2, height / 2])
                    .scaleExtent([0.5, 20])//设置缩放范围
                    .on("zoom", SVGMap.zoomed);
    var svgmaps= selection.call(SVGMap.zoomMap)
              .append("svg")//.call(zoomMap)
              .attr("class", "maps")
              .attr("width", "100%")
              .attr("height", "100%")
              .append("g").attr("id","maps");


    //////////////////////////////////////////////设置2D画布///////////////////////////////////////////////
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
    svglines = svgmaps.append("g").attr("class","lines").attr("id","lines");
    //重点目标
    svgpoints = svgmaps.append("g").attr("class","points").attr("id","points");
    //机场数据
    svgairport = svgmaps.append("g").attr("class","airports").attr("id","airports");
    //飞机航线动态
    svgflights= svgmaps.append("g").attr("class","flights").attr("id","flights");
    //飞机航线静止
    var svgflights1= svgmaps.append("g").attr("class","flights1").attr("id","flights1");

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
    //设置背景颜色
    selection.style("background-color",oceanColor);
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

  
    ////////////////////////////////////世界地图/////////////////////////////////////////
    SVGMap.loadMap= function(){
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
      ////////////////////////////////////绘制经纬网/////////////////////////////////////
      var graticule = d3.geo.graticule();
      svggraticule.append("path")
                  .datum(graticule)
                  .attr("class", "graticule")
                  .attr("d", path2)
                  .attr("opacity",0);
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
        chinalinear = d3.scale.linear().domain([0, root.features.length]).range([0, 1]);
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
            return colorChina;// chinainterpolatecolor(chinalinear(i));
          })
          .attr("opacity",0)
          //.style("filter","url(#"+ gaussian2.attr("id") +")")
          /*.on("mouseover",function(d,i){
              d3.select(this).style("fill",overColor);
              //tooltipdiv.style("visibility", "visible");
              })
          .on("mouseout",function(d,i){ d3.select(this).transition().duration(1000).style("fill", chinainterpolatecolor(chinalinear(i)));//.style("fill","#001");
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
    }
    
    ////////////////////////////functions////////////////////////////////////////////
    //设置LOD动作
    SVGMap.scaleLOD=function(icurrentTranslate,icurrentScale){
        d3.select("#worldmap").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#chinamaps").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#chinatexts").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#provencemaps").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#provencetexts").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#citymaps").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#citytexts").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#points").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#graticule").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")"); 
        d3.select("#lines").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#airports").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#flights").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");
        d3.select("#southsea").attr("transform", "translate(" + icurrentTranslate + ")scale(" + icurrentScale + ")");


        if((icurrentScale>=4)&&(icurrentScale<12))//显示省级
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
        else if(icurrentScale>=12)//显示县级
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
    //投影变换
    SVGMap.projectionChange=function(iprojection){
          var ipath=d3.geo.path().projection(iprojection);
          d3.selectAll(".graticule").attr("d", function(d) { return ipath(d);}); 
          d3.select("#southseachina").attr("opacity",0);
          d3.selectAll(".worldpath").attr("d", function(d) { return ipath(d);}); 
          d3.selectAll(".chinapath").attr("d", function(d) { return ipath(d);}); 
          d3.selectAll(".chinacity").attr({
            cx:function(d,i){return iprojection([d.x,d.y])[0]},
            cy:function(d,i){return iprojection([d.x,d.y])[1]}
          }); 
          d3.selectAll(".chinatext").attr({
            x:function(d,i){return iprojection(d.properties.cp)[0]},
            y:function(d,i){return iprojection(d.properties.cp)[1]}
          }); 
          d3.selectAll(".biaoji").attr({
            x:function(d,i){return iprojection([d.x,d.y])[0]-30},
            y:function(d,i){return iprojection([d.x,d.y])[1]-30}
          }); 
          d3.selectAll(".airport").attr({
            cx: function(d,i){return iprojection([d[" longitude"],d[" latitude"]])[0]},
            cy: function(d,i){return iprojection([d[" longitude"],d[" latitude"]])[1]},
            r : function(d,i){return 1}
          });
          d3.selectAll(".flight").attr("d", function(d) { return ipath(arc(d));});
    }
  }
  SVGMap.svgairport=function(value) {
        if (!arguments.length) return svgairport;
        svgairport = parseInt(value, 10);
        return this;
  };
  SVGMap.svgflights=function(value) {
      if (!arguments.length) return svgflights;
      svgflights = parseInt(value, 10);
      return this;
  };  
  SVGMap.svgpoints=function(value) {
      if (!arguments.length) return svgpoints;
      svgpoints = parseInt(value, 10);
      return this;
  };
  SVGMap.svglines=function(value) {
      if (!arguments.length) return svglines;
      svglines = parseInt(value, 10);
      return this;
  };

  return SVGMap;
};
var SVGMap = d3.GeoEvent.SVGMap();
d3.select("#mapdiv").call(SVGMap);

SVGMap.loadMap();
///////////////////////////////////////////////////////////////////////////////////////


