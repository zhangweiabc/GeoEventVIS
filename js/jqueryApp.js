$(document).ready(function(){
	$("#ptbuttonQuantu").click(function(){
		if(isshow3d)
		{
			currentScale = 1;
	  		currentTranslate = [0,0];
			projection.rotate([initRotate[0],initRotate[1]]);
     		projection.scale(initScale);
     		//projection.center(currentTranslate);
			SVGMap.projectionChange(projection1);

			handlesl.attr("cy", ysl(1));
			SVGMap.zoomMap.scale(1);
	  		SVGMap.zoomMap.translate([0,0]);

	  		ResetHeatmapData(gHeatmapdata,projection1);
		}
		else
		{
			currentScale = 1;
	  		currentTranslate = [0,0];
	  		SVGMap.scaleLOD(currentTranslate,currentScale);
	  		handlesl.attr("cy", ysl(currentScale));
	  		SVGMap.zoomMap.scale(1);
	  		SVGMap.zoomMap.translate([0,0]);

	  		ResetHeatmapData(gHeatmapdata,projection2);
	  	}
	});
	$("#ptbuttonAdd").click(function(){
		var projc;
		if(isshow3d) projc=projection;
		else projc =projection2;

		d3.json("data/gtd/my_data.json", function(error, root) {
		    if (error) 
		      return console.error(error);
		  console.log(root.length);
		});
		if(isshowcitypoint)
		{
			d3.selectAll(".chinapath").attr("opacity",1);
			d3.select("#chinamaps").attr("display","block"); 
			d3.selectAll(".chinacity").style("fill", function(d,i){return color2(i)})
				.attr("opacity",1).attr({
			        cx:function(d,i){return projc([d.x,d.y])[0]}, //Math.random()*width},
			        cy:function(d,i){return projc([d.x,90])[1]-500},
			        r:function(d,i){return 1.5}
			      })
		      	.each(function(d,i){
		        	d3.select(this)
			          .transition()
			          //.delay(500)
			          .duration(Math.random()*3000)
			          .ease("bounce-in-out")
			          .attr("cy",function(d,i){return projc([d.x,d.y])[1]});
			          /*.attr({
			            cx:function(d,i){return projc([d.x,d.y])[0]},
			            cy:function(d,i){return projc([d.x,d.y])[1]}
			          });*/
	        	});
	        isshowcitypoint=0;
	        this.value="关闭";

			setTimeout(function(){
				d3.selectAll(".chinacity").each(function(d,i){
				var aa=d3.select(this);
				var tt= 3000+i*Math.random();
				//var rr = Math.random()*5;

				d.timeid = setInterval(function(){
	        			aa.attr("r",1.5).transition().duration(tt/2).attr("r",Math.random()*5).transition().duration(tt/2).attr("r",1);
	        	},tt)});
			},3100);		
		}
		else
		{
			d3.selectAll(".chinacity").attr("opacity",0);
			d3.selectAll(".chinapath").attr("opacity",0);
			d3.select("#chinamaps").attr("display","none"); 
			isshowcitypoint=1;
			this.value="测试";
			
			d3.selectAll(".chinacity").each(function(d,i){
				clearInterval(d.timeid);
			})
			.attr({
				cx:function(d,i){return Math.random()*width},//projc([d.x,d.y])[0]},
		        cy:function(d,i){return projc([d.x,90])[1]-500},
		        r:function(d,i){return 1}
			});
		}
		
	});
	$("#ptbuttonAirport").click(function(){
		if(isshouwairports)
		{
			isshouwairports=0;
			DrawFlights();

			this.value="关闭";
		
		}
		else
		{
			isshouwairports=1;
			this.value="机场";

			RemoveFlights();
	  	}
	});
	$("#ptbuttonPoints").click(function(){
		if(isshouwpoints)
		{
			d3.selectAll(".biaojis").remove();
			isshouwpoints=0;
			this.value="点标";
		}
		else
		{
			if(isshow3d)
				DrawPointLable(gmajorcitydata,projection);
			else
				DrawPointLable(gmajorcitydata,projection2);
			isshouwpoints=1;
			this.value="关闭";
		}
	});
	$("#ptbuttonLines").click(function(){
		if(isshouwlines)
		{
			d3.selectAll(".routeline").remove();
			isshouwlines=0;
			this.value="线标";
		}
		else
		{
			DrawArrowLines();
			isshouwlines=1;
			this.value="关闭";
		}
	});
	$("#ptbuttonAreas").click(function(){

		if(isshouwareas)
		{
			d3.selectAll(".chinapath").attr("opacity",0);
			d3.select("#chinamaps").attr("display","none"); 
			d3.selectAll(".chinapath").style("fill",function(d,i){
		        return colorChina;
		    });

			isshouwareas=0;
			this.value="面域";
		}
		else
		{
			d3.selectAll(".chinapath").attr("opacity",1);
			d3.select("#chinamaps").attr("display","block"); 
			d3.selectAll(".chinapath").style("fill",function(d,i){
		      return chinainterpolatecolor(chinalinear(i));
		    });

			isshouwareas=1;
			this.value="关闭";
		}
	});
	$("#ptbuttonHeat").click(function(){
		if(isshouwheat)
		{
			d3.select(".heatmap-canvas").remove();
			d3.select("#heatmapcanvas").style("display","none");
			isshouwheat=0;
			this.value="场域";
		}
		else
		{
		  //canvas热图数据
		    d3.select("#heatmapcanvas").style("display","block");
			var heatmapdata=[];
			for(var bb in gmajorcitydata){
			  gmajorcitydata[bb].value=Math.random(100)*100;
			  heatmapdata.push(gmajorcitydata[bb]);
			};
			DrawHeatMapData(heatmapdata);
			gHeatmapdata= heatmapdata;

			isshouwheat=1;
			this.value="关闭";
		}
	});
	$("#ptbuttonGraticule").click(function(){
		if(isshowgraticule)
		{
			d3.selectAll(".graticule").attr("opacity",0);
			isshowgraticule=0;
			this.value="格网";
		}
		else
		{
			d3.selectAll(".graticule").attr("opacity",1);
			isshowgraticule=1;
			this.value="关闭";
		}
	});
	$("#ptbuttonChina").click(function(){
		if(isshowchina)
		{
			d3.selectAll(".chinapath").attr("opacity",1);
			d3.select("#chinamaps").attr("display","block"); 
		    d3.selectAll(".worldpath").each(function(d,i){
		    	if(d.id=="CHN") 
		    		d3.select(this).style("filter","url(#gaussian2)");});
		    /*d3.select("#mapdiv").style("background-color","#333333");
		    d3.selectAll(".southsea path").style("fill","#666666");*/

		    isshowchina=0;
			this.value="关闭";
		}
		else
		{
			d3.selectAll(".chinapath").attr("opacity",0);
			d3.select("#chinamaps").attr("display","none"); 
			d3.selectAll(".worldpath").each(function(d,i){
		    	if(d.id=="CHN") 
		    		d3.select(this).style("filter","none");});
			/*d3.selectAll(".chinapath").style("fill",function(d,i){
		      return chinainterpolatecolor(chinalinear(i));
		    });
		    d3.selectAll(".worldpath").style("fill",worldColor);//"#FFFFCC"
		    d3.select("#mapdiv").style("background-color",oceanColor);//"#CCFFFF"
		    d3.selectAll(".southsea path").style("fill",oceanColor);//"#FFFFCC"*/

			isshowchina=1;
			this.value="滤镜";
		}
	});
	$("#ptbuttonZhuji").click(function(){
		if(isshowzhuji)
		{
			d3.selectAll(".chinatext").attr("opacity",0);
			d3.select("#chinatexts").attr("display","none");
			isshowzhuji=0;
			this.value="注记";		
		}
		else
		{
			d3.selectAll(".chinatext").attr("opacity",1);
			d3.select("#chinatexts").attr("display","block");
			isshowzhuji=1;
			this.value="关闭";
		}
	});
	$("#ptbuttonThree").click(function(){
		if(isshow3d)
		{
			SVGMap.projectionChange(projection2);
			SVGMap.scaleLOD(currentTranslate,currentScale);
			SVGMap.zoomMap.on("zoom", SVGMap.zoomed);

			isshow3d=0;
			this.value="三维";
		}
		else
		{
			SVGMap.scaleLOD([0,0],1);

			projection.rotate([initRotate[0]+180*currentTranslate[0]/width,
		          initRotate[1]-180*currentTranslate[1]/height,
		          initRotate[2]
		        ]);
		    projection.scale(initScale*currentScale);
		    SVGMap.projectionChange(projection);
			SVGMap.zoomMap.on("zoom", SVGMap.zoomed3);

			isshow3d=1;
			this.value="二维";
		}
	});
	$("#ptbuttonAnimal").click(function(){
		if(isshowdata3d==1){
			
		   
			  
			isshowdata3d=0;
		}
		else
		{
			
			
			isshowdata3d=1;
		}
	});
});