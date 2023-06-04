// destinations bar chart
(function() {
var allmonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

var dropdownButton_3 = d3.select("#top_destinations")
  .append('select')
  .attr("class", "selection")

// add the options to the button

dropdownButton_3 // Add a button
.selectAll('myOptions') 
  .data(allmonth)
.enter()
  .append('option') 
.text(function (d) { return d; }) // text showed in the menu
.attr("value", function (d) { return d; }) // corresponding value returned by the button

var us = ["with US", "without US"]

var dropdownButton_4 = d3.select("#top_destinations")
  .append('select')
  .attr("class", "selection")

dropdownButton_4 // Add a button
.selectAll('myOptions') 
  .data(us)
.enter()
  .append('option') 
.text(function (d) { return d; }) // text showed in the menu
.attr("value", function (d) { return d; }) // corresponding value returned by the button

console.log(us)

// set the dimensions and margins of the graph
var margin = {top: 5, right: 20, bottom: 70, left: 60},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg_2 = d3.select("#top_destinations")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("./data/destinations.csv").then(function(data) {
  console.log("hello_2")

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    
  

  // Add Y axis
  var y = d3.scaleLinear()
    
  // Bars
 

  function updateChart(month, keep){
    svg_2.selectAll("g").remove()
    svg_2.selectAll("mybar").remove();
    svg_2.selectAll("text").remove();
    svg_2.selectAll("rect").remove();

    var monthMap = {
      January: 01,
      February: 02,
      March: 03,
      April: 04,
      May: 05,
      June: 06,
      July: 07,
      August: 08,
      September: 09,
      October: 10,
      November: 11,
      December: 12
    };
  
    var selected_month = monthMap[month];
    filtered = data.filter(function(d){ return d.Month == selected_month })
    if (keep == "without US"){filtered = filtered.filter(function(d){ return d.GEO_Region != "US"})}
    console.log(filtered)

    x.domain(filtered.map(function(d) { return d.GEO_Region; }))
      .padding(0.2);

    svg_2.append("g") 
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    y.domain([0, d3.max(filtered, function(d) { return +d.Passenger_Count; })])
      .range([height, 0]);
    svg_2.append("g")
      .call(d3.axisLeft(y));

    svg_2.selectAll("mybar")
    .data(filtered)
    .enter()
    .append("rect")
    .merge(svg_2.selectAll("rect"))
      .transition()
      .duration(1000)
      .attr("x", function(d) { return x(d.GEO_Region); })
      .attr("y", function(d) { return y(d.Passenger_Count); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Passenger_Count); })
      .attr("fill", "#C70039")
    
  }

  dropdownButton_3.on("change", function(d) {
    // recover the option that has been chosen
      var month = d3.select(this).property("value");
      var keep = dropdownButton_4.property("value");
      updateChart(month, keep)          

  })

  dropdownButton_4.on("change", function(d) {
    // recover the option that has been chosen
      var keep = d3.select(this).property("value");
      var month = dropdownButton_3.property("value");
      updateChart(month, keep)          

  })

})


})();