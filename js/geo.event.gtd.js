//////////////////////////////////////////////WORLDMAP////////////////////////////////////////////////////////////////////
var WORLDMAP_generator =function() {
  var dataset  = {}; 
  var countries =[];


  var get3LetterMonth=function(month) {
    var name = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
    return name[month-1];
  };

  var update=function (f_year, f_month, t_year, t_month) {
    f_year = typeof f_year !== 'undefined' ? f_year : 2000;
    f_month = typeof f_month !== 'undefined' ? f_month : 1;
    t_year = typeof t_year !== 'undefined' ? t_year : 2011;
    t_month = typeof t_month !== 'undefined' ? t_month : 1;

    var totalKilled = 0;
    var data = dataset;
    var world_data = {};

    //计算各个国家总死亡人数
    for(var i=0; i < data.length; i++){
      var flag = true;
      
      if(data[i].iyear < f_year){
          flag = false;
      } else if(data[i].iyear == f_year){
        if(data[i].imonth < f_month)
          flag = false;
      };
      
      if(data[i].iyear > t_year){
        flag = false;
      } else if(data[i].iyear == t_year){
        if(data[i].imonth > t_month - 1)
          flag = false;
      };
     
      if(flag){
        totalKilled += data[i].nkill;
        if(world_data[data[i].country] == null){
          world_data[data[i].country] = data[i].nkill
        }
        else{
          world_data[data[i].country] = data[i].nkill + world_data[data[i].country];
        };  
      };
    };

    totalKilled = totalKilled.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //先删除重置，再更新
    d3.selectAll(".worldpath").style("fill",worldColor).datum(function(d,i){d.nkill = null; return d;});
    for (var country in world_data) {
      var obj = {};
      obj['fillKey'] = colorfills[Math.ceil(colorScale(world_data[country]))];//ceil向上舍入、floor向下舍入，round四舍五入
      obj['nkill'] = world_data[country];
      world_data[country] = obj;
      //var full_country_name = country_name_mapping[country];
      var selectid="#"+country.toString();
      //添加数据项，更改颜色
      d3.select(selectid).style("fill",obj['fillKey']).datum(function(d,i){ d.nkill = obj['nkill']; return d;});
    }
    
    //先删除重置，再更新
    d3.select("#htmltext").remove();
    var html =  totalKilled + ' people were killed due to Terrorism between '
                  + get3LetterMonth(f_month)+', ' + f_year + " and "+ get3LetterMonth(t_month)+', '+ t_year+'.'; 
    d3.select('#rightpanel').append("text").attr("id","htmltext").text(html);
  }; // end of update function

  var init = function() {
    var icountries=["IRQ", "PAK", "CHN", "IND"];
    var that = this;   

    d3.json("data/gtd/my_data.json", function(error, data) {
      if (error) return console.warn(error);
      
      //格式转换，必须有
      for(var i=0; i<data.length; i++) {
        data[i].iyear = parseInt(data[i].iyear);
        data[i].imonth = parseInt(data[i].imonth);
        data[i].nkill = parseInt(data[i].nkill);//死亡人数取整？？？
        data[i].country = country_id_mapping[data[i].country];
      }

      dataset = data;
      countries = icountries;

      //初始化不显示
      d3.select("#chinamaps").attr("display","none");
      d3.select("#chinatexts").attr("display","none");
      //初始化 circles
      circlesmapshow.init(data);
      //初始化timeline.js
      timeline.init(data);
      //eventdrop.js
      eventdrop.init(data);
      //初始化 sliderfilter
      sliderfilter.init();
    }); 
  }; // end of init function

  var setcountries = function(dt){
      if(countries.indexOf(dt) == -1) {
        countries.push(dt);
      } else {
        countries.splice(countries.indexOf(dt), 1);
      }  
  };
  return {
    init: init,
    dataset: dataset,
    update: update,
    countries: function() { return countries;},
    colorScale: colorScale,
    setcountries: setcountries
  };
};

////////////////////////////////////////slider///////////////////////////////////////////////////////////////////////////////////
var slider_generator = function(){
  // svg attributes
  var margin = {top:0, right:15, bottom: 20, left: 15},
      canvas_width,
      w,
      h = 130,
      barPadding = 1;

  var initCanvasSize = function(){
      canvas_width = +(d3.select('#crossfilter').style('width').replace('px', ''));
      w = canvas_width - margin.left - margin.right;
  }

  // Parsing data from sumTable.csv
  // csv format example: 
  //    time, nkill
  //    2010-1, 10

  // Time format
  // usage: format.parse("2010-1"), reuturns a Date object
  // doc: https://github.com/mbostock/d3/wiki/Time-Formatting
  var format = d3.time.format("%Y-%m");

  var upper_time_limit = new Date(2010, 12);
  var lower_time_limit = new Date(1999, 12);
  
  var dataset = [];
  var draw = function(dataset) {

    var svg = d3.select("#crossfilter")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");    
              
                
    // setting up scale
    var nkill_range = [d3.min(dataset, function(d) { return d.nkill; }),
                        d3.max(dataset, function(d) { return d.nkill; })];
    var time_range = [d3.min(dataset, function(d) { return d.time; }),
                        d3.max(dataset, function(d) { return d.time; })];
    // y-axis scale
    var yScale = d3.scale.linear()
                         .domain(nkill_range)
                         .range([0.05*h,h])
                         .nice();
                        
    // color scale
    var cScale = d3.scale.log()
                         .domain(nkill_range)
                         .range([80, 0]);                                                                        
    
    // time scale for x-axis
    var tScale = d3.time.scale()
                        .domain(time_range)
                        .nice(d3.time.year)
                        .range([0,w]);
                        //.ticks(d3.time.month, 1)
                        //.tickFormat(d3.time.format('%Y-%B'))

    var brush = d3.svg.brush()
        .x(tScale)
        .extent([new Date(2007, 12), new Date(2008, 12)])
        .on("brushend", function() {
          if (!d3.event.sourceEvent) return; // only transition after input

          var extent0 = brush.extent(),
          extent1 = extent0.map(d3.time.month.round);

          // if empty when rounded, use floor & ceil instead
          if (extent1[0] >= extent1[1]) {
            extent1[0] = d3.time.month.offset(d3.time.month.ceil(extent0[0]), -6);
            extent1[1] = d3.time.month.offset(d3.time.month.ceil(extent0[1]), 6);
          }

          if (extent1[0] < lower_time_limit) {
            extent1[0] = d3.time.month.ceil(lower_time_limit);
          }

          if (extent1[1] > upper_time_limit) {
            extent1[1] = d3.time.month.ceil(upper_time_limit);
          }

          //console.log(extent1);

          d3.select(this).transition()
            .call(brush.extent(extent1))
            .call(brush.event);
            //d3.select(this).call(brush.extent(extent1));

          update_view(extent1);
        })
        .on("brush", function(){
          var extent0 = brush.extent(),
          extent1 = extent0.map(d3.time.month.round);

          if (extent1[0] >= extent1[1]) {
            extent1[0] = d3.time.month.floor(extent0[0]);
            extent1[1] = d3.time.month.ceil(extent0[1]);
          }

          update_view(extent1);
        });
       
    // Draw the Chart
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr({
          x: function(d, i) { return i* (w/dataset.length);},
          y: function(d) { return h - yScale(d.nkill);},
          width: w / dataset.length - barPadding,
          height: function(d) { return yScale(d.nkill);},
          fill: function(d) { return "hsl(0, 0%,"+ cScale(d.nkill) + "%)";}
        });
      
    
    // Draw grid
    svg.append("g")
        .attr("class", "x grid")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.svg.axis()
        .scale(tScale)
        .orient("bottom")
        .ticks(d3.time.year, 1)
        .tickFormat(""))
        .selectAll(".tick")
        .classed("minor", function(d) { return d.getFullYear(); });

    var xAxis = d3.svg.axis()
                  .scale(tScale)
                  .orient("bottom")
                  .ticks(d3.time.year, 1)
                  .tickFormat(d3.time.format('%Y'))

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    var gBrush = svg.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.event);

    gBrush.selectAll("rect").attr("height", h);
  };

  var current_month_range;
  var update_view = function(month_range) {
    current_month_range = month_range;

    // update the world map
    WORLDMAP.update(
      month_range[0].getFullYear(), month_range[0].getMonth()+1,
      month_range[1].getFullYear(), month_range[1].getMonth()+1
    );

    // update the circlesmap
    circlesmapshow.update(month_range);
    // updta the enventdrops
    eventdrop.update(month_range);
  };

  var init = function() {
    initCanvasSize();

    // Read csv file
    /*d3.csv("data/gtd/sumTable.csv",function(data){
      dataset = data.map(function(d) {
        return {
          time: format.parse(d.time), 
          nkill: +d.nkill
        }
      });
      draw(dataset);
    });*/
    d3.json("data/gtd/event_nkill_by_month.json", function(er, d) { 
      if (er) return console.warn(er);
      dataset = [];
      for (var year in d) {
        for(var month in  d[year])
        {
          dataset.push({
              time: format.parse(year.substring(6)+"-"+month),
              nkill: parseInt(d[year][month])
          }); 
        } 
      };
      draw(dataset);
    });
  };

  var redraw = function(){
    d3.select("#crossfilter svg").remove();
    initCanvasSize();
    draw(dataset);
    update_view(current_month_range);
  };

  return {
    init: init,
    redraw: redraw,
    dataset: function() { return dataset; }
  };
};
/////////////////////////////////////circlesmap///////////////////////////////////////////////////////////////////////////////////
var circlesmap_generator = function(){
  var margin = {top:20, right:20, bottom: 20, left: 60},
      height = 40,
      cell_height = 40,
      canvas_width,
      width;

  var initCanvasSize = function(){
      canvas_width = +(d3.select('#bottompanel').style('width').replace('px', ''));
      width = canvas_width - margin.left - margin.right;
  }

  var current_month_range = [new Date(2007, 1), new Date(2008, 1)]

  var gtd_data = {};
  var formatting_data = function(raw_data) {
    // if gtd data is already formatted, then return it
    if (!_.isEmpty(gtd_data)) { return gtd_data; }

    //console.log(raw_data)
    for(var i=0; i < raw_data.length; i++){
      var country = raw_data[i].country,
      year    = +raw_data[i].iyear,
      month   = +raw_data[i].imonth,
      day     = +raw_data[i].iday,
      nkill   = +raw_data[i].nkill;

      if(_.isEmpty(gtd_data[country])) { gtd_data[country] = []; }

      date = new Date(year, month-1, day)

      gtd_data[country].push({
        time  : date,
        nkill : nkill
      });
    }

    // sort all the events by time(_.来源underscore.JS)
    _.each(gtd_data, function(country_event_list){
      country_event_list = country_event_list.sort(function(a, b){
        return a.time - b.time;
      });
    });
    return gtd_data;
  };//formatting_data()

  var dateDiff = function(from, to) {
    var milliseconds = to - from;
    return milliseconds / 86400000;
  };//dateDiff()

  var update_view = function(time_range) {
    // get the time range
    if(typeof time_range !== 'undefined'){
      current_month_range = time_range;
    }

    // countries added to list
    var countries = WORLDMAP.countries(); 

    if(countries.length == 0){
      // Remove old circlesmap if there is one
      d3.select("div#bottompanel svg").remove();
      return ;
    }

    // calculate svg height
    height = countries.length * cell_height;

    // generating data to draw with
    var data = _.map(countries, function(country) {
      var i, j;
      var res = {
        country: country, 
        days: []
      };

      var days = gtd_data[country];
      if(days === undefined) {
        return res;
      }

      var flag = true;
      for(i=0; i<days.length; i++) {
        if(days[i].time < current_month_range[0]) {
          continue;
        } 

        for(j=i; j<days.length; j++) {
          if(days[j].time > current_month_range[1]) {
            break;
          } else {
            res.days.push(days[j]);
          }
        }
        break;
      }

      return res;
    });

    //console.log(current_month_range);
    //console.log(data);

    // Remove old circlesmap if there is one
    d3.select("div#bottompanel svg").remove();

    // update the time scale to current range
    var xScale = d3.time.scale()
                    .range([0, width])
                    .domain(current_month_range);

    var rScale = d3.scale.log()
                    .domain([1, 3000])
                    .range([1, 20]);

    // Draw the updated circlesmap
    var svg = d3.select("#bottompanel")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw the xAxis text
    var days = dateDiff(current_month_range[0], current_month_range[1])
    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('top');

    if( days < 95)
      xAxis.ticks(d3.time.month, 1)
            .tickFormat(d3.time.format('%Y-%B'))
    else if (days < 500)
      xAxis.ticks(d3.time.month, 3)
            .tickFormat(d3.time.format('%Y-%B'))
    else 
      xAxis.ticks(d3.time.year, 1)
            .tickFormat(d3.time.format('%Y'))

    // Draw xAxis grid
    svg.append("g")
        .attr("class", "x grid")
        .call(xAxis);

    var circles = new Array();
    for(var i=0; i<data.length; i++){
      // draw each counrty separately
      var g = svg.append("g")

      g.selectAll("circle")
        .data(data[i]['days'])
        .enter()
        .append("circle")
        .attr("cx", function(d, i) { return xScale(d.time) })
        .attr("cy", function(d) { return (i + 0.5) * cell_height; })
        .attr("r", function(d) {return rScale(d.nkill)||0;})
        .style("stroke", 'none')
        .style("fill", "#800000")
        .style("fill-opacity", 0.5);

      g.append("g")
        .attr("class", "x grid")
        .attr("transform", "translate(0," + (cell_height * (i+1)) + ")")
        .call(xAxis.ticks(d3.time.month, 1).tickFormat(d3.time.format('')));

      var full_country_name ={}; //country_name_mapping[data[i].country];

      g.append("text")
         .attr("y", function() { return (cell_height * i) + margin.top; })
         .attr("x", 0)
         .text(_.isEmpty(full_country_name) ? data[i].country : full_country_name)
         .attr("transform", "translate( -" + margin.left + ", 0)");
    }
    // end of drawing circlesmap
  };//update_view()

  var init = function(data) {
    var that = this;
    initCanvasSize();

    that.raw_data = data;
    formatting_data(data);

    update_view();
  };//init()
  
  return {
    init: init,
    initCanvasSize: initCanvasSize,
    gtd_data: function() { return gtd_data; },
    update: update_view
  };
};//circlesmap_generator()