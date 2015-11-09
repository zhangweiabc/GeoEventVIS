$(document).ready(function(){
	$("#ptbuttonQuantu").click(function(){
		
		if(isshow3d)
		{
			projection.rotate([initRotate[0],initRotate[1]]);
     		projection.scale(initScale);
     		projection.center(currentTranslate);
			d3.selectAll(".graticule").attr("d", function(d) { return path(d);}); 
			d3.select("#southseachina").attr("opacity",0);
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
			zoomMap.scale(1);
	  		zoomMap.translate([0,0]);
		}
		else
		{
			d3.select("#worldmap").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#chinamaps").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#chinatexts").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#provencemaps").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#provencetexts").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#citymaps").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#citytexts").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#points").attr("transform",  "translate(0,0)scale(1)");
		    d3.select("#graticule").attr("transform", "translate(0,0)scale(1)");
		    d3.select("#lines").attr("transform","translate(0,0)scale(1)");
		    d3.select("#airports").attr("transform","translate(0,0)scale(1)");
		    d3.select("#flights1").attr("transform", "translate(0,0)scale(1)");
		    d3.select("#southsea").attr("transform", "translate(0,0)scale(1)");

		    d3.select("#worldmap").attr("display","block");
	        d3.select("#chinamaps").attr("display","block");
	        d3.select("#chinatexts").attr("display","block");
	        d3.select("#provencemaps").attr("display","none");
	        d3.select("#provencetexts").attr("display","none");
	        d3.select("#citymaps").attr("display","none");
	        d3.select("#citytexts").attr("display","none");
	        d3.select("#svgsun").attr("display","none");
			currentScale = 1;
	  		currentTranslate = [0,0];
	  		handlesl.attr("cy", ysl(currentScale));
	  		zoomMap.scale(1);
	  		zoomMap.translate([0,0]);
	  	}
	});
	$("#ptbuttonAdd").click(function(){
		var projc;
		if(isshow3d) projc=projection;
		else projc =projection2;

		if(isshowcitypoint)
		{
			d3.selectAll(".chinacity").attr({
			        cx:function(d,i){return Math.random()*width},//projc([d.x,d.y])[0]},
			        cy:function(d,i){return projc([d.x,90])[1]-500},
			        r:function(d,i){return 1}
			      })
			      .style("fill", function(d,i){return color2(i)}).attr("opacity",1);
			      /*.style("fill",function(d){
			          var color = interpolateColor(Math.random());
			          return color.toString();
			      })*/
			      //.style("filter","url(#"+ gaussian.attr("id") +")");

	  		d3.selectAll(".chinacity").each(function(d,i){
		        d3.select(this)
		          .transition()
		          .delay(500)
		          .duration(Math.random()*5000)
		          .attr({
		            cx:function(d,i){return projc([d.x,d.y])[0]},
		            cy:function(d,i){return projc([d.x,d.y])[1]},
		            r:function(d,i){return 1.3}
		          });
	        });
	        isshowcitypoint=0;
	        this.value="关闭";
		}
		else
		{
			d3.selectAll(".chinacity").attr("opacity",0);
			isshowcitypoint=1;
			this.value="加载";
		}
		
	});
	$("#ptbuttonGraticule").click(function(){
		if(isshowgraticule)
		{
			d3.selectAll(".graticule").attr("opacity",0);
			isshowgraticule=0;
		}
		else
		{
			d3.selectAll(".graticule").attr("opacity",1);
			isshowgraticule=1;
		}
	});
	$("#ptbuttonChina").click(function(){
		if(isshowchina)
		{
			d3.selectAll(".chinapath").attr("opacity",0);
			isshowchina=0;
		}
		else
		{
			d3.selectAll(".chinapath").attr("opacity",1);
			isshowchina=1;
		}
	});
	$("#ptbuttonZhuji").click(function(){
		if(isshowzhuji)
		{
			d3.selectAll(".chinatext").attr("opacity",0);
			isshowzhuji=0;
		}
		else
		{
			d3.selectAll(".chinatext").attr("opacity",1);
			isshowzhuji=1;
		}
	});
	$("#ptbuttonTree").click(function(){
			if(isshow3d)
			{
				d3.selectAll(".graticule").attr("d", path2);
				d3.selectAll(".worldpath").attr("d", function(d) { return path2(d);}); 
				d3.selectAll(".chinapath").attr("d", function(d) { return path2(d);}); 
				d3.select("#southseachina").attr("opacity",1);
				d3.selectAll(".chinacity").attr({
					cx:function(d,i){return projection2([d.x,d.y])[0]},
    				cy:function(d,i){return projection2([d.x,d.y])[1]}
				}); 
				d3.selectAll(".chinatext").attr({
					x:function(d,i){return projection2(d.properties.cp)[0]},
    				y:function(d,i){return projection2(d.properties.cp)[1]}
				}); 
				zoomMap.on("zoom", zoomed);
				isshow3d=0;
				this.value="三维";
			}
			else
			{
				d3.selectAll(".graticule").attr("d", function(d) { return path(d);}); 
				d3.select("#southseachina").attr("opacity",0);
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
				zoomMap.on("zoom", zoomed3);
				isshow3d=1;
				this.value="二维";
			}
	});
});