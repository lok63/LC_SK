function BuildVerticaLTree(treeData, treeContainerDom) {
    var margin = { top: 40, right: 120, bottom: 20, left: 120 };
    var width = 960 - margin.right - margin.left;
    var height = 500 - margin.top - margin.bottom;

    var i = 0, duration = 750;

    var tree = d3.layout.tree()
        .separation(function(a, b) { return (a.parent == b.parent) ? 10:8 ; })
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.x, d.y]; });

    var svg = d3.select(treeContainerDom).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    root = treeData;

    /* Collapse all nodes before display them on the screen */

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    root.children.forEach(collapse);
    //root.children.forEach(expand3)

    function expand(d){
    var children = (d.children)?d.children:d._children;
    if (d._children) {
        d.children = d._children;
        d._children = null;
    }
  }

  function expand2(d){
    if(d._children){
        d.children = d._children;
        d.children.filter(function(d) { return d.name.indexOf("for loop") > -1; })
                  .forEach(expand2);
        d._children = null;
    }
  }
  //console.log(root.children[0]._children);
  //expand(root.children[0]);
  function doSome(){
  expand2(root.children[0]);}





    /******************************************************/

    update(root);

    function update(source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);
        // Normalize for fixed-depth.
        nodes.forEach(function (d) { d.y = d.depth * 80; });
        // Declare the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });
        // Enter the nodes.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            }).on("click", nodeclick);
        nodeEnter.append("circle")
         .attr("r", 10)
            .attr("stroke", function (d)
            { return d.children || d._children ?
            "steelblue" : "#00c13f"; })
            .style("fill", function (d)
            { return d.children || d._children ?
            "lightsteelblue" : "#fff"; });
        //.attr("r", 10)
        //.style("fill", "#fff");
        nodeEnter.append("text")
            .attr("y", function (d) {
                return d.children || d._children ? -18 : 18;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) { return d.name; })
            .style("fill-opacity", 1e-6);
        // Transition nodes to their new position.
        //horizontal tree
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d)
            { return "translate(" + d.x +
            "," + d.y + ")"; });
        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function (d)
            { return d._children ? "lightsteelblue" : "#fff"; });
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d)
            { return "translate(" + source.x +
            "," + source.y + ")"; })
            .remove();
        nodeExit.select("circle")
            .attr("r", 1e-6);
        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
        // Update the links…
        // Declare the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) { return d.target.id; });
        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")

            .attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });
        // Transition links to their new position.
        link.transition()
            .duration(duration)
        .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children on click.
    function nodeclick(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
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
