//******************************************************************************
// **************             Table                            *****************
//******************************************************************************


function displayTable(data){
      function tabulate(data, columns) {
    		var table = d3.select('#table1').append('table')
    		var thead = table.append('thead')
    		var	tbody = table.append('tbody');

    		// append the header row
    		thead.append('tr')
    		  .selectAll('th')
    		  .data(columns).enter()
    		  .append('th')
    		    .text(function (column) { return column; });

    		// create a row for each object in the data
    		var rows = tbody.selectAll('tr')
    		  .data(data)
    		  .enter()
    		  .append('tr');



    		// create a cell in each row for each column
    		var cells = rows.selectAll('td')
    		  .data(function (row) {
    		    return columns.map(function (column) {
    		      return {column: column, value: row[column]};
    		    });
    		  })
    		  .enter()
    		  .append('td')
    		    .text(function (d) { return d.value; });

    	  return table;
    	}

      tabulate(data, ['i','unitNo', 'timeStamp','event','destination','long','lang','d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','speed','un']); // 2 column table

  }


  d3.json("data/test.json", function(error,data){
    if (error){console.log(console.log("Error with dataset"));}
    else{
      if(data == null || data.lenght == 0 || data.length == 1){
        console.log("Error with dataset");
      }
      console.log(data);
    }
    displayTable(data);
  });




  //data for tree

  var treeData =
    {
      "name":"Read Data",
      "parent":null,
      "children": [

        {
          "name":"for loop",
          "parent":"Read Data",
          "children": [

            {
              "name":"a",
              "parent":"for loop",
            },
            {
              "name":"b",
              "parent":"for loop",
              "children": [
                {
                  "name":"if",
                  "parent":"b",
                  "children": [
                    {"name":"R","parent":"if",},{"name":"F","parent":"if",}
                  ]
                }
              ]
            },
            {
              "name":"1",
              "parent":"for loop",
              "children": [
                {
                  "name":"if",
                  "parent":"b",
                  "children": [
                    {"name":"R","parent":"if"},
                    {"name":"while","parent":"if","children":[{"name":"R","parent":"while"}]}
                  ]
                }
              ]
            },
            {
              "name":"2",
              "parent":"for loop",
              "children": [
                {
                  "name":"if",
                  "parent":"b",
                  "children": [
                    {"name":"R","parent":"if"},
                    {"name":"while","parent":"if","children":[{"name":"R","parent":"while"}]}
                  ]
                }
              ]
            },
            {
              "name":"3",
              "parent":"for loop",
              "children": [
                {"name":"L","parent":"3"},
                {"name":"R","parent":"3"}
              ]
            },
            {
              "name":"4",
              "parent":"for loop",
              "children":[
                {"name":"R","parent":"4"},
                {"name":"while","parent":"4","children":[{"name":"R","parent":"while"}]}
              ]
            },
            {
              "name":"5",
              "parent":"for loop",
              "children":[
                {"name":"R","parent":"5"},
                {"name":"if1","parent":"5","children":[{"name":"L","parent":"if1"}]},
                {"name":"if2","parent":"5","children":[{"name":"F","parent":"if2"}]}
              ]
            },
            {
              "name":"6",
              "parent":"for loop",
              "children":[
                {"name":"R","parent":"6"},
                {"name":"if","parent":"6","children":[{"name":"F","parent":"if"}]},
              ]
            },
            {
              "name":"7",
              "parent":"for loop",
            },
            {
              "name":"8",
              "parent":"for loop",
              "children":[
                {"name":"if1","parent":"8","children":[{"name":"E","parent":"if1"}]},
                {"name":"if2","parent":"8","children":[{"name":"E","parent":"if2"}]},
              ]
            },
            {
              "name":"9",
              "parent":"for loop",
              "children":[
                {"name":"if1","parent":"9","children":[{"name":"R","parent":"if1"}]},
                {"name":"if2","parent":"9","children":[{"name":"F","parent":"if2"}]},
              ]
            },
            {
              "name":"10",
              "parent":"for loop",
              "children":[
                {"name":"if1","parent":"10","children":[{"name":"L","parent":"if1"}]},
                {"name":"if2","parent":"10","children":[{"name":"F","parent":"if2"}]},
              ]
            },
            {
              "name":"11",
              "parent":"for loop",
              "children":[
                {"name":"if1","parent":"11","children":[{"name":"L","parent":"if1"}]},
                {"name":"if2","parent":"11","children":[{"name":"F","parent":"if2"}]},
                {"name":"R","parent":"11"},
              ]
            },
            {
              "name":"12",
              "parent":"for loop",
            },
            {
              "name":"13",
              "parent":"for loop",
              "children":[
                {"name":"if1","parent":"13","children":[{"name":"L","parent":"if1"}]},
                {"name":"if2","parent":"13","children":[{"name":"F","parent":"if2"}]},
              ]
            },
            {
              "name":"14",
              "parent":"for loop",
              "children":[
                {"name":"if1","parent":"14","children":[{"name":"L","parent":"if1"}]},
                {"name":"if2","parent":"14","children":[{"name":"F","parent":"if2"}]},
              ]
            },
            {
              "name":"15",
              "parent":"for loop",
              "children":[
                {"name":"if","parent":"15","children":[{"name":"R","parent":"if"}]},
                {"name":"while","parent":"15","children":[{"name":"R","parent":"while"}]},
              ]
            },
            {
              "name":"16",
              "parent":"for loop",
            }

          ]// end of for loop children
        },
        {
          "name":"A",
          "parent":"Read Data"
        },
        {
          "name":"B",
          "parent":"Read Data"
        },
        {
          "name":"C",
          "parent":"Read Data"
        }
      ] //end Read data children
    };

    //build tree
    BuildVerticaLTree(treeData, "#tree");
