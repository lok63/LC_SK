var circleData = [5,10,15,20];
var squaresData = ["d","d"];
var ellipseData = [5];

var svg = d3.select("body").append("svg")
    .attr("height","100%")
    .attr("width","100%");

//******************************************************************************
//****************************** Lines *****************************************
var line = svg.append("line")
  .style("stroke", "black")
  .attr("x1", 90)
  .attr("y1", 65)
  .attr("x2", 180)
  .attr("y2", 80);

//******************************************************************************
//****************************** Circles ***************************************

//add circles
svg.selectAll("circle")
      .data(circleData)
      .enter().append("circle")
                .attr("class","circleObj")
                .attr("cx","60")
                .attr("cy",function(d,i){ return (i+1)*65 })
                .attr("r","30");
//circle text
var text = svg.selectAll("circleText")
      .data(circleData)
      .enter().append("text")
                .attr("class", "circleText")
                .attr("text-anchor", "middle")
                .attr("x", "60")
                .attr("y", function(d,i){ return (i+1)*65 })
                .text( function (d,i) { return "c" +(i+1); })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red");

//******************************************************************************
//****************************** Squares ***************************************

//add squares
var fixedY = 80;
svg.selectAll("rect")
      .data(squaresData)
      .enter().append("rect")
                .attr("height","50")
                .attr("width","50")
                .attr("x","180")
                //if i dont use 2 arguments(d,i) the function will not use i as an index but as the data in the array
                .attr("y",function(d,i){ return fixedY*(i+1)});
//square text
var text = svg.selectAll("squareText")
      .data(squaresData)
      .enter().append("text")
                .attr("class", "squaresText")
                .attr("text-anchor", "middle")
                .attr("x", "180")
                .attr("y", function(d,i){ return fixedY*(i+1)})
                .text( function (d,i) { return "s" +(i+1); })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red");

//******************************************************************************
//****************************** Ellipse ***************************************

// add ellipse
var eFixedY = 100;
var rx =45;
svg.selectAll("ellipse")
      .data(ellipseData)
      .enter().append("ellipse")
                .attr("class","second")
                .attr("cx","350")
                .attr("cy","130")
                .attr("rx",rx)
                .attr("ry",function(d){return rx/2});
//square text
var text = svg.selectAll("ellipseText")
      .data(ellipseData)
      .enter().append("text")
                .attr("class", "ellipseText")
                .attr("text-anchor", "middle")
                .attr("x", "350")
                .attr("y", "130")
                .text( function (d,i) { return "e" +(i+1); })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red");
