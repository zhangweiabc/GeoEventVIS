function DrawHeatMapSVG(){
    d3.csv("data/sgadata.csv", function(data) {
        data.forEach(function(d) { 
            d.score = +d.score;
            d.row = +d.row;
            d.col = +d.col;
        });
    //height of each row in the heatmap
    //width of each column in the heatmap
    var heatmaph = 1024;
    var heatmapw = 768;
    var rectPadding = 60;

    $('#mapdiv').empty();

    var mySVG = d3.select("#mapdiv")
                  .style('top',0)
                  .style('left',0);

    var colorScale = d3.scale.linear()
                        .domain([-1, 0, 1])
                        .range(["#F16745", "#F16745", "#F16745"]);

    var rowNest = d3.nest()
                .key(function(d) { return d.row; })
                .key(function(d) { return d.col; });

    var dataByRows = rowNest.entries(data);

        mySVG.forEach(function(){
                var heatmapRow = mySVG.selectAll(".heatmap")
                    .data(dataByRows, function(d) { return d.key; })
                    .enter().append("g");

                //For each row, generate rects based on columns - this is where I get stuck
            heatmapRow.forEach(function(){
            var heatmapRects = heatmapRow
                .selectAll(".rect")
                .data(function(d) {return d.score;})
                .enter().append("svg:rect")
                .attr('width',heatmapw)
                .attr('height',heatmaph)
                .attr('x', function(d) {return (d.row * heatmapw) + rectPadding;})
                .attr('y', function(d) {return (d.col * heatmaph) + rectPadding;})
                .style('fill',function(d) {
                    if(d.score == NaN){return colorNA;}
                    return colorScale(d.score);
                         })

            })
        })
    });
}