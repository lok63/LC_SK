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

//************************Global Variables**************************************
//******************************************************************************
var circleData = new Array();
var squareData = new Array();
var tableBool = true;
var prevTimestamp,currTimestamp,currDate,prevDate;
var gapTime;
var temp;

var firstBool,lastBool = false;
var lastIndex;
var c = 0;
var dsRoutes =[c,[]];



  //*********************** Read Data ********************************************
  /*
  D3 has a unique way to handle external data, using this method we read the data from
  the external JSON file and we must call all our methods that require data here
  Unfortunately we cant store data to global variables and use them outside of this scope
  */

  d3.json("data/data6.json", function(error,data){
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

      dsRoutes[c] = ds[curr];
      dsRoutes[c].push(ds[next]);
      dsRoutes[1] = ds[curr];
      console.log(dsRoutes);


      //*********************** Calculate gapTime ********************************************

      if (prev != null){


        function toDate(timeStamp){

          var index = timeStamp.indexOf(" ");      // Gets the first index where a space occours
          var date = timeStamp.substr(0, index);   // Gets the first part
          var time = timeStamp.substr(index + 1);  // Gets the text part

          var t = time;
          var d = date;

          const [day, month, year] = d.split("/");
          const [hours, minutes] = t.split(":");

          return new Date(year, month - 1, day, hours, minutes);
        }

        currTimestamp = toDate(ds[curr]["timeStamp"]);
        prevTimestamp = toDate(ds[prev]["timeStamp"]);

        // calculates the difference between previous and current timestamp.
        gapTime = (currTimestamp.getTime() - prevTimestamp.getTime());

        minutes = (gapTime / (60 * 1000)) % 60;
				hours = (gapTime/(60 * 60 * 1000)) % 24;

        currDay = currTimestamp.getUTCDate();
        prevDay = prevTimestamp.getUTCDate();


      }

      //*********************** Destinations ********************************************
      // If the train is starting from a "non-depot station" but it is arriving to
      // a "depot station" removes the first row; otherwise labels the first row as "FIRST".
      if((ds[curr]["event"].includes("START")) && (prev == null) //if prev !== null or undefined
          && (!ds[curr]["destination"].includes("Sidings")
            && !ds[curr]["destination"].includes("Depot")
            && !ds[curr]["destination"].includes("Shed"))){

              console.log("Elseif a");

              if(next != null){
                var nextStation = ds[next]["destination"];
                if(ds[next]["destination"].includes("Sidings")
                  ||ds[next]["destination"].includes("Depot")
                  ||ds[next]["destination"].includes("Shed")){
                  expand(forChildren.children[0]._children[0]);

                    dsRoutes.splice(curr,1);
                    ds.splice(curr,1);
                  }
                  else{
                    dsRoutes[curr]["RouteEvent"] = "FIRST" ;
                    ds[curr]["RouteEvent"] = "FIRST" ;
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
  					  && ds[curr]["event"].includes("START") && next!= null) {

          if(ds[next]["destination"].includes("Victoria Sidings")) {
              console.log("Elseif 1");

              dsRoutes.splice(next,1);
              ds.splice(next,1);
              while(ds[next]["destination"].includes("Victoria Sidings")){

                dsRoutes.splice(next,1);
                ds.splice(next,1);
              }
  			}
      }

      //*********************** elseif 2 ********************************************
      // Removes Slate Green Depot rows when the previous read station is Slade Green.

      else if (ds[curr]["destination"]==="Slade Green" && ds[curr]["event"].includes("START")){
        if(next!=null){
          if(ds[next]["destination"].includes("Slade Green Depot")){
            console.log("Elseif 2");
            dsRoutes.splice(next,1);
            ds.splice(next,1);
            while (ds[next]["destination"].includes("Slade Green Depot")){
              dsRoutes.splice(next,1);
              ds.splice(next,1);
            }
          }
        }
      }
      //*********************** elseif 3 ********************************************
      /* When a train starts from a "non-depot station" and stops to a "depot station",
        assigns the label "LAST" to the "non-depot station" row that contains the STOP event
        and deletes the subsequent rows. */
      else if (prev != null && ( ds[curr]["destination"].includes("Sidings")
              || ds[curr]["destination"].includes("Depot")
              || ds[curr]["destination"].includes("Shed")) && (ds[prev]["event"].includes("START"))
              && ((!ds[prev]["destination"].includes("Sidings")
                && !ds[prev]["destination"].includes("Depot")
                && !ds[prev]["destination"].includes("Shed")))){

                  console.log("Elseif 3");
                  dsRoutes[prev-1]["RouteEvent"] = "LAST";
                  ds[prev-1]["RouteEvent"] = "LAST";

                  if(next != null){
                    dsRoutes.splice(curr,1);
                    dsRoutes.splice(curr,1);
                    ds.splice(curr,1);
                    ds.splice(curr,1);
                  }else{
                    dsRoutes.splice(curr,1);
                    ds.splice(curr,1);
                  }
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
                      console.log("Elseif 4");
                      dsRoutes.splice(curr,1);
                      ds.splice(curr,1);

                      globalBool = true;

                      while(ds[curr]["destination"].includes("Sidings")
                            || ds[curr]["destination"].includes("Depot")
                            || ds[curr]["destination"].includes("Shed")){
                              //expand(forChildren.children[4]._children[1]);
                              dsRoutes.splice(curr,1);
                              ds.splice(curr,1);
                            }



                      globalBool = true;
              }

              //*********************** elseif 5 ********************************************
              // When a train starts and stops into the same station, remove the corresponding rows
              // and labels the previous available row as the last and the next available station as
              // the first.
              else if ((prev != null)
                    && (ds[prev]["destination"] === ds[curr]["destination"])
                    && (ds[prev]["event"] === "START")
                    && (ds[curr]["event"] === "STOP")) {
                      console.log("Elseif 5");


                      if(prev-1 >=0){
                        if(!ds[prev-1]["RouteEvent"].includes("LAST")){
                          dsRoutes[prev-1]["RouteEvent"] ="LAST";
                          ds[prev-1]["RouteEvent"] ="LAST";
                        }
                      }
                        dsRoutes.splice(prev,1);
                        dsRoutes.splice(prev,1);
                        ds.splice(prev,1);
                        ds.splice(prev,1);

                        globalBool = true;

                        if(prev<= ds.length-1){
                          dsRoutes[prev]["RouteEvent"] = "FIRST";
                          ds[prev]["RouteEvent"] = "FIRST";
                        }

                      }


              //*********************** elseif 6 ********************************************
              // When a train starts from a "depot station" and stops to a "non-depot station"
              // removes the "non-depot station" with the STOP event and labels the next available
              // station as the first.
              else if(prev != null && (ds[prev]["destination"].includes("Sidings")
                   || ds[prev]["destination"].includes("Depot")
                   || ds[prev]["destination"].includes("Shed")) && (ds[curr]["event"].includes("STOP"))){
                     console.log("Elseif 6");
                     dsRoutes.splice(curr,1);
                     ds.splice(curr,1);
                     globalBool = true;

                     if(curr<= ds.length-1){
                       dsRoutes[curr]["RouteEvent"] = "FIRST";
                       ds[curr]["RouteEvent"] = "FIRST";
                     }

                   }

              //*********************** elseif 6,5 ********************************************
              // excludes Dartford -> Crayford sequence from the computation.
              else if (ds[curr]["destination"].includes("Dartford") && ds[prev]["event"].includes("START")){
                    if (next != null || next <= ds.length-1){
                      if (ds[next]["destination"].includes("Crayford")){
                        console.log("did nothing");
                      }
                    }
                  }
              //*********************** elseif 7 ********************************************
              // Sequence Slade Green, Erith
              else if(ds[curr]["destination"]=== "Erith"
                   && ds[prev]["destination"] === "Slade Green" ){

                var i, temp;
                temp = prev;
                console.log("elseif 7")
                for(i=0; i<3; i++){
                  if(temp !=null && (temp -i) >= 0 ){
                    temp =prev-i;
                  }else{
                    break;
                  }
                }

                if(i==3){
                  if(!ds[temp]["destination"].includes("Dartford") && (!ds[temp]["destination"].includes("Crayford"))){
                    if(!ds[temp +1 ]["RouteEvent"].includes("LAST")) {
                      dsRoutes[temp +1]["RouteEvent"] ="LAST";
                      ds[temp +1]["RouteEvent"] ="LAST";
                    }
                    if(!ds[temp +2 ]["RouteEvent"].includes("FIRST")) {
                      dsRoutes[temp +2]["RouteEvent"] ="FIRST";
                      ds[temp +2]["RouteEvent"] ="FIRST";
                    }
                  }
                }
              }
              //*********************** elseif 8 ********************************************
              // Removes LAST and FIRST labels when the sequence of stops corresponds to
              // Dartford -> Crayford OR Deptford -> Greenwich
              // Hither green ->Lee or Waterloo East and reverse
              else if(
                    (ds[curr]["destination"].includes("Greenwich") && ds[prev]["destination"].includes("Deptford"))||
                    ((ds[curr]["destination"].includes("Lee") || ds[curr]["destination"].includes("Waterloo East"))
                       && ds[prev]["destination"].includes("Hither Green"))){
                         console.log("Elseif 8");

                         if((prev-1) >0){
                           if(ds[prev-1]["RouteEvent"] === "LAST"){
                             //console.log("LAST was remove from ");
                             //console.log(ds[prev-1]);
                             dsRoutes[prev-1]["RouteEvent"]= "";
                             ds[prev-1]["RouteEvent"]= "";
                           }
                         }
                         if(ds[curr]["RouteEvent"] === "FIRST"){
                            //console.log("FIRST was remove from ");
                            //console.log(ds[curr]);
                            dsRoutes[curr]["RouteEvent"] = "";
                            ds[curr]["RouteEvent"] = "";
                         }
                       }
//---------> need to check this with lefteris

            //*********************** elseif 9 ********************************************
            // Removes the rows from the dataset when the sequence of stops corresponds to
            // Bellingham -> Orpington
            else if(ds[curr]["destination"].includes("Bellingham")){
              if(ds[next]["destination"].includes("Orpington") && ds[next]["event"].includes("STOP")){
                console.log("Elseif 9");

                dsRoutes.splice(ds[prev],1);
                dsRoutes.splice(ds[prev],1);

                ds.splice(ds[prev],1);
                ds.splice(ds[prev],1);

                globalBool = true;

                if(ds[prev]["RouteEvent"] !== "FIRST"){
                  dsRoutes[prev]["RouteEvent"] = "FIRST";
                  ds[prev]["RouteEvent"] = "FIRST";
                }
              }

            }
//---------> my dataset don't contain any data like this, it alsw need to be checked

            //*********************** elseif 8 ********************************************
            // If the train is stopped for more than 4 minutes, labels the last visited stations as
            // the LAST and the FIRST of a route.

            //*********************** elseif 10 ********************************************
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
            console.log("Elseif 10");


            if(ds[curr]["RouteEvent"] !== "LAST"){
              dsRoutes[curr]["RouteEvent"] = "LAST";
              ds[curr]["RouteEvent"] = "LAST";
            }
            if(ds[next]["RouteEvent"] !== "FIRST"){
              dsRoutes[next]["RouteEvent"] = "FIRST";
              ds[next]["RouteEvent"] = "FIRST";
            }
          }
          //*********************** elseif 11 ********************************************
          else if((prev != null) && (
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
            && ds[prev]["destination"]=== "Charing Cross"))
          ){
            console.log("Elseif 11");

            if((prev-1)>0){
              if(ds[prev-1]["RouteEvent"] !== "LAST"){
                dsRoutes[prev-1]["RouteEvent"] = "LAST";
                ds[prev-1]["RouteEvent"] = "LAST";
              }
            }
            if(next != null){
              if(ds[next]["RouteEvent"] !== "FIRST"){
                dsRoutes[next]["RouteEvent"] = "FIRST";
                ds[next]["RouteEvent"] = "FIRST";
              }
            }
            dsRoutes.splice(prev,1);
            dsRoutes.splice(prev,1);
            ds.splice(prev,1);
            ds.splice(prev,1);

            globalBool = true;

          }

          //*********************** elseif 12 ********************************************
          // if the route is composed of only two stations, and the time between them is more than
          // 20 minutes or more than a hour, removes the rows from the dataset.
          else if ((prev != null)
                && (!ds[prev]["destination"] !== ds[curr]["destination"]
                && (!ds[prev]["event"] === "START")
                && (!ds[curr]["event"] === "STOP")
                && ((minutes > 20) || (hours >= 1))
                && ((ds[curr]["destination"].includes("Bromley") && !ds[prev]["destination"].includes("Victoria"))
                  || (ds[curr]["destination"].includes("Victoria") && !ds[prev]["destination"].includes("Bromley")))
                && (ds[curr]["destination"].includes("Victoria") && !ds[prev]["destination"].includes("Rochester"))
                && (ds[curr]["destination"].includes("Victoria") && !ds[prev]["destination"].includes("Mary"))  ))
                {
                  dsRoutes.splice(prev,1);
                  dsRoutes.splice(prev,1);
                  ds.splice(prev,1);
                  ds.splice(prev,1);

                  globalBool = true;
          }

          //*********************** elseif 13 ********************************************
          // when the dds changes, that indicates the initiation of a new route.
          else if((prev != null) && (ds[prev]["d10"] != ds[curr]["d10"])
                && (ds[curr]["event"] === "STOP")){
                  console.log("Elseif 13");

                  if(!ds[curr]["destination"].includes("London")){
                    dsRoutes[curr]["RouteEvent"] = "LAST";
                    ds[curr]["RouteEvent"] = "LAST";

                    if(next != null){
                      dsRoutes[next]["RouteEvent"] = "FIRST";
                      ds[next]["RouteEvent"] = "FIRST";
                    }
                  }
                }

          //*********************** elseif 14 ********************************************
          // when the dds changes, that indicates the initiation of a new route.
          else if(prev != null && (ds[prev]["d10"] != ds[curr]["d10"])
                && (ds[curr]["event"] === "START")){

                  console.log("Elseif 14");

                  if(ds[prev]["RouteEvent"] !== "LAST"){
                    dsRoutes[prev]["RouteEvent"] = "LAST";
                    ds[prev]["RouteEvent"] = "LAST";
                  }
                  if(next !=null){
                    if(ds[next]["RouteEvent"] !== "FIRST"){
                      dsRoutes[curr]["RouteEvent"] = "FIRST";
                      ds[curr]["RouteEvent"] = "FIRST";
                    }
                  }


                }

          //*********************** elseif 15 ********************************************
          // Removes Grove Park Down Sidings rows when the previous read station is Orpington.
          else if(ds[curr]["destination"] === "Orpington" && ds[curr]["event"].includes("START") && (next!= null)){
            if(ds[next]["destination"].includes("Grove Park Down Sidings")){
              console.log("Elseif 15");
              dsRoutes.splice(next,1);
              ds.splice(next,1);
              globalBool = true;

              while(ds[next]["destination"].includes("Grove Park Down Sidings")){
                dsRoutes.splice(next,1);
                ds.splice(next,1);
              }
              globalBool = true;


            }
          }

          //*********************** elseif 16 ********************************************
          else if (prev != null){
            if(curr-3 >= 0){
              if(ds[curr-3]["destination"].includes(ds[curr]["destination"])){
                console.log("Elseif 16");

                if(ds[curr-3]["RouteEvent"].includes("FIRST")){
                  dsRoutes.splice(curr-3,1);
                  dsRoutes.splice(curr-3,1);
                 ds.splice(curr-3,1);
                 ds.splice(curr-3,1);
                 globalBool = true;

              }
              else{
                console.log("Elseif 16");
                if(!ds[curr-2]["RouteEvent"].includes("LAST") && !ds[curr-2]["RouteEvent"].includes("FIRST")){
                  dsRoutes[curr-2]["RouteEvent"] = "FIRST";
                  ds[curr-2]["RouteEvent"] = "FIRST";
                }
              }
            }
          }
        }
    if(lastBool){
      c++;
      lastBool = false;
    }else if (firstBool) {

    }else{

    }


    }//end for loop

    //*********************** Check A ********************************************
    // checks if the second to last row is labeled with FIRST and removes it and also
    // removes the last row.
    // if(ds.length>3){
    //   if(ds[ds.length-3]["RouteEvent"].includes("FIRST")){
    //
    //     console.log("Check A - row removed: " );
    //     console.log(ds[ds.length-3,1]);
    //     ds.splice(ds.length-3,1);
    //     console.log("Check A - row removed:");
    //     console.log(ds[ds.length-3,1]);
    //     ds.splice(ds.length-3,1);
    //   }
    // }
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
    console.log(dsRoutes);
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
