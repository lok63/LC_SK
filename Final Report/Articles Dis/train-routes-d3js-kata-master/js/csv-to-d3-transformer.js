(function() {
  var transformData = function(dataString) {
    var locations = {};
    var data = d3.csv.parse(dataString, function(d) {
      //convert distance from a string to a number
      d.distance = +d.distance;
      locations[d.source] = locations[d.source] || {destinations:{}};
      locations[d.source].destinations[d.destination] = d.distance;
      locations[d.destination] = locations[d.destination] || {destinations:{}};
      return d;
    });
    var nodes = _.map(Object.keys(locations), function(source,index) {
      locations[source].index = index;
      return {
        index: index,
        name: source,
        destinations: locations[source].destinations
      };
    });
    var edges = [];
    _.forEach(nodes, function(source,index) {
      _.forIn(source.destinations, function(distance,destName) {
        edges.push({
          source: source.index,
          target: locations[destName].index
        });
      });
    });
    
    return {
      edges: edges,
      nodes: nodes
    };
  };
  window.csvToD3Transformer = {
    transformData: transformData
  };
})();

