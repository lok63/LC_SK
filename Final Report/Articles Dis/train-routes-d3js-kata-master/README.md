# train-routes-d3js-kata

## The Solution
To view the solution, simply open index.html in your browser and start clicking.

The index.html file imports the needed scripts, so you can start there when reviewing the code.

Anything I didn't write myself I put in the js/lib directory. The rest is just in the js directory.
At first I wasn't sure if I should write my own shortest path algorithm, but I decided against it because I didn't think that was the interesting part of the project. It's a well-known algo with many implementations in many langauges - it seemed like it would be a waste to transpose a well-known algo like that.

## What I learned
Since I've never used d3.js or SVGs, the entire project was a learning experience. Step one was just discerning what d3 offered vs what was just part of SVGs. It was nice that near the end I could start to make better decisions about what should be styled in CSS vs put into the SVG via javascript and to start to leverage d3's strengths instead of fighting with it.

## The Problem

### Background
A remote, tropical island has a railroad that services a number of towns. Because of the rough
terrain, all of the railroad tracks are one-way only. That is, a route from Lakua to Hailea does not
imply that there is a route from Hailea to Lakua. In fact, even if both of these routes exist, they are
often not necessarily the same distance or cost.
The purpose of this problem is to help the railroad provide its customers with information about the r
outes. In particular, you will compute the distance along a certain route, the number of different rout
es between two towns, and the shortest route between two towns.

### Input
The input is a CSV snippet (below). The first column is the source town, the second column in the
destination town and the last is the distance for that route.
```
Frolia,Hailea,9
Hailea,Hanalei,5
Hanalei,Maeulia,6
Hauauai,Lainea,8
Kaleola,Maeulia,7
Lainea,Hailea,5
Lakua,Hauauai,3
Maeulia,Hailea,12
Paukaa,Hauauai,6
Poipu,Paukaa,9
Hailea,Waimea,4
Waimea,Lakua,9
Lakua,Poipu,7
Waimea,Kaleola,4
Maeulia,Paukaa,14
Hailea,Lainea,8
```

### Mission Objectives
1. Using d3.js, visualize the graph of cities and the routes between them.
hint: https://github.com/mbostock/d3/wiki/Force-Layout

### Stretch Objective #1 * not required
1. Highlight the shortest route from Frolia to Poipu.

### Stretch Objective #2 * not required
1. When clicking on a node on the graph, highlight that node.
2. Only allow the last 2 nodes that were clicked on to be highlighted. (for example, if Kaleola, Hailea
and Lakua are clicked in order, then Hailea and Lakua should be highlighted)
3. When 2 nodes on the graph are highlighted, also highlight the shortest route between these 2
nodes on the graph and display the distance prominently.
