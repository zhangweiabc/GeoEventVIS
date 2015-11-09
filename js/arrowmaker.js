var arrowdefs = svglines.append("defs");
 
var arrowMarker = arrowdefs.append("marker")
            .attr("id","arrow")
            .attr("markerUnits","strokeWidth")
              .attr("markerWidth","12")
                        .attr("markerHeight","12")
                        .attr("viewBox","0 0 12 12") 
                        .attr("refX","6")
                        .attr("refY","6")
                        .attr("orient","auto");
 
var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
            
arrowMarker.append("path")
      .attr("d",arrow_path)
      .style("fill","#0aa")
      //.style("fill-opacity",0)
      .style("stroke", "#0aa")
      .style("stroke-width", 0.2);

var startMarker = arrowdefs.append("marker")
            .attr("id","startPoint")
            .attr("markerUnits","strokeWidth")
              .attr("markerWidth","12")
                        .attr("markerHeight","12")
                        .attr("viewBox","0 0 12 12") 
                        .attr("refX","6")
                        .attr("refY","6")
                        .attr("orient","auto");
            
startMarker.append("circle")
      .attr("cx",6)
      .attr("cy",6)
      .attr("r",2)
      .attr("fill","#0aa");