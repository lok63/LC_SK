//******************************************************************************
var svg = d3.select("body").append("svg")
    .attr("height","50%")
    .attr("width","100%");
//******************************************************************************

//************************Global Variables**************************************
//******************************************************************************
var circleData = new Array();
var squareData = new Array();
var tableBool = true;

function start() {
  //*********************** Read Data ********************************************
  /*
  D3 has a unique way to handle external data, using this method we read the data from
  the external JSON file and we must call all our methods that require data here
  Unfortunately we cant store data to global variables and use them outside of this scope
  */

  d3.json("test.json", function(error,data){
    if (error){console.log(console.log("Error with dataset"));}
    else{
      if(data == null || data.lenght == 0 || data.length == 1){
        console.log("Error with dataset");
      }
      console.log(data);
      ds =  checkUselessChars(data);
    }
    //call your function here


  });

  //**************** Check first row for useless charachters *********************
  function checkUselessChars(data){
    if (Object.keys(data[0]).length < 18){
      var temp = data[0];
      data.splice(0,1);
        svg.select("#checkUselessChars")
            .style("fill","grey")
            .on("click",function(){console.log(temp)});
      return data;
    }
    return data;
  }
}
//******************************************************************************
// **************             D3 VISUALISATIONS                *****************
//******************************************************************************


//******************************************************************************
/*Circle*/
     svg.append("circle")
             .style("stroke", "gray")
             .style("fill", "white")
             .attr("id","checkUselessChars")
             .attr("r", 20)
             .attr("cx", 600)
             .attr("cy", 80)
             .on("mouseover", function(){d3.select(this).style("stroke", "red");})
             .on("mouseout", function(){d3.select(this).style("stroke", "black");})

             ;


//******************************************************************************
/*Squares*/
  svg.append("rect")
          .style("stroke","gray")
          .style("fill","white")
          .attr("x",650)
          .attr("y",20)
          .attr("width",40)
          .attr("height",40)
          .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
          .on("mouseout", function(){d3.select(this).style("fill", "white");})

        ;


//******************************************************************************
/*Line*/

svg.append("line")
        .attr("x1","650")
        .attr("x2",600)
        .attr("y1",40)
        .attr("y2",80)
        .attr("stroke-width","1");

//******************************************************************************
