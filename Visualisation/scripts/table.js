//******************************************************************************
// **************             Table                            *****************
//******************************************************************************



function DisplayTable(data,tableID){
      function tabulate(data, columns) {
    		var table = d3.select(tableID).append('table')
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

      tabulate(data, ['i','RouteEvent','unitNo', 'timeStamp','event','destination','long','lang','d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','speed','un']); // 2 column table

  }

  function updateTable(data){
    /**
      We need to update the table 2 every. Because table2 already exists in our html table we need to override it
    */
      var element, newElement, parent;

      // Get the original element
      element = document.getElementById("table2");

      // Assuming it exists...
      if (element) {
          // Get its parent
          parent = element.parentNode;

          // Create the new element
          newElement = document.createElement('div');

          // Set its ID and content
          newElement.id = "table2";
          newElement.innerHTML = DisplayTable(ds,'#table2');

          // Insert the new one in front of the old one (this temporarily
          // creates an invalid DOM tree [two elements with the same ID],
          // but that's harmless because we're about to fix that).
          parent.insertBefore(newElement, element);

          // Remove the original
          parent.removeChild(element);
      }

        DisplayTable(data,'#table2');
  }

  //because i starts with 0 and row[0] is the header of the table
  //we add one to i
  function highlightRows(i,event){
    var table = document.getElementById("table1");
    var rows = table.getElementsByTagName("tr");

    switch(event){

      case "delete":
        rows[i+1].style.backgroundColor= '#FF6347';
        break;
      case "first":
        rows[i+1].style.backgroundColor= '#90EE90';
        break;
      case "last":
        rows[i+1].style.backgroundColor= '#F0E68C';
        break;
      case "empty":
        rows[i+1].style.backgroundColor= '#40E0D0';
        break;
      default:
        console.log("problem with switch");
    }
  }
