/* circular bar chart */
(function() {

// List of groups (here I have one group per column)
var allGroup = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]

var dropdownButton = d3.select("#my_dataviz")
  .append('select')

// add the options to the button
dropdownButton // Add a button
.selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
  .data(allGroup)
.enter()
  .append('option')
.text(function (d) { return d; }) // text showed in the menu
.attr("value", function (d) { return d; }) // corresponding value returned by the button

var allGroup_2 = ['ATA Airlines', 'Air Canada', 'Air China', 'Air France',
                'Air New Zealand', 'AirTran Airways', 'Alaska Airlines',
                'All Nippon Airways', 'American Airlines',
                'American Eagle Airlines', 'Asiana Airlines',
                'Atlantic Southeast Airlines', 'BelAir Airlines',
                'British Airways', 'Cathay Pacific', 'China Airlines',
                'Delta Air Lines', 'EVA Airways', 'Frontier Airlines',
                'Hawaiian Airlines', 'Horizon Air', 'Icelandair (Inactive)',
                'Independence Air', 'Japan Airlines', 'KLM Royal Dutch Airlines',
                'Korean Air Lines', 'Lufthansa German Airlines', 'Mesa Airlines',
                'Mexicana Airlines', 'Midwest Airlines',
                'Northwest Airlines (became Delta)', 'Philippine Airlines',
                'Singapore Airlines', 'SkyWest Airlines', 'Sun Country Airlines',
                'TACA International Airlines, S.A.', 'US Airways',
                'United Airlines', 'United Airlines - Pre 07/01/2013',
                'Virgin Atlantic', 'WestJet Airlines', 'Boeing Company',
                'Miami Air International', 'Air Canada Jazz', 'Qantas Airways',
                'Ameriflight', 'Spirit Airlines', 'Xtra Airways',
                'Evergreen International Airlines', 'Aeromexico',
                'JetBlue Airways', 'ExpressJet Airlines', 'Southwest Airlines',
                'Virgin America', 'Aer Lingus, Ltd.', 'Allegiant Air',
                'Jet Airways', 'Emirates', 'Mesaba Airlines', 'World Airways',
                'Air Berlin', 'Republic Airlines', 'Servisair', 'Pacific Aviation',
                'Swiss International', 'LAN Peru', 'Swissport USA',
                'XL Airways France', 'China Eastern', 'SAS Airlines',
                'Atlas Air, Inc', 'Compass Airlines', 'Etihad Airways',
                'China Southern', 'Turkish Airlines', 'COPA Airlines, Inc.',
                'Air India Limited', 'Air Pacific Limited dba Fiji Airways',
                'Jazz Aviation', 'WOW Air', 'Volaris Airlines',
                'Thomas Cook Airlines', 'Trego Dugan Aviation', 'Finnair',
                'ABC Aerolineas S.A. de C.V. dba Interjet',
                'Hong Kong Airlines Limited', 'Iberia', 'French Bee',
                'Icelandair EHF', 'Norwegian Air UK Ltd', 'Air Italy S.P.A',
                'El Al Israel Airlines LTD.', 'TAP Air Portugal',
                'Norwegian Air Shuttle ASA', 'Qatar Airways',
                'Philippine Airline, Inc. (INACTIVE - DO NOT USE)',
                'Vietnam Airlines JSC', 'Flair Airlines, Ltd.', 'Air Transat',
                'Breeze Aviation Group, Inc.', 'Condor Flugdienst GmbH',
                'Samsic Airport America, LLC']

var dropdownButton_2 = d3.select("#my_dataviz")
  .append('select')

// add the options to the button
dropdownButton_2 // Add a button
.selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
  .data(allGroup_2)
.enter()
  .append('option')
.text(function (d) { return d; }) // text showed in the menu
.attr("value", function (d) { return d; }) // corresponding value returned by the button

  
// set the dimensions and margins of the graph
var margin = {top: 0, right: 0, bottom: -20, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;

    // append the svg object
      
    var svg_3 = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");



    d3.csv("./data/passenger_counts.csv").then(function(data){

      // Scales
      var x = d3.scaleBand()
          .range([0, 2 * Math.PI])    
          .align(0)                 

      var y = d3.scaleRadial()
          .range([innerRadius, outerRadius])   // Domain will be define later.
          .domain([0, 5000000]); // Domain of Y is from 0 to the max passengers seen in the data


      function updateChart(year, airline){

        svg_3.selectAll("path").remove();
        svg_3.selectAll(".month-label").remove();

        filtered = data.filter(function(d){ return d.Operating_Airline == airline })
        filtered = filtered.filter(function(d){ return d.Year == year })

        console.log(filtered)

        x.domain(filtered.map(function(d) { return d.Month; }));
        y.domain([0, d3.max(filtered, function(d) { return +d.Passenger_Count; })]);

        svg_3
          .append("g")
          .selectAll("path")
          .data(filtered)
          .enter()
          .append("path") 
          .merge(svg_3)
          .transition()
          .duration(1000)
            .attr("fill", "#FA5F55") 
            .attr("d", d3.arc()     
              .innerRadius(innerRadius)
              .outerRadius(function(d) { return y(d['Passenger_Count']); })
              .startAngle(function(d) { return x(d.Month); })
              .endAngle(function(d) { return x(d.Month) + x.bandwidth(); })
              .padAngle(0.01)
              .padRadius(innerRadius))
              

        
        // Define month format
        var monthFormat = d3.timeFormat("%b");
        svg_3.selectAll(".month-label")
        .data(filtered)
        .enter()
        .append("text")
        .attr("class", "month-label")
        .attr("transform", function(d) {
          var angle = (x(d.Month) + x.bandwidth() / 2) * (180 / Math.PI) -90;
          return "rotate(" + angle + ")";
        })
        .attr("x", innerRadius + 30) // Adjust the label position as needed
        .attr("dy", ".35em")
        .text(function(d) {
          return monthFormat(new Date(0, d.Month, -1, 1)) + ", " + d.Passenger_Count; // Convert month number to month name
        });
                
                  

      }
    
      dropdownButton.on("change", function(d) {
        // recover the option that has been chosen
          var year = d3.select(this).property("value");
          var airline = dropdownButton_2.property("value");
          updateChart(year, airline)          
      })

      dropdownButton_2.on("change", function(d) {
        // recover the option that has been chosen
          var year = dropdownButton.property("value");
          var airline = d3.select(this).property("value");
          updateChart(year, airline)          

      })

  });

})();