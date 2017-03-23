//I have a bug. On data5.json the first row should be removed
//i have a bag as well with FIRST and LAST. I have to many of them
//Problem with else if 12 -- change speed with d10


//gapTime -->
//destinations --> works
//ELSEIF 1 --> works
//ELSEIF 2 --> works
//ELSEIF 3 --> check this method with Stelios
//ELSEIF 4 --> works
//ELSEIF 5 --> 99% works
//ELSEIF 5.5 --> works but algorithm is wrong according to the comment
//ELSEIF 6 --> works
//ELSEIF 7 -->
//ELSEIF 8 --> Date()
//ELSEIF 9 --> works
//ELSEIF 10--> works
//ELSEIF 11--> Date()
//ELSEIF 12--> might work
//ELSEIF 13--> might work
//ELSEIF 14--> works
//ELSEIF 15--> first if works
//Check A --> In the java code i believe it deletes the wrong lines
//Check A --> need to verify with Stelios if the algorithm is correct
//Check B--> Works
//Check C--> might work







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
var prevTimestamp,currTimestamp,currDate,prevDate;
var gapTime;
var temp;
var format = new simpleDateFormat();
format.applyPattern("dd/MM/yyyy HH:mm:ss");


function start() {
  //*********************** Read Data ********************************************
  /*
  D3 has a unique way to handle external data, using this method we read the data from
  the external JSON file and we must call all our methods that require data here
  Unfortunately we cant store data to global variables and use them outside of this scope
  */

  d3.json("data/data5.json", function(error,data){
    if (error){console.log(console.log("Error with dataset"));}
    else{
      if(data == null || data.lenght == 0 || data.length == 1){
        console.log("Error with dataset");
      }
      //add a new columns for RouteEvent
      data.forEach(function(e){
        if(e['RouteEvent']='LAST'){
          e['RouteEvent']='';
        };
      });

      console.log(data);
      ds =  checkUselessChars(data);
      console.log(ds);

    }
    //call your functions here

    var len = ds.length;

    for ( var i = 0;  i < ds.length; i++){
      var curr,prev,next;

      if(i==0){
        curr = i;
        next = i+1;
        prev = null;
      }
      else if(i == ds.length-1){
        curr = i;
        prev = i-1;
        next = null;
      }
      else{
        curr = i;
        prev = i-1;
        next = i+1;
      }

      //*********************** Calculate gapTime ********************************************

      if (prev !== null){
        //console.log(ds[curr]["timeStamp"]);
        currTimestamp = ds[curr]["timeStamp"];
        prevTimestamp = ds[prev]["timeStamp"];

        try{
          currDate = new Date(currTimestamp);
          prevDate = new Date(prevTimestamp);
        } catch(err){
          console.log(err);
        }
        console.log(currDate);
//---------> TODO: FIx the format so you can initialise the gapTime
         //console.log(currDate);
      }

      //*********************** Destinations ********************************************
      // If the train is starting from a "non-depot station" but it is arriving to
      // a "depot station" removes the first row; otherwise labels the first row as "FIRST".
      if((ds[curr]["event"].includes("START")) && (prev) //if prev !== null or undefined
          && (!ds[curr]["destination"].includes("Sidings")
            && !ds[curr]["destination"].includes("Depot")
            && !ds[curr]["destination"].includes("Shed"))){

              svg.select("#destinations").style("fill","grey");

              if(next !== null){
                var nextStation = ds[next]["destination"];
                if(nextStation.includes("Sidings")
                  ||nextStation.includes("Depot")
                  ||nextStation.includes("Shed")){

                    svg.select("#destinations--remove")
                        .style("fill","grey")
                        .on("click",function(){console.log(ds[curr])});
                    //console.log("'destination' row was removed:");
                    //console.log(ds[curr]);
                    ds.splice(curr,1);
                  }
                  else{
                    ds[curr]["RouteEvent"] = "FIRST" ;
                    svg.select("#destinations--assign")
                        .style("fill","grey")
                        .on("click",function(){console.log(ds[curr])});
                    //console.log("'destination' row assigned FIRST:");
                    //console.log(ds[curr]);

                  }
              }
            }
        //*********************** elseif 1 ********************************************
        // If the train comes from Brixto, or Bromley South or Denmark Hill and stops to Victoria Sidings,
        // just remove the rows that contain Victoria Sidings, because it is not part of the route and it is
        // not the terminal station.
        else if((ds[curr]["destination"].includes("Brixton")
              || ds[curr]["destination"].includes("Bromley South")
              || ds[curr]["destination"].includes("Denmark"))
  					  && ds[curr]["event"].includes("START") && next!== null) {

          if(ds[next]["destination"].includes("Victoria Sidings")) {
              //console.log("ELSEIF 1 row was deleted:");
              //console.log(ds[next]);
              ds.splice(next,1);
              while(ds[next]["destination"].includes("Victoria Sidings")){
                //console.log("ELSEIF 1 row was deleted:");
                //console.log(ds[next]);
                ds.splice(next,1);
              }
  			}
      }

      //*********************** elseif 2 ********************************************
      // Removes Slate Green Depot rows when the previous read station is Slade Green.

      else if (ds[curr]["destination"]==="Slade Green" && ds[curr]["event"].includes("START")){
        if(next!==null){
          if(ds[next]["destination"].includes("Slade Green Depot")){
            //console.log("ELSEIF 2 row was deleted:");
            //console.log(ds[next]);
            ds.splice(next,1);
            while (ds[next]["destination"].includes("Slade Green Depot")){
              //console.log("ELSEIF 2 row was deleted:");
              //console.log(ds[next]);
              ds.splice(next,1);
            }
          }

        }
      }
      //*********************** elseif 3 ********************************************
      /* When a train starts from a "non-depot station" and stops to a "depot station",
        assigns the label "LAST" to the "non-depot station" row that contains the STOP event
        and deletes the subsequent rows. */
      else if (prev !== null && ( ds[curr]["destination"].includes("Sidings")
              || ds[curr]["destination"].includes("Depot")
              || ds[curr]["destination"].includes("Shed")) && (ds[prev]["event"].includes("START"))
              && ((!ds[prev]["destination"].includes("Sidings")
                && !ds[prev]["destination"].includes("Depot")
                && !ds[prev]["destination"].includes("Shed")))){

                  //console.log("Row was assigmed with LAST");
                  //console.log(ds[prev-1]);
                  ds[prev-1]["RouteEvent"] = "LAST";

                  //console.log( "row after LAST was removed");
                  //console.log(ds[prev]);
                  ds.splice(prev,1);

                  //console.log("Depot row was removed")
                  //console.log(ds[curr]);
                  ds.splice(curr,1);
                }

              //*********************** elseif 4 ********************************************
              // Removes the rows that contain Sidings, Depot or Shed.

              /* If i delete the row once then i will cgange so curr increment by one.
              When i remove the element at position [0] then the next element will placed at position [0]
              The error here is that the curr always will skip an element because the index incerements and misses elements
              So how do i target this problem? */

              else if (ds[curr]["destination"].includes("Sidings")
                    || ds[curr]["destination"].includes("Depot")
                    || ds[curr]["destination"].includes("Shed")) {


                      //console.log("Depot rows were removed");
                      //console.log(ds[curr]);
                      ds.splice(curr,1);

                      //i = i-1;

                      while(ds[curr]["destination"].includes("Sidings")
                            || ds[curr]["destination"].includes("Depot")
                            || ds[curr]["destination"].includes("Shed")){
                              //console.log("Depot rows were removed");
                              //console.log(ds[curr]);
                              ds.splice(curr,1);
                            }

              }

              //*********************** elseif 5 ********************************************
              // When a train starts and stops into the same station, remove the corresponding rows
              // and labels the previous available row as the last and the next available station as
              // the first.
              else if ((prev !== null)
                    && (ds[prev]["destination"] === ds[curr]["destination"])
                    && (ds[prev]["event"] === "START")
                    && (ds[curr]["event"] === "STOP")) {

                      if(prev-1 >=0){
                        if(!ds[prev-1]["RouteEvent"].includes("LAST")){
                          //console.log("ELSEIF 5 - LAST on");
                          //console.log(ds[prev-1]);
                          ds[prev-1]["RouteEvent"] ="LAST";
                        }
                      }
                        //console.log("ELSEIF 5 raw removed");
                        //console.log(ds[prev]);
                        ds.splice(prev,1);

                        //console.log("ELSEIF 5 raw removed");
                        //console.log(ds[prev]);
                        ds.splice(prev,1);

                        if(prev<= ds.length-1){
                          //console.log("ELSEIF 5 FIRST on");
                          //console.log(ds[prev]);
                          ds[prev]["RouteEvent"] = "FIRST";
                        }
                      }


              //*********************** elseif 5,5 ********************************************
              // When a train starts from a "depot station" and stops to a "non-depot station"
              // removes the "non-depot station" with the STOP event and labels the next available
              // station as the first.
              else if(prev !== null && (ds[prev]["destination"].includes("Sidings")
                   || ds[prev]["destination"].includes("Depot")
                   || ds[prev]["destination"].includes("Shed")) && (ds[curr]["event"].includes("STOP"))){
                     //console.log("ELSEIF 5.5 row removed");
                     //console.log(ds[curr]);
                     ds.splice(curr,1);
                     if(curr<= ds.length-1){
                       //console.log("ELSEIF 5.5 FIRST on");
                       //console.log(ds[prev]);
                       ds[curr]["RouteEvent"] = "FIRST";
                     }
                   }

              //*********************** elseif 6 ********************************************
              // excludes Dartford -> Crayford sequence from the computation.
              else if (ds[curr]["destination"].includes("Dartford") && ds[prev]["event"].includes("START")){
                    if (next !== null || next <= ds.length-1){
                      if (ds[next]["destination"].includes("Crayford")){
                        console.log("did nothing");
                      }
                    }
                  }
              //*********************** elseif 7 ********************************************
              // Sequence Slade Green, Erith
//----------> TODO: need someone to explain me how this works
              else if(ds[curr]["destination"]=== "Erith" && ds[prev]["destination"] === "Slade Green" ){

              }
              //*********************** elseif 8 ********************************************
              // Removes LAST and FIRST labels when the sequence of stops corresponds to
              // Dartford -> Crayford OR Deptford -> Greenwich
              // Hither green ->Lee or Waterloo East and reverse
              else if(
                    (ds[curr]["destination"].includes("Greenwich") && ds[prev]["destination"].includes("Deptford"))||
                    ((ds[curr]["destination"].includes("Lee") || ds[curr]["destination"].includes("Waterloo East"))
                       && ds[prev]["destination"].includes("Hither Green"))){

                         if((prev-1) >0){
                           if(ds[prev-1]["RouteEvent"] === "LAST"){
                             //console.log("LAST was remove from ");
                             //console.log(ds[prev-1]);
                             ds[prev-1]["RouteEvent"]= "";
                           }
                         }
                         if(ds[curr]["RouteEvent"] === "FIRST"){
                            //console.log("FIRST was remove from ");
                            //console.log(ds[curr]);
                            ds[curr]["RouteEvent"] = "";
                         }
                       }
//---------> need to check this with lefteris

            //*********************** elseif 8 ********************************************
            // Removes the rows from the dataset when the sequence of stops corresponds to
            // Bellingham -> Orpington
            else if(ds[curr]["destination"].includes("Bellingham")){
              if(ds[next]["destination"].includes("Orpington") && ds[next]["event"].includes("STOP")){
                //console.log("ELSEIF 8 - row removed:")
                //console.log(ds[prev]);
                ds.splice(ds[prev],1);

                //console.log("ELSEIF 8 - row removed:");
                //console.log(ds[prev]);
                ds.splice(ds[prev],1);

                if(ds[prev]["RouteEvent"] !== "FIRST"){
                  //console.log("ELSEIF 8 - row was assigned as FIRST:");
                  //console.log(ds[prev]);
                  ds[prev]["RouteEvent"] = "FIRST";
                }
              }
            }
//---------> my dataset don't contain any data like this, it alsw need to be checked

            //*********************** elseif 8 ********************************************
            // If the train is stopped for more than 4 minutes, labels the last visited stations as
            // the LAST and the FIRST of a route.

            //*********************** elseif 9 ********************************************
            else if(
              (ds[curr]["destination"] === "Barnehurst"
            && ds[prev]["destination"] === "Slade Green")
            ||
              (ds[curr]["destination"] === "Crayford"
            && ds[prev]["destination"] === "Barnehurst")
            ||
              (ds[curr]["destination"] === "Barnehurst"
            && ds[prev]["destination"] === "Crayford")
          ){

            if(ds[curr]["RouteEvent"] !== "LAST"){
              //console.log("ELSEIF 9 row assigned LAST");
              //console.log(ds[curr]);
              ds[curr]["RouteEvent"] = "LAST";
            }
            if(ds[next]["RouteEvent"] !== "FIRST"){
              //console.log("ELSEIF 9 row assigned FIRST");
              //console.log(ds[next]);
              ds[next]["RouteEvent"] = "FIRST";
            }
          }
          //*********************** elseif 10 ********************************************
          else if(
            (ds[curr]["destination"]=== "London Victoria"
            && ds[prev]["destination"]=== "Hayes")

          ||(ds[curr]["destination"]=== "Charing Cross"
            && ds[prev]["destination"]=== "Orpington")

          ||(ds[curr]["destination"]=== "Orpington"
            && ds[prev]["destination"]=== "Charing Cross")

          ||(ds[curr]["destination"]=== "Beckenham Junction Station"
            && ds[prev]["destination"]=== "London Victoria")

          ||(ds[curr]["destination"]=== "Charing Cross"
            && ds[prev]["destination"]=== "Hayes")

          ||(ds[curr]["destination"]=== "Hayes"
            && ds[prev]["destination"]=== "Charing Cross")

          ||(ds[curr]["destination"]=== "Charing Cross"
            && ds[prev]["destination"]=== "Crayford")

          ||(ds[curr]["destination"]=== "Ashford International"
            && ds[prev]["destination"]=== "Folkestone Central")

          ||(ds[curr]["destination"]=== "Ashford International"
            && ds[prev]["destination"]=== "Canterbury West")

          ||(ds[curr]["destination"]=== "Blackfriars"
            && ds[prev]["destination"]=== "Orpington")

          ||(ds[curr]["destination"]=== "Tunbridge Wells"
            && ds[prev]["destination"]=== "London Cannon Street")

          ||(ds[curr]["destination"]=== "Tunbridge Wells"
            && ds[prev]["destination"]=== "Charing Cross")
          ){

            if((prev-1)>0){
              if(ds[prev-1]["RouteEvent"] !== "LAST"){
                //console.log("ELSEIF 10 row assigned LAST");
                //console.log(ds[prev-1]);
                ds[prev-1]["RouteEvent"] = "LAST";
              }
            }
            if(next != null){
              if(ds[next]["RouteEvent"] !== "FIRST"){
                //console.log("ELSEIF 10 row assigned FIRST");
                //console.log(ds[next]);
                ds[next]["RouteEvent"] = "FIRST";
              }
            }
            //console.log("ELSEIF 10 - row removed:");
            //console.log(ds[prev]);
            ds.splice(prev,1);

            //console.log("ELSEIF 10 - row removed:");
            //console.log(ds[prev]);
            ds.splice(prev,1);

          }

          //*********************** elseif 11 ********************************************
          // if the route is composed of only two stations, and the time between them is more than
          // 20 minutes or more than a hour, removes the rows from the dataset.

          //*********************** elseif 12 ********************************************
          // when the dds changes, that indicates the initiation of a new route.
          else if(prev != null && (ds[prev]["speed"] != ds[curr]["speed"])
                && (ds[curr]["event"] === "STOP")){
                  if(!ds[curr]["destination"].includes("London")){
                    //console.log("ELSEIF 12 row assigned LAST");
                    //console.log(ds[curr]);
                    ds[curr]["RouteEvent"] = "LAST";
                    if(next !=null){
                      //console.log("ELSEIF 12 row assigned FIRST");
                      //console.log(ds[next]);
                      ds[next]["RouteEvent"] = "FIRST";
                    }
                  }
                }

          //*********************** elseif 13 ********************************************
          // when the dds changes, that indicates the initiation of a new route.
          else if(prev != null && (ds[prev]["speed"] != ds[curr]["speed"])
                && (ds[curr]["event"] === "START")){

                  //console.log("ELSEIF 13 row assigned LAST");
                  //console.log(ds[prev]);
                  if(ds[prev]["RouteEvent"] !== "LAST"){
                    ds[prev]["RouteEvent"] = "LAST";
                  }
                  if(next !=null){
                    if(ds[next]["RouteEvent"] !== "FIRST"){
                      //console.log("ELSEIF 13 row assigned FIRST");
                      //console.log(ds[curr]);
                      ds[curr]["RouteEvent"] = "FIRST";
                    }
                  }

                }

          //*********************** elseif 14 ********************************************
          // Removes Grove Park Down Sidings rows when the previous read station is Orpington.
          else if(ds[curr]["destination"] === "Orpington" && ds[curr]["event"].includes("START") && (next!= null)){
            if(ds[next]["destination"].includes("Grove Park Down Sidings")){
              //console.log("ELSEIF 14 - row removed:");
              //console.log(ds[next]);
              ds.splice(next,1);

              while(ds[next]["destination"].includes("Grove Park Down Sidings")){
                //console.log("ELSEIF 14 - row removed:");
                //console.log(ds[next]);
                ds.splice(next,1);
              }
            }
          }

          //*********************** elseif 15 ********************************************
          else if (prev != null){
            if(curr-3 >= 0){
              if(ds[curr-3]["destination"].includes(ds[curr]["destination"])){
                if(ds[curr-3]["RouteEvent"].includes("FIRST")){

                 //console.log("ELSEIF 15 - row removed:");
                 //console.log(ds[curr-3]);
                 ds.splice(curr-3,1);

                 //console.log("ELSEIF 15 - row removed:");
                 //console.log(ds[curr-3]);
                 ds.splice(curr-3,1);
              }
              else{
                if(!ds[curr-2]["RouteEvent"].includes("LAST") && !ds[curr-2]["RouteEvent"].includes("FIRST")){
                  //console.log("ELSEIF 15 row assigned FIRST");
                  //console.log(ds[curr-2]);
                  ds[curr-2]["RouteEvent"] = "FIRST";
                }
              }
            }
          }
        }


    }//end for loop

    //*********************** Check A ********************************************
    // checks if the second to last row is labeled with FIRST and removes it and also
    // removes the last row.
    if(ds.length>3){
      if(ds[ds.length-3]["RouteEvent"].includes("FIRST")){

        console.log("Check A - row removed:");
        console.log(ds[ds.length-3,1]);
        ds.splice(ds.length-3,1);
        console.log("Check A - row removed:");
        console.log(ds[ds.length-3,1]);
        ds.splice(ds.length-3,1);
      }
    }
    //*********************** Check B ********************************************
    // checks if the last row is labeled with START and removes it.
    if(ds[ds.length-1]["event"].includes("START")){
      //console.log("Check B row was removed:");
      //console.log(ds[ds.length-1]);
      ds.splice(ds.length-1,1);
    }

    //*********************** Check C ********************************************
    // checks if the last row is labeled as LAST; if not, assigns the LAST label.
    if(!ds[ds.length-1]["RouteEvent"].includes("LAST")){
      //console.log("Check C row assigned LAST");
      //console.log(ds[ds.length-1]);
      ds[ds.length-1]["RouteEvent"] = "LAST";
    }



    console.log(ds);
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
             .attr("cy", 90)
             .on("mouseover", function(){d3.select(this).style("stroke", "red");})
             .on("mouseout", function(){d3.select(this).style("stroke", "black");})

             ;
//******************************************************************************
//******************************************************************************
/*Circle for destinations */
     svg.append("circle")
             .style("stroke", "gray")
             .style("fill", "white")
             .attr("id","destinations")
             .attr("r", 20)
             .attr("cx", 650)
             .attr("cy", 90)
             .on("mouseover", function(){d3.select(this).style("stroke", "red");})
             .on("mouseout", function(){d3.select(this).style("stroke", "black");})
             ;
//******************************************************************************
            //******************************************************************************
            /*Circle for destinations */
                 svg.append("circle")
                         .style("stroke", "gray")
                         .style("fill", "white")
                         .attr("id","destinations-if")
                         .attr("r", 20)
                         .attr("cx", 650)
                         .attr("cy", 140)
                         .on("mouseover", function(){d3.select(this).style("stroke", "red");})
                         .on("mouseout", function(){d3.select(this).style("stroke", "black");})
                         ;
             //******************************************************************************
             /*Squares*/
               svg.append("rect")
                       .style("stroke","gray")
                       .style("fill","white")
                       .attr("id","destinations--remove")
                       .attr("x",600)
                       .attr("y",180)
                       .attr("width",40)
                       .attr("height",40)
                       .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
                       .on("mouseout", function(){d3.select(this).style("fill", "white");})
                     ;
             //******************************************************************************
             //******************************************************************************
             /*Squares*/
               svg.append("rect")
                       .style("stroke","gray")
                       .style("fill","white")
                       .attr("id","destinations--assign")
                       .attr("x",670)
                       .attr("y",180)
                       .attr("width",40)
                       .attr("height",40)
                       .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
                       .on("mouseout", function(){d3.select(this).style("fill", "white");})
                     ;
             //******************************************************************************
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
