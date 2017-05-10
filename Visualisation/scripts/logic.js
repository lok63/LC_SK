
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
//ELSEIF 5.5 --> works
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







//************************Global Variables**************************************
//******************************************************************************
var tableBool = true;
var globalBool = false;
var prevTimestamp,currTimestamp, currDay, prevDay;
var gapTime, minutes, hours;
var temp;
var forChildren = root.children[0];
var format = new simpleDateFormat();
format.applyPattern("dd/MM/yyyy HH:mm:ss");
var mySimpleDateFormatter = new simpleDateFormat("dd/MM/yyyy HH:mm:ss");

 document.getElementById("htmlIndex").innerHTML;

var nextBtn = document.getElementById("nextBtn");







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
      var c = 0;
      data.forEach(function(e){
        e['i'] = c++;
        e['RouteEvent']='';
      });

      DisplayTable(data,'#table1');
      DisplayTable(data,'#table2');
      htmlIndex.innerHTML += 0;


      //console.log(data);
      ds =  checkUselessChars(data);
      console.log(ds);

    }
    //call your functions here

    var len = ds.length;
    var i =0;
    var globalI=0;

    expand(root.children[0]);

  //  for ( var i = 0;  i < ds.length; i++){
  function startLoop(i){
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

                    //console.log("'destination' row was removed:");
                    //console.log(ds[curr]);
                    highlightRows(ds[curr]['i'],"delete");
                    ds.splice(curr,1);
                  }
                  else{
                    expand(forChildren.children[0]._children[1]);
                    highlightRows(ds[curr]['i'],"first");
                    ds[curr]["RouteEvent"] = "FIRST" ;
                  }
              }
              expand(forChildren.children[0]);
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

              highlightRows(ds[next]['i'],"delete");
              ds.splice(next,1);
              while(ds[next]["destination"].includes("Victoria Sidings")){

                expand(forChildren.children[1]._children[0]._children[1]._children[0]);
                expand(forChildren.children[1]._children[0]._children[0]);
                highlightRows(ds[next]['i'],"delete");
                ds.splice(next,1);
              }
              expand(forChildren.children[1]._children[0]);
  			}
        expand(forChildren.children[1]);
      }

      //*********************** elseif 2 ********************************************
      // Removes Slate Green Depot rows when the previous read station is Slade Green.

      else if (ds[curr]["destination"]==="Slade Green" && ds[curr]["event"].includes("START")){
        if(next!=null){
          if(ds[next]["destination"].includes("Slade Green Depot")){
            console.log("Elseif 2");
            expand(forChildren.children[2]._children[0]._children[0]);
            highlightRows(ds[next]['i'],"delete");
            ds.splice(next,1);
            while (ds[next]["destination"].includes("Slade Green Depot")){

              expand(forChildren.children[2]._children[0]._children[1]._children[0]);
              expand(forChildren.children[2]._children[0]._children[1]);

              highlightRows(ds[next]['i'],"delete");
              ds.splice(next,1);
            }
            expand(forChildren.children[2]._children[0]);
          }
          expand(forChildren.children[2]);
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
                  expand(forChildren.children[3]._children[0]);
                  highlightRows(ds[prev-1]['i'],"last");
                  ds[prev-1]["RouteEvent"] = "LAST";

                  if(next != null){
                    expand(forChildren.children[3]._children[1]);
                    highlightRows(ds[curr]['i'],"delete");
                    ds.splice(curr,1);
                    highlightRows(ds[curr]['i'],"delete");
                    ds.splice(curr,1);
                  }else{
                    expand(forChildren.children[3]._children[1]);
                    highlightRows(ds[curr]['i'],"delete");
                    ds.splice(curr,1);
                  }
                  expand(forChildren.children[3]);
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


                      //expand(forChildren.children[4]._children[0]);

                      highlightRows(ds[curr]['i'],"delete");
                      ds.splice(curr,1);

                      globalBool = true;

<<<<<<< HEAD
<<<<<<< HEAD
                      // while(ds[curr]["destination"].includes("Sidings")
                      //       || ds[curr]["destination"].includes("Depot")
                      //       || ds[curr]["destination"].includes("Shed")){
                      //         //expand(forChildren.children[4]._children[1]);
                      //         highlightRows(ds[curr]['i'],"delete");
                      //         ds.splice(curr,1);
                      //       }
                            try{
                              expand(forChildren.children[4]._children[1]._children[0]);
                              expand(forChildren.children[4]._children[1]);
                              expand(forChildren.children[4]._children[0]);
                              expand(forChildren.children[4]);
                            }
                            catch(e){
                              console.log(e);
=======
=======
>>>>>>> parent of ba9d3d2... s
                      while(ds[curr]["destination"].includes("Sidings")
                            || ds[curr]["destination"].includes("Depot")
                            || ds[curr]["destination"].includes("Shed")){
                              // expand(forChildren.children[4]._children[1]._children[0]);
                              // expand(forChildren.children[4]._children[1]);
                              highlightRows(ds[curr]['i'],"delete");
                              ds.splice(curr,1);
<<<<<<< HEAD
>>>>>>> parent of ba9d3d2... s
=======
>>>>>>> parent of ba9d3d2... s
                            }

                        //expand(forChildren.children[4]._children[0]);

                      globalBool = true;
                  //expand(forChildren.children[4]);
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
                          expand(forChildren.children[5]._children[1]._children[0]);
                          expand(forChildren.children[5]._children[1]);
                          highlightRows(ds[prev-1]['i'],"last");
                          ds[prev-1]["RouteEvent"] ="LAST";
                        }
                      }

                        highlightRows(ds[prev]['i'],"delete");
                        ds.splice(prev,1);
                        highlightRows(ds[prev]['i'],"delete");
                        ds.splice(prev,1);

                        globalBool = true;

                        if(prev<= ds.length-1){
                          expand(forChildren.children[5]._children[2]._children[0]);
                          expand(forChildren.children[5]._children[2]);
                          highlightRows(ds[prev]['i'],"first");
                          ds[prev]["RouteEvent"] = "FIRST";
                        }
                        expand(forChildren.children[5]._children[0]);
                        expand(forChildren.children[5]);
                      }


              //*********************** elseif 6 ********************************************
              // When a train starts from a "depot station" and stops to a "non-depot station"
              // removes the "non-depot station" with the STOP event and labels the next available
              // station as the first.
              else if(prev != null && (ds[prev]["destination"].includes("Sidings")
                   || ds[prev]["destination"].includes("Depot")
                   || ds[prev]["destination"].includes("Shed")) && (ds[curr]["event"].includes("STOP"))){
                     console.log("Elseif 6");

                     highlightRows(ds[curr]['i'],"delete");
                     ds.splice(curr,1);
                     globalBool = true;

                     if(curr<= ds.length-1){
                       expand(forChildren.children[6]._children[1]._children[0]);
                       expand(forChildren.children[6]._children[1]);
                       highlightRows(ds[curr]['i'],"first");
                       ds[curr]["RouteEvent"] = "FIRST";
                     }
                     expand(forChildren.children[6]._children[0]);
                     expand(forChildren.children[6]);
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
                      expand(forChildren.children[7]._children[0]._children[1]);
                      highlightRows(ds[temp +1]['i'],"last");
                      ds[temp +1]["RouteEvent"] ="LAST";
                    }
                    if(!ds[temp +2 ]["RouteEvent"].includes("FIRST")) {
                      expand(forChildren.children[7]._children[0]._children[0]);
                      highlightRows(ds[temp+2]['i'],"first");
                      ds[temp +2]["RouteEvent"] ="FIRST";
                    }
                    expand(forChildren.children[7]._children[0]);
                  }
                }
                expand(forChildren.children[7]);
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
                             highlightRows(ds[prev-1]['i'],"empty");
                             ds[prev-1]["RouteEvent"]= "";
                           }
                         }
                         if(ds[curr]["RouteEvent"] === "FIRST"){
                            //console.log("FIRST was remove from ");
                            //console.log(ds[curr]);
                            highlightRows(ds[curr]['i'],"empty");
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

                expand(forChildren.children[9]._children[0]._children[0]);
                highlightRows(ds[prev]['i'],"delete");
                ds.splice(ds[prev],1);
                highlightRows(ds[prev]['i'],"delete");
                ds.splice(ds[prev],1);

                globalBool = true;

                if(ds[prev]["RouteEvent"] !== "FIRST"){
                  expand(forChildren.children[9]._children[1]._children[0]);
                  highlightRows(ds[prev]['i'],"first");
                  ds[prev]["RouteEvent"] = "FIRST";
                  expand(forChildren.children[9]._children[1]);
                }
              }
              expand(forChildren.children[9]._children[0]);
              expand(forChildren.children[9]);
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
              expand(forChildren.children[10]._children[0]._children[0]);
              expand(forChildren.children[10]._children[0]);
              highlightRows(ds[curr]['i'],"last");
              ds[curr]["RouteEvent"] = "LAST";
            }
            if(ds[next]["RouteEvent"] !== "FIRST"){
              expand(forChildren.children[10]._children[1]._children[0]);
              expand(forChildren.children[10]._children[1]);
              highlightRows(ds[next]['i'],"first");
              ds[next]["RouteEvent"] = "FIRST";
            }
            expand(forChildren.children[10]);
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
                expand(forChildren.children[11]._children[0]._children[0]);
                expand(forChildren.children[11]._children[0]);
                highlightRows(ds[prev-1]['i'],"last");
                ds[prev-1]["RouteEvent"] = "LAST";
              }
            }
            if(next != null){
              if(ds[next]["RouteEvent"] !== "FIRST"){
                expand(forChildren.children[11]._children[1]._children[0]);
                expand(forChildren.children[11]._children[1]);
                highlightRows(ds[next]['i'],"first");
                ds[next]["RouteEvent"] = "FIRST";
              }
            }
            expand(forChildren.children[11]._children[0]);
            expand(forChildren.children[11]);
            highlightRows(ds[prev]['i'],"delete");
            ds.splice(prev,1);
            highlightRows(ds[prev]['i'],"delete");
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

                  expand(forChildren.children[12]._children[0]);
                  expand(forChildren.children[12]);
                  console.log("Elseif 12");
                  highlightRows(ds[prev]['i'],"delete");
                  ds.splice(prev,1);
                  highlightRows(ds[prev]['i'],"delete");
                  ds.splice(prev,1);

                  globalBool = true;
          }

          //*********************** elseif 13 ********************************************
          // when the dds changes, that indicates the initiation of a new route.
          else if((prev != null) && (ds[prev]["d10"] != ds[curr]["d10"])
                && (ds[curr]["event"] === "STOP")){
                  console.log("Elseif 13");

                  if(!ds[curr]["destination"].includes("London")){
                    expand(forChildren.children[13]._children[0]._children[0]);
                    highlightRows(ds[curr]['i'],"last");
                    ds[curr]["RouteEvent"] = "LAST";

                    if(next != null){
                      expand(forChildren.children[13]._children[1]._children[0]);
                      expand(forChildren.children[13]._children[1]);
                      highlightRows(ds[next]['i'],"first");
                      ds[next]["RouteEvent"] = "FIRST";
                    }
                    expand(forChildren.children[13]._children[0]);
                  }
                  expand(forChildren.children[13]);
                }

          //*********************** elseif 14 ********************************************
          // when the dds changes, that indicates the initiation of a new route.
          else if(prev != null && (ds[prev]["d10"] != ds[curr]["d10"])
                && (ds[curr]["event"] === "START")){

                  console.log("Elseif 14");

                  if(ds[prev]["RouteEvent"] !== "LAST"){
                    expand(forChildren.children[14]._children[0]._children[0]);
                    expand(forChildren.children[14]._children[0]);
                    highlightRows(ds[prev]['i'],"last");
                    ds[prev]["RouteEvent"] = "LAST";
                  }
                  if(next !=null){
                    if(ds[next]["RouteEvent"] !== "FIRST"){
                      expand(forChildren.children[14]._children[1]._children[0]);
                      expand(forChildren.children[14]._children[1]);
                      highlightRows(ds[curr]['i'],"first");
                      ds[curr]["RouteEvent"] = "FIRST";
                    }
                  }
                  expand(forChildren.children[14]);
                }

          //*********************** elseif 15 ********************************************
          // Removes Grove Park Down Sidings rows when the previous read station is Orpington.
          else if(ds[curr]["destination"] === "Orpington" && ds[curr]["event"].includes("START") && (next!= null)){
            if(ds[next]["destination"].includes("Grove Park Down Sidings")){
              console.log("Elseif 15");
              highlightRows(ds[next]['i'],"delete");
              ds.splice(next,1);
              globalBool = true;

              while(ds[next]["destination"].includes("Grove Park Down Sidings")){
                expand(forChildren.children[15]._children[1]._children[0]);
                expand(forChildren.children[15]._children[1]);
                highlightRows(ds[next]['i'],"delete");
                ds.splice(next,1);
              }
              globalBool = true;
              expand(forChildren.children[15]._children[0]._children[0]);
              expand(forChildren.children[15]._children[0]);
              expand(forChildren.children[15]);

            }
          }

          //*********************** elseif 16 ********************************************
          else if (prev != null){
            if(curr-3 >= 0){
              if(ds[curr-3]["destination"].includes(ds[curr]["destination"])){
                console.log("Elseif 16");

                if(ds[curr-3]["RouteEvent"].includes("FIRST")){
                expand(forChildren.children[16]._children[0]._children[0]);
                expand(forChildren.children[16]._children[0]);
                 highlightRows(ds[curr-3]['i'],"delete");
                 ds.splice(curr-3,1);
                 highlightRows(ds[curr-3]['i'],"delete");
                 ds.splice(curr-3,1);
                 globalBool = true;

              }
              else{
                console.log("Elseif 16");
                if(!ds[curr-2]["RouteEvent"].includes("LAST") && !ds[curr-2]["RouteEvent"].includes("FIRST")){
                  expand(forChildren.children[16]._children[1]._children[0]);
                  expand(forChildren.children[16]._children[1]);
                  highlightRows(ds[curr-2]['i'],"first");
                  ds[curr-2]["RouteEvent"] = "FIRST";
                }
              }
              expand(forChildren.children[16]);
            }
          }
        }

      globalI = ds[curr]['i'];


    updateTable(ds);
    //root.children.forEach(collapse);
    //end for loop }
  } // end of startLoop(i) function

  function callNext(){
    if(i == ds.length-1){ startChecks();}
    else if(i > ds.length-1){return;}
<<<<<<< HEAD
<<<<<<< HEAD
    console.log(ds[i]);
      startLoop(i);

=======
=======
>>>>>>> parent of ba9d3d2... s

      //startLoop(i);
      console.log(forChildren.children[4]._children[1]);
      expand(forChildren.children[4]._children[1]._children[0]);
      expand(forChildren.children[4]._children[1]);
      console.log(forChildren.children[4]._children[1]);
<<<<<<< HEAD
>>>>>>> parent of ba9d3d2... s
=======
>>>>>>> parent of ba9d3d2... s


    htmlIndex.innerHTML ="Current i is: " + i;
    htmlGlobalIndex.innerHTML = "Global i is: "+ globalI;
    dsLen.innerHTML = "length is " + (ds.length-1);

    i++;
    if(globalBool){
      i = i-1;
      globalBool = false;
    }

  }

nextBtn.addEventListener('click', callNext);

function startChecks(){
    //*********************** Check A ********************************************
    // checks if the second to last row is labeled with FIRST and removes it and also
    // removes the last row.
    if(ds.length>3){
      if(ds[ds.length-3]["RouteEvent"].includes("FIRST")){

        expand(root.children[1]._children[0]);
        highlightRows(ds[ds.length-3]['i'],"delete");
        ds.splice(ds.length-3,1);
        ds.splice(ds.length-3,1);
      }
      expand(root.children[1]);
    }
    //*********************** Check B ********************************************
    // checks if the last row is labeled with START and removes it.
    if(ds[ds.length-1]["event"].includes("START")){
      expand(root.children[2]._children[0]);
      expand(root.children[2]);
      highlightRows(ds[ds.length-1]['i'],"delete");
      ds.splice(ds.length-1,1);
    }

    //*********************** Check C ********************************************
    // checks if the last row is labeled as LAST; if not, assigns the LAST label.
    if(!ds[ds.length-1]["RouteEvent"].includes("LAST")){
      expand(root.children[3]._children[0]);
      expand(root.children[3]);
      highlightRows(ds[ds.length-1]['i'],"last");
      ds[ds.length-1]["RouteEvent"] = "LAST";
    }




    console.log(ds);
    // fianl results console.log(ds);
  }
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


//******************************************************************************
// **************             D3 VISUALISATIONS                *****************
//******************************************************************************
// function expand(d){
//   var children = (d.children)?d.children:d._children;
//   if (d._children) {
//     console.log(d);
//     d.children = d._children;
//     d._children = null;
//   }
// }
// function expand2(d){
//   if(d._children){
//       d.children = d._children;
//       d.children.filter(function(d) { return d.name.indexOf("for loop") > -1; })
//                 .forEach(expand2);
//       d._children = null;
//   }
// }
// //var el = document.getElementsByTagName("g")[4];
//
// //console.log(treeData.children[0]);
// expand(treeData.children[0]);
