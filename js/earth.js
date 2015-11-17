/*
//开启Three.js渲染器
 var renderer;//声明全局变量（对象）
 function initThree() {
    width = document.getElementById('mapdiv').clientWidth;//获取画布「canvas3d」的宽
    height = document.getElementById('mapdiv').clientHeight;//获取画布「canvas3d」的高
    renderer=new THREE.WebGLRenderer({antialias:true});//生成渲染器对象（属性：抗锯齿效果为设置有效）
    renderer.setSize(width, height );//指定渲染器的高宽（和画布框大小一致）
    document.getElementById('global3Ddiv').appendChild(renderer.domElement);//追加 【canvas】 元素到 【canvas3d】 元素中。
    //renderer.setClearColorHex(0xFFFFFF, 1.0);//设置canvas背景色(clearColor)
  }
   //设置相机
  var camera;
  function initCamera() { 
    camera = new THREE.PerspectiveCamera( 45, width / height , 1 , 5000 );//设置透视投影的相机,默认情况下相机的上方向为Y轴，右方向为X轴，沿着Z轴朝里（视野角：fov 纵横比：aspect 相机离视体积最近的距离：near 相机离视体积最远的距离：far）
    camera.position.x = 0;//设置相机的位置坐标
    camera.position.y = 50;//设置相机的位置坐标
    camera.position.z = 100;//设置相机的位置坐标
    camera.up.x = 0;//设置相机的上为「x」轴方向
    camera.up.y = 1;//设置相机的上为「y」轴方向
    camera.up.z = 0;//设置相机的上为「z」轴方向
    camera.lookAt( {x:0, y:0, z:0 } );//设置视野的中心坐标
  }
   //设置场景
  var scene;
  function initScene() {   
    scene = new THREE.Scene();
  }

  //设置光源
  var light;
  function initLight() { 
    light = new THREE.DirectionalLight(0xff0000, 1.0, 0);//设置平行光源
    light.position.set( 200, 200, 200 );//设置光源向量
    scene.add(light);// 追加光源到场景
  }
   //设置物体
  var sphere;
  function initObject(){  
    sphere = new THREE.Mesh(
         new THREE.SphereGeometry(20,20),                //width,height,depth
         new THREE.MeshLambertMaterial({
         		map: THREE.ImageUtils.loadTexture('img/2_no_clouds_8k.jpg')})
         		//color: 0xff0000}) //材质设定
    );
    scene.add(sphere);
    sphere.position.set(0,0,0);

  }
  //执行
  function threeStart() {
    initThree();
    initCamera();
    initScene();   
    initLight();
    initObject();
    renderer.clear(); 
    renderer.render(scene, camera);
  }
  threeStart();*/
var  width = document.getElementById('mapdiv').clientWidth;//获取画布「canvas3d」的宽
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
    var sphere = new THREE.SphereGeometry(250, 100, 100);
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

    /*function render() {
      root.rotation.y += 0.005;
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();*/
    setTimeout(function(){return renderer.render(scene, camera);},1000);
  });
///////////////////////////////////////////模拟3D///////////////////////////////////
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