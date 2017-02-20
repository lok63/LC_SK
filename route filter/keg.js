var svg = d3.select("body").append("svg")
    .attr("height","50%")
    .attr("width","100%");

//*************************Create table ****************************************
//******************************************************************************

function displayTable(){
    d3.json('data2.json', function (error,data) {

      function tabulate(data, columns) {
    		var table = d3.select("body").append('table')
          .attr("id","table1")
          .attr("width", '100%')
          .attr("height", 500)
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

      tabulate(data, ['unitNo', 'timestamp','event','destination','long','lang','d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','speed','un']); // 2 column table

    });
  }
//******************************************************************************
 var b = true;
    svg.append("circle")
            .style("stroke", "gray")
            .style("fill", "white")
            .attr("r", 40)
            .attr("cx", 50)
            .attr("cy", 50)
            .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
            .on("mouseout", function(){d3.select(this).style("fill", "white");})
            .on("click",	function(){
              if(b == true){
                displayTable();
                b = false;}
              else{document.getElementById('table1').remove();
              b = true;}
            });
