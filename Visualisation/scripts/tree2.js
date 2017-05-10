var treeData = {
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
          "children": [
              {"name":"R","parent":"if"},
              {"name":"F","parent":"if"}
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
            {"name":"if","parent":"6","children":[{"name":"F","parent":"if"}]}
          ]
        },
        {
          "name":"7",
          "parent":"for loop",
          "children":[
            {"name":"if",
            "parent":"7",
            "children":[
              {"name":"F","parent":"if"},
              {"name":"L","parent":"if"}
                      ]}
                    ]
        },
        {
          "name":"8",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"8","children":[{"name":"E","parent":"if1"}]},
            {"name":"if2","parent":"8","children":[{"name":"E","parent":"if2"}]}
          ]
        },
        {
          "name":"9",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"9","children":[{"name":"R","parent":"if1"}]},
            {"name":"if2","parent":"9","children":[{"name":"F","parent":"if2"}]}
          ]
        },
        {
          "name":"10",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"10","children":[{"name":"L","parent":"if1"}]},
            {"name":"if2","parent":"10","children":[{"name":"F","parent":"if2"}]}
          ]
        },
        {
          "name":"11",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"11","children":[{"name":"L","parent":"if1"}]},
            {"name":"if2","parent":"11","children":[{"name":"F","parent":"if2"}]},
            {"name":"R","parent":"11"}
          ]
        },
        {
          "name":"12",
          "parent":"for loop",
          "children": [
            {"name":"R","parent":"12"}
          ]
        },
        {
          "name":"13",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"13","children":[{"name":"L","parent":"if1"}]},
            {"name":"if2","parent":"13","children":[{"name":"F","parent":"if2"}]}
          ]
        },
        {
          "name":"14",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"14","children":[{"name":"L","parent":"if1"}]},
            {"name":"if2","parent":"14","children":[{"name":"F","parent":"if2"}]}
          ]
        },
        {
          "name":"15",
          "parent":"for loop",
          "children":[
            {"name":"if","parent":"15","children":[{"name":"R","parent":"if"}]},
            {"name":"while","parent":"15","children":[{"name":"R","parent":"while"}]}
          ]
        },
        {
          "name":"16",
          "parent":"for loop",
          "children":[
            {"name":"if1","parent":"13","children":[{"name":"R","parent":"if1"}]},
            {"name":"if2","parent":"13","children":[{"name":"F","parent":"if2"}]}
          ]
        }

      ]
    },
    {
      "name":"A",
      "parent":"Read Data",
      "children":[
        {"name":"R","parent":"A"}
      ]
    },
    {
      "name":"B",
      "parent":"Read Data",
      "children":[
        {"name":"R","parent":"B"}
      ]
    },
    {
      "name":"C",
      "parent":"Read Data",
      "children":[
        {"name":"L","parent":"C"}
      ]
    }
  ]
};



var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




  root = treeData;
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  // function expand(d){
  // if (d._children) {
  //     d.children = d._children;
  //     d.children.forEach(expand);
  //     d._children = null;
  // }
  function expand(d){
        d.activated=true;
        var children = (d.children)?d.children:d._children;
        if (d._children) {
            d.children = d._children;
            d._children = null;
          }
<<<<<<< HEAD
<<<<<<< HEAD
        else if(d.children){
            d._children= d.children;
            d.children = null;
         }

=======
>>>>>>> parent of ba9d3d2... s
=======
>>>>>>> parent of ba9d3d2... s
          update(root);
    }


    root.children.forEach(collapse);

    function expand2(d){
      if(d._children != null){
        d.children = d._children;
        d.children.filter(function(d) { return d.name.indexOf("for loop") > -1; })
                  .forEach(expand2);
        d._children = null;
      }
    }




  update(root);


d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 9)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  // nodeUpdate.select("circle")
  //     .attr("r", 4.5)
  //     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
  nodeUpdate.select("circle")
        .attr("r", 9)
        //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .style("stroke", function(d){return d.activated? "red":"blue"});

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 9);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  d.clicked = true;
  update(d);
}
