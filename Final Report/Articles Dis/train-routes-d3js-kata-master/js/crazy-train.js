(function() {

  var highlightRoute = function(route) {
    var routeMap = {};
    for(var i=0; i<route.length-1; i++) {
      routeMap[route[i]] = route[i+1];
    }

    //set nodes to selected or not
    node.attr("class", function(d) {
      var className = this.getAttribute('class');
      if(d.name === selected.start.data.name) {
        className = 'node start';
      }
      else if(selected.end.data && d.name === selected.end.data.name) {
        className = 'node end';
      }
      else {
        className = routeMap[d.name] ? 'node selected' : 'node not-selected';
      }
      return className;
    });

    var distance = 0;
    link.attr("class", function(d,i) {
      var selected = routeMap[d.source.name] === d.target.name;
      if(selected) {
        distance+= d.source.destinations[d.target.name];
      }
      return selected ? 'link selected' : 'link not-selected';
    });

    text.attr("class", function(d) {
      var className = this.getAttribute('class');
      if(d.name === selected.start.data.name) {
        className = 'text start';
      }
      else if(selected.end.data && d.name === selected.end.data.name) {
        className = 'text end';
      }
      else {
        className = routeMap[d.name] ? 'text selected' : 'text not-selected';
      }
      return className;
    }).text(function(d) {
      var label = d.name;
      //if this is the destination and start!=end, then show the route distance
      if(selected.end.data && selected.end.data.name === d.name && selected.start.data.name !== selected.end.data.name) {
        if(distance > 0) {
          label+= ' (' + distance + ' km)';
        }
        else {
          label+= ' (no route)';
        }
      }
      return label;
    });
;
  };

  var nodeClick = function(d,i) {
    //figure out the last 2 nodes selected
    if(!selected.start.elem) { //choosing a start for the first time
      selected.start = {
        elem: this,
        data: d
      };
    }
    else { //selecting a destination
      if(selected.end.elem) { //changing the destination -- make the previous destination the start
        selected.start = selected.end;
      }
      selected.end = {
        elem: this,
        data: d
      };
    }

    //update the map with the new route
    if(selected.end.elem) {
      highlightRoute(
        dijkstrasGraph.shortestPath(selected.start.data.name, selected.end.data.name)
          .concat([selected.start.data.name])
          .reverse()
      );
    }
    else {
      highlightRoute([]);
    }
  };


  /** and here we go... **/

  var svg = d3.select("#canvas");
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  //try to come up with a scale that will fit on the screen
  var routeScale = Math.min(width,height)/25;
  var color = d3.scale.category20();
  var selected = {
    start: { elem: null, data: null },
    end: { elem: null, data: null }
  };

  //transform CSV data to meet d3 graph's needs
  var graph = csvToD3Transformer.transformData(
    "source,destination,distance\n"+
    "Frolia,Hailea,9\n"+
    "Hailea,Hanalei,5\n"+
    "Hanalei,Maeulia,6\n"+
    "Hauauai,Lainea,8\n"+
    "Kaleola,Maeulia,7\n"+
    "Lainea,Hailea,5\n"+
    "Lakua,Hauauai,3\n"+
    "Maeulia,Hailea,12\n"+
    "Paukaa,Hauauai,6\n"+
    "Poipu,Paukaa,9\n"+
    "Hailea,Waimea,4\n"+
    "Waimea,Lakua,9\n"+
    "Lakua,Poipu,7\n"+
    "Waimea,Kaleola,4\n"+
    "Maeulia,Paukaa,14\n"+
    "Hailea,Lainea,8"
  );

  //create dijkstras graph for shortest route calculations
  var dijkstrasGraph = new Graph();
  _.forEach(graph.nodes, function(source) {
    dijkstrasGraph.addVertex(source.name, source.destinations);
  });

  //setup d3 force graph
  var force = d3.layout.force()
    .charge(-2000)
    .linkDistance(function(d) {
      return d.source.destinations[d.target.name]*routeScale;
    })
    .size([width, height])
    .nodes(graph.nodes)
    .links(graph.edges)
    .start();
  
  //add directional arrows to lines
  var arrow = svg.selectAll('.marker')
    .data(graph.edges)
    .enter().append('marker')
      .attr('id', function(d,i){ return 'arrow'+i})
      .attr('markerHeight', 5)
      .attr('markerWidth', 6)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', -20)
      .attr('refY', 5)
      .attr('viewBox', '0 0 10 10')
      .append('path')
        .attr('fill-opacity', 0.6)
        .attr('d', "M 0 0 L 10 5 L 0 10 z")
        .attr('fill', function(d,i) { return color(i); });

  //add lines between nodes
  var link = svg.selectAll(".link")
    .data(graph.edges)
    .enter().append("line")
      .attr("class", "link init")
      .attr('marker-start', function(d,i) { return 'url(#arrow'+i+')' })
      .attr("stroke", function(d,i) { return color(i); });

  //create nodes/cities
  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node init")
      .attr("r", 10)
      .on("click", nodeClick);

  //create node/city labels
  var text = svg.selectAll(".text")
    .data(graph.nodes)
    .enter().append("text")
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('class', 'text init')
      .text(function(d) { return d.name; });

  //show the distance of a connection when hovering over it
  link.append("title")
    .text(function(d) { return d.source.destinations[d.target.name] + 'km to '+d.target.name; });

  //update positioning on tick
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text.attr("x", function(d) { return d.x - 30; })
        .attr("y", function(d) { return d.y - 20; });
  });

})();
