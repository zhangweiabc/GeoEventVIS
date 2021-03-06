//stats.js
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.getElementById("leftpanel3d").appendChild( stats.domElement );

//dat.GUI.js
var controls = new function () {
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;

    this.positionX = 0;
    this.positionY = 4;
    this.positionZ = 0;

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.scale = 1;

    this.translateX = 0;
    this.translateY = 0;
    this.translateZ = 0;

    this.visible = true;

    /*this.translate = function () {

        sphere.translateX(controls.translateX);
        sphere.translateY(controls.translateY);
        sphere.translateZ(controls.translateZ);

        controls.positionX = sphere.position.x;
        controls.positionY = sphere.position.y;
        controls.positionZ = sphere.position.z;
    }*/
    this.translate = function () {

        root.translateX(controls.translateX);
        root.translateY(controls.translateY);
        root.translateZ(controls.translateZ);

        controls.positionX = root.position.x;
        controls.positionY = root.position.y;
        controls.positionZ = root.position.z;
    }
};

var gui = new dat.GUI();

guiScale = gui.addFolder('scale');
guiScale.add(controls, 'scaleX', 0, 5);
guiScale.add(controls, 'scaleY', 0, 5);
guiScale.add(controls, 'scaleZ', 0, 5);

guiPosition = gui.addFolder('position');
var contX = guiPosition.add(controls, 'positionX', -10, 10);
var contY = guiPosition.add(controls, 'positionY', -4, 20);
var contZ = guiPosition.add(controls, 'positionZ', -10, 10);

contX.listen();
contX.onChange(function (value) {
    //sphere.position.x = controls.positionX;
    root.position.x = controls.positionX;
});

contY.listen();
contY.onChange(function (value) {
    //sphere.position.y = controls.positionY;
    root.position.y = controls.positionY;
});

contZ.listen();
contZ.onChange(function (value) {
    //sphere.position.z = controls.positionZ;
    root.position.z = controls.positionZ;
});


guiRotation = gui.addFolder('rotation');
guiRotation.add(controls, 'rotationX', -4, 4);
guiRotation.add(controls, 'rotationY', -4, 4);
guiRotation.add(controls, 'rotationZ', -4, 4);

guiTranslate = gui.addFolder('translate');

guiTranslate.add(controls, 'translateX', -10, 10);
guiTranslate.add(controls, 'translateY', -10, 10);
guiTranslate.add(controls, 'translateZ', -10, 10);
guiTranslate.add(controls, 'translate');

gui.add(controls, 'visible');

document.getElementById('rightpanel3d')
        .appendChild(d3.select(".dg").attr("id","dg").style(
          {
            "position":"absolute",
            "height":"auto",
            "right":"-20px",
          }).node());
/////////////////////////////////////////////////////////////////////////////////
/*d3.json("data/mapdata/world-countries.json", function(error, root) {    
      if (error) return console.error(error);

      d3.select("#svg3d").append("svg").attr("id","threeSVGs")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g","threeSVG")
            .selectAll("path")
            .data(root.features)
            .enter()
            .append("path").attr("class","tworldpath").attr("id",function(d,i){return "worldpath"+i})
            .style("stroke",worldstroke)
            .style("stroke-width",worldstrokewidth)
            //.attr("fill", function(d,i){return color2(i);})
            .style("fill","#ffffff")
            .attr("d", path2);*/
    
///////////////////////////////////////////Three基本步骤////////////////////////
//开启Three.js渲染器
/*var orbit;
var renderer;//声明全局变量（对象）
 function initThree() {
    width = document.getElementById('mapdiv').clientWidth;//获取画布「canvas3d」的宽
    height = document.getElementById('mapdiv').clientHeight;//获取画布「canvas3d」的高
    renderer=new THREE.WebGLRenderer({antialias:true});//生成渲染器对象（属性：抗锯齿效果为设置有效）
    //renderer..shadowMapEnabled = true;
    renderer.setSize(width, height );//指定渲染器的高宽（和画布框大小一致）
    document.getElementById('global3Ddiv').appendChild(renderer.domElement);//追加 【canvas】 元素到 【canvas3d】 元素中。
  }

  //设置场景
  var scene;
  function initScene() {   
    scene = new THREE.Scene();
    //scene.fog=new THREE.Fog(0xffffff,0.1,500);
  }
  //设置相机
  var camera;
  function initCamera() { 
    camera = new THREE.PerspectiveCamera( 45, width / height , 1 , 10000 );//设置透视投影的相机,默认情况下相机的上方向为Y轴，右方向为X轴，沿着Z轴朝里（视野角：fov 纵横比：aspect 相机离视体积最近的距离：near 相机离视体积最远的距离：far）
    camera.position.x = 0;//设置相机的位置坐标
    camera.position.y = 50;//设置相机的位置坐标
    camera.position.z = 100;//设置相机的位置坐标
    camera.up.x = 0;//设置相机的上为「x」轴方向
    camera.up.y = 1;//设置相机的上为「y」轴方向
    camera.up.z = 0;//设置相机的上为「z」轴方向
    camera.lookAt( {x:0, y:0, z:0 } );//设置视野的中心坐标
  }
  //设置光源
  var light;
  function initLight() { 
    light = new THREE.DirectionalLight(0xffffff, 1.0, 0);//设置平行光源
    light.position.set( 2000, 2000, 2000);//设置光源向量
    scene.add(light);// 追加光源到场景
  }
   //设置物体
  var sphere;
  function initObject(){  
    sphere = new THREE.Mesh(
         new THREE.SphereGeometry(20,20,50),                //width,height,depth
         new THREE.MeshLambertMaterial({
         		map: THREE.ImageUtils.loadTexture('img/2_no_clouds_8k.jpg')})
         		//color: 0xff0000}) //材质设定
    );
    //sphere.wireframe=true;
    sphere.position.set(0,0,0);
    scene.add(sphere);
   
    d3.selectAll(".tworldpath").each(function(d,i){
    var shape = createMesh(new THREE.ShapeGeometry(drawShape(this)));
    // add the sphere to the scene
    scene.add(shape);
   })
  }

//d3svg转换三维
function drawShape(svgpath) {
    var svgString = svgpath.getAttribute("d");//document.querySelector("#worldpath1").getAttribute("d");

    var shape = transformSVGPathExposed(svgString);

    // return the shape
    return shape;
}
function createMesh(geom) {

      geom.applyMatrix(new THREE.Matrix4().makeTranslation(-390, -74, 0));

      // assign two materials
      var meshMaterial = new THREE.MeshPhongMaterial({color: 0x333333, shininess: 100, metal: true});
      var mesh = new THREE.Mesh(geom, meshMaterial);
      mesh.scale.x = 0.1;
      mesh.scale.y = 0.1;

      mesh.rotation.z = Math.PI;
      mesh.rotation.x = -1.1;
      return mesh;
  }
  //执行
  initThree();
  initCamera();
  initScene();   
  initLight();
  initObject();

  
  orbit = new THREE.OrbitControls(camera);//, renderer.domElement);
  orbit.autoRotate = false;
  var clock = new THREE.Clock();
  //renderer.clear(); 

  function render() {
    stats.update();
    
    var delta = clock.getDelta();
    orbit.update(delta);

    sphere.visible = controls.visible;

    sphere.rotation.x += controls.rotationX;
    sphere.rotation.y = controls.rotationY;
    sphere.rotation.z = controls.rotationZ;

    sphere.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
//});*/
/////////////////////////////d3的canvas生成three纹理///////////////////////////////////////////
/*var  width = document.getElementById('mapdiv').clientWidth;//获取画布「canvas3d」的宽
     height = document.getElementById('mapdiv').clientHeight;//获取画布「canvas3d」的高
var projection3 = d3.geo.equirectangular().translate([width/2, height/2]).scale(180);//d3.geo.orthographic().translate([width/2, height/2]).clipAngle(85);

  d3.json('./data/mapdata/world-50m.json', function (err, data) {
    //1、d3读取数据
    var countries = topojson.feature(data, data.objects.countries);
    var canvas = d3.select("#global3Ddiv").append("canvas")
      .style("display", "none")
      .attr("width", width)
      .attr("height", height);

    var context = canvas.node().getContext("2d");

    var path = d3.geo.path()
      .projection(projection3).context(context);

    context.strokeStyle = "#333";
    context.lineWidth = 0.25;
    context.fillStyle = "#fff";

    context.beginPath();

    path(countries);

    context.fill();
    context.stroke();
    //console.log(canvas.node().toDataURL()); //F

    //2、three渲染数据
    //场景
    var scene = new THREE.Scene();
    //相机
    var camera = new THREE.PerspectiveCamera(75, width / height, 1, 6000);
    camera.position.z = 500;
    //渲染
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    document.getElementById('global3Ddiv').appendChild(renderer.domElement);
    //光照
    var light = new THREE.HemisphereLight('#fff', '#666', 1.5);
    light.position.set(0, 500, 0);
    scene.add(light);
    //材质
    var waterMaterial  = new THREE.MeshBasicMaterial({color: '#555', transparent: true});
    var sphere = new THREE.SphereGeometry(200, 100, 100);
    var baseLayer = new THREE.Mesh(sphere, waterMaterial);
    //纹理
    var mapTexture = new THREE.Texture(canvas.node());//3、d3生产的canvas纹理
    mapTexture.needsUpdate = true;

    var mapMaterial = new THREE.MeshBasicMaterial({map: mapTexture, transparent: true});
    var mapLayer = new THREE.Mesh(sphere, mapMaterial);

    var textureLoader = new THREE.TextureLoader();
        textureLoader.load('./img/2_no_clouds_8k.jpg', function(texture) {
        mapMaterial.map = texture;
     });
    //实体
    var root = new THREE.Object3D();
    root.add(baseLayer);//添加海洋纹理
    root.add(mapLayer);//添加地图纹理
    scene.add(root);//添加实体

    var orbit = new THREE.OrbitControls(camera);
    function render() {
      stats.update( );
      orbit.update( );

      root.visible = controls.visible;

      root.rotation.x = controls.rotationX;
      root.rotation.y = controls.rotationY;
      root.rotation.z = controls.rotationZ;

      root.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  });*/
////////////////////////////////////d3canvas三维////////////////////////////////////////////
/*var  width = document.getElementById('mapdiv').clientWidth;//获取画布「canvas3d」的宽
     height = document.getElementById('mapdiv').clientHeight;//获取画布「canvas3d」的高
//添加漫游缩放
var xScalezoom = d3.scale.linear()
          .domain([0, width])
          .range([0, width]);
var yScalezoom = d3.scale.linear()
          .domain([0, height])
          .range([height, 0]);

var projection3d = d3.geo.orthographic()
    .scale(248)
    .clipAngle(90);

var globe = {type: "Sphere"},
    land ={},
    countries={},
    borders={};

var zoomed = function(){
    console.log("sss");
    projection3d.rotate([180*d3.event.translate[0]/width,
        -180*d3.event.translate[1]/height,
        0
      ]);
    projection3d.scale(248*d3.event.scale);

    var c =d3.select("#canvas3d").node().getContext("2d");
    c.clearRect(0, 0, width, height);
    c.fillStyle = "#bbb", c.beginPath(), path3d(land), c.fill();
    //c.fillStyle = "#f00", c.beginPath(), path3d(countries[i]), c.fill();
    c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path3d(borders), c.stroke();
    c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path3d(globe), c.stroke();
}
var zoomMap = d3.behavior.zoom().x(xScalezoom).y(yScalezoom)
                    .center([width / 2, height / 2])
                    .scaleExtent([1, 500])//设置缩放范围
                    .on("zoom", zoomed);

var canvas = d3.select("#global3Ddiv").append("canvas").attr("id","canvas3d").call(zoomMap)
    .attr("width", width)
    .attr("height", height);

var c = canvas.node().getContext("2d");

var path3d = d3.geo.path()
    .projection(projection3d)
    .context(c);

var title = d3.select("h1");

queue()
    .defer(d3.json, "./data/earthdata/world-110m.json")
    .defer(d3.tsv, "./data/earthdata/world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {
  if (error) throw error;

  globe = {type: "Sphere"};
  land = topojson.feature(world, world.objects.land);
  countries = topojson.feature(world, world.objects.countries).features;
  borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
  var i = -1,
      n = countries.length;

  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  (function transition() {
    d3.transition()
        .duration(1250)
        .each("start", function() {
          title.text(countries[i = (i + 1) % n].name);
        })
        .tween("rotate", function() {
          var p = d3.geo.centroid(countries[i]),
              r = d3.interpolate(projection3d.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection3d.rotate(r(t));
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#bbb", c.beginPath(), path3d(land), c.fill();
            c.fillStyle = "#f00", c.beginPath(), path3d(countries[i]), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path3d(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path3d(globe), c.stroke();
          };
        })
      .transition();
      //.each("end", transition);
  })();
}*/
///////////////////////////////////////////纯d3模拟3D///////////////////////////////////
/*d3.demo = {};
d3.demo.canvas = function() {

    "use strict";

    var _width           = 405,
        _height          = 450,
        zoomEnabled     = true,
        dragEnabled     = true,
        scale           = 1,
        translation     = [0,0],
        base            = null,
        wrapperBorder   = 2,
        minimap         = null,
        minimapPadding  = 20,
        minimapScale    = 0.25,
        nodes           = [],
        circles         = [];

    function canvas(selection) {
      console.log(selection);
        base = selection;
        _width = document.getElementById('mapdiv').clientWidth;
        _height = document.getElementById('mapdiv').clientHeight;

        var xScale = d3.scale.linear()
            .domain([-_width / 2, _width / 2])
            .range([0, _width]);

        var yScale = d3.scale.linear()
            .domain([-_height / 2, _height / 2])
            .range([_height, 0]);

        var zoomHandler = function(newScale) {
            if (!zoomEnabled) { return; }
            if (d3.event) {
                scale = d3.event.scale;
            } else {
                scale = newScale;
            }
            if (dragEnabled) {
                var tbound = -_height * scale,
                    bbound = _height  * scale,
                    lbound = -_width  * scale,
                    rbound = _width   * scale;
                // limit translation to thresholds
                translation = d3.event ? d3.event.translate : [0, 0];
                translation = [
                    Math.max(Math.min(translation[0], rbound), lbound),
                    Math.max(Math.min(translation[1], bbound), tbound)
                ];
            }

            d3.select(".panCanvas, .panCanvas .bg")
                .attr("transform", "translate(" + translation + ")" + " scale(" + scale + ")");

            //minimap.scale(scale).render();
        }; // startoff zoomed in a bit to show pan/zoom rectangle
            
        var zoom = d3.behavior.zoom()
            .x(xScale)
            .y(yScale)
            .scaleExtent([0.5, 5])
            .on("zoom.canvas", zoomHandler);

        var svg = selection.append("svg")
            .attr("class", "svg canvas")
            .attr("width",  _width  + (wrapperBorder*2) + minimapPadding*2 + (_width*minimapScale))
            .attr("height", _height + (wrapperBorder*2) + minimapPadding*2)
            .attr("shape-rendering", "auto");

        var svgDefs = svg.append("defs");

        svgDefs.append("clipPath")
            .attr("id", "wrapperClipPathDemo01_cwbjo")
            .attr("class", "wrapper clipPath")
            .append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);
            
        svgDefs.append("clipPath")
            .attr("id", "minimapClipPath_cwbjo")
            //.attr("class", "minimap clipPath")
            .attr("width", _width)
            .attr("height", _height)
            .attr("transform", "translate(" + (_width + minimapPadding) + "," + (minimapPadding/2) + ")")
            .append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);
            
        var filter = svgDefs.append("svg:filter")
            .attr("id", "minimapDropShadow_cwbjo")
            .attr("x", "-20%")
            .attr("y", "-20%")
            .attr("width", "150%")
            .attr("height", "150%");

        filter.append("svg:feOffset")
            .attr("result", "offOut")
            .attr("in", "SourceGraphic")
            .attr("dx", "1")
            .attr("dy", "1");

        filter.append("svg:feColorMatrix")
            .attr("result", "matrixOut")
            .attr("in", "offOut")
            .attr("type", "matrix")
            .attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.5 0");

        filter.append("svg:feGaussianBlur")
            .attr("result", "blurOut")
            .attr("in", "matrixOut")
            .attr("stdDeviation", "10");

        filter.append("svg:feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");
            
        var minimapRadialFill = svgDefs.append("radialGradient")
            .attr({
                id:"minimapGradient",
                gradientUnits:"userSpaceOnUse",
                cx:"500",
                cy:"500",
                r:"400",
                fx:"500",
                fy:"500"
            });
        minimapRadialFill.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#FFFFFF");
        minimapRadialFill.append("stop")
            .attr("offset", "40%")
            .attr("stop-color", "#EEEEEE");
        minimapRadialFill.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#E0E0E0");

        var outerWrapper = svg.append("g")
            .attr("class", "wrapper outer")
            .attr("transform", "translate(0, " + minimapPadding + ")");

        outerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", _width + wrapperBorder*2)
            .attr("height", _height + wrapperBorder*2);

        var innerWrapper = outerWrapper.append("g")
            .attr("class", "wrapper inner")
            .attr("clip-path", "url(#wrapperClipPathDemo01_cwbjo)")
            .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
            .call(zoom);

        innerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);

        var panCanvas = innerWrapper.append("g")
            .attr("class", "panCanvas")
            .attr("width", _width)
            .attr("height", _height)
            .attr("transform", "translate(0,0)");

        panCanvas.append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);

        minimap = d3.demo.minimap()
            .zoom(zoom)
            .target(panCanvas)
            .minimapScale(minimapScale)
            .x(_width + minimapPadding)
            .y(minimapPadding);

        svg.call(minimap);
            
        // startoff zoomed in a bit to show pan/zoom rectangle
        zoom.scale(1.25);
        zoomHandler(1.25);

        //ADD SHAPE //
        canvas.addItem = function(item) {
            panCanvas.node().appendChild(item.node());
            minimap.render();
        };
      
        canvas.loadMap = function() {
            var height = 300;
            var width = 600;
            var projection = d3.geo.orthographic().translate([width / 2, height / 2]).clipAngle(85);
            var path = d3.geo.path().projection(projection);
            var i = 0;
            var water = panCanvas.append("path")
                .datum({type: "Sphere"})
                .attr("class", "water").attr("transform", "translate(-99,44)scale(0.90)")
                .attr("d", path);
            var svg = panCanvas.append("svg")
                .attr("width", width)
                .attr("height", height);
            d3.json('./data/mapdata/world-50m.json', function(data) {
              var countries = topojson.feature(data, data.objects.countries);
              var mexico = countries.features[102];
              var map = svg.append('g').attr('class', 'boundary').attr("transform", "translate(-130,30)");
              var world = map.selectAll('path').data(countries.features);
              mexico = map.selectAll('.mexico').data([mexico]);
              projection.scale(1).translate([0, 0]);
              var b = path.bounds(countries);
              var s = 0.9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
              var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
              projection.scale(s).translate(t);
              world.enter()
                  .append('path')
                  .attr('d', path);
              mexico.enter()
                  .append('path')
                  .attr('class', 'mexico')
                  .attr('d', path)
                  .style('fill', 'lightyellow').style('stroke', 'orange');
              //setInterval(function() {
                  //i = i+0.5;
                  //projection.rotate([i,0,0]);
                  //world.attr('d', path);
                  //mexico.attr('d', path).style('fill', 'lightyellow').style('stroke', 'orange');
                  //minimap.render();
              //}, 20);
            });
        };

        
        // RENDER //
        canvas.render = function() {
            svgDefs
                .select(".clipPath .background")
                .attr("width", _width)
                .attr("height", _height);

            svg
                .attr("width",  _width  + (wrapperBorder*2) + minimapPadding*2 + (_width*minimapScale))
                .attr("height", _height + (wrapperBorder*2));

            outerWrapper
                .select(".background")
                .attr("width", _width + wrapperBorder*2)
                .attr("height", _height + wrapperBorder*2);

            innerWrapper
                .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
                .select(".background")
                .attr("width", _width)
                .attr("height", _height);

            panCanvas
                .attr("width", _width)
                .attr("height", _height)
                .select(".background")
                .attr("width", _width)
                .attr("height", _height);

            minimap
                .x(_width + minimapPadding)
                .y(minimapPadding)
                .render();
        };

        canvas.zoomEnabled = function(isEnabled) {
            if (!arguments.length) { return zoomEnabled; }
            zoomEnabled = isEnabled;
        };

        canvas.dragEnabled = function(isEnabled) {
            if (!arguments.length) { return dragEnabled; }
            dragEnabled = isEnabled;
        };

        canvas.reset = function() {
            d3.transition().duration(750).tween("zoom", function() {
                var ix = d3.interpolate(xScale.domain(), [-_width  / 2, _width  / 2]),
                    iy = d3.interpolate(yScale.domain(), [-_height / 2, _height / 2]),
                    iz = d3.interpolate(scale, 1);
                return function(t) {
                    zoom.scale(iz(t)).x(xScale.domain(ix(t))).y(yScale.domain(iy(t)));
                    zoomHandler(iz(t));
                };
            });
        };
    }

    //============================================================
    // Accessors
    //============================================================

    canvas.width = function(value) {
        if (!arguments.length) return _width;
        _width = parseInt(value, 10);
        return this;
    };

    canvas.height = function(value) {
        if (!arguments.length) return _height;
        _height = parseInt(value, 10);
        return this;
    };

    canvas.scale = function(value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return this;
    };
    
    canvas.nodes = function(value) {
        if (!arguments.length) { return nodes; }
        nodes = value;
        return this;
    };

    return canvas;
};


//MINIMAP //
d3.demo.minimap = function() {

    "use strict";

    var minimapScale    = 0.1,
        scale           = 1,
        zoom            = null,
        base            = null,
        target          = null,
        width           = 0,
        height          = 0,
        x               = 0,
        y               = 0,
        frameX          = 0,
        frameY          = 0;

    function minimap(selection) {

        base = selection;

        var container = selection.append("g")
            .attr("class", "minimap")
            .call(zoom);

        zoom.on("zoom.minimap", function() {
            scale = d3.event.scale;
        });
      
        minimap.node = container.node();

        var frame = container.append("g")
            .attr("class", "frame");

        frame.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("filter", "url(#minimapDropShadow_cwbjo)");

        var drag = d3.behavior.drag()
            .on("dragstart.minimap", function() {
                var frameTranslate = d3.demo.util.getXYFromTranslate(frame.attr("transform"));
                frameX = frameTranslate[0];
                frameY = frameTranslate[1];
            })
            .on("drag.minimap", function() {
                d3.event.sourceEvent.stopImmediatePropagation();
                frameX += d3.event.dx;
                frameY += d3.event.dy;
                frame.attr("transform", "translate(" + frameX + "," + frameY + ")");
                var translate =  [(-frameX*scale),(-frameY*scale)];
                target.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                zoom.translate(translate);
            });

        frame.call(drag);

        //RENDER //
        minimap.render = function() {
            scale = zoom.scale();
            container.attr("transform", "translate(" + x + "," + y + ")scale(" + minimapScale + ")");
            var node = target.node().cloneNode(true);
            node.removeAttribute("id");
            base.selectAll(".minimap .panCanvas").remove();
            minimap.node.appendChild(node);
            var targetTransform = d3.demo.util.getXYFromTranslate(target.attr("transform"));
            frame.attr("transform", "translate(" + (-targetTransform[0]/scale) + "," + (-targetTransform[1]/scale) + ")")
                .select(".background")
                .attr("width", width/scale)
                .attr("height", height/scale);
            frame.node().parentNode.appendChild(frame.node());
            d3.select(node).attr("transform", "translate(1,1)");
        };
    }


    //============================================================
    // Accessors
    //============================================================


    minimap.width = function(value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    };


    minimap.height = function(value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    };


    minimap.x = function(value) {
        if (!arguments.length) return x;
        x = parseInt(value, 10);
        return this;
    };


    minimap.y = function(value) {
        if (!arguments.length) return y;
        y = parseInt(value, 10);
        return this;
    };


    minimap.scale = function(value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return this;
    };


    minimap.minimapScale = function(value) {
        if (!arguments.length) { return minimapScale; }
        minimapScale = value;
        return this;
    };


    minimap.zoom = function(value) {
        if (!arguments.length) return zoom;
        zoom = value;
        return this;
    };


    minimap.target = function(value) {
        if (!arguments.length) { return target; }
        target = value;
        width  = parseInt(target.attr("width"),  10);
        height = parseInt(target.attr("height"), 10);
        return this;
    };

    return minimap;
};


//UTILS //
d3.demo.util = {};
d3.demo.util.getXYFromTranslate = function(translateString) {
    var split = translateString.split(",");
    var x = split[0] ? ~~split[0].split("(")[1] : 0;
    var y = split[1] ? ~~split[1].split(")")[0] : 0;
    return [x, y];
};

var circleCount = 0;
var canvas = d3.demo.canvas();
d3.select("#global3Ddiv").call(canvas);

canvas.loadMap();*/
///////////////////////////////////////////模拟3D///////////////////////////////////