// Define the dimensions of the SVG container
var width = 600;
var height = 400;

// Create an SVG container
var svg = d3.select("#sankey-diagram")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Define a color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Load the CSV data
d3.csv("./data/sankey_data.csv").then(function(data) {
  
  // Creating set for nodes
  var nodeSet = new Set();
  data.forEach(function(d) {
    nodeSet.add(d.source);
    nodeSet.add(d.target);
    d.value = +d.value; // Ensuring values are numbers
  });

  var nodesArray = Array.from(nodeSet).map(function(d, i) {
    return {node: i, name: d};
  });

  // Creating links array
  var linksArray = data.map(function(d) {
    return {
      source: nodesArray.findIndex(function(node) { return node.name === d.source; }),
      target: nodesArray.findIndex(function(node) { return node.name === d.target; }),
      value: d.value
    };
  });

  // Create a Sankey layout instance
  var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 6]])
    .nodes(nodesArray)
    .links(linksArray);

  sankey();

  // Create the nodes
  var node = svg.append("g")
    .attr("fill", "#000")
    .selectAll("rect")
    .data(nodesArray)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.name));

  node.append("title")
    .text(d => `${d.name}\n${d.value}`);

  svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("text")
    .data(nodesArray)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);

  // Create the links
  var link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(linksArray)
    .join("g")
    .style("mix-blend-mode", "multiply");

  link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => color(d.source.name))
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);
});




