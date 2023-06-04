(function() {

    // Define the dimensions of the SVG container
    var width = 2000;
    var height = 500;

    // Define countries for each region 
    var africanCountries = [
        "Algeria",
        "Angola",
        "Benin",
        "Botswana",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Comoros",
        "Congo",
        "Ivory Coast",
        "Djibouti",
        "Egypt",
        "Equatorial Guinea",
        "Eritrea",
        "Eswatini",
        "Ethiopia",
        "Gabon",
        "Gambia",
        "Ghana",
        "Guinea",
        "Guinea Bissau",
        "Kenya",
        "Lesotho",
        "Liberia",
        "Libya",
        "Madagascar",
        "Malawi",
        "Mali",
        "Mauritania",
        "Mauritius",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Niger",
        "Nigeria",
        "Rwanda",
        "Sao Tome and Principe",
        "Senegal",
        "Seychelles",
        "Sierra Leone",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Sudan",
        "Tanzania",
        "Togo",
        "Tunisia",
        "Uganda",
        "Zambia",
        "Zimbabwe"
      ];
      
    var europeCountries = [
        "Albania",
        "Andorra",
        "Austria",
        "Belarus",
        "Belgium",
        "Bosnia and Herzegovina",
        "Bulgaria",
        "Croatia",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Estonia",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Hungary",
        "Iceland",
        "Ireland",
        "Italy",
        "Kosovo",
        "Latvia",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Malta",
        "Moldova",
        "Monaco",
        "Montenegro",
        "Netherlands",
        "North Macedonia",
        "Norway",
        "Poland",
        "Portugal",
        "Romania",
        "Russia",
        "San Marino",
        "Serbia",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Sweden",
        "Switzerland",
        "Ukraine",
        "United Kingdom",
        "Vatican City"
    ];

    var asiaCountries = [
        "Afghanistan",
        "Armenia",
        "Azerbaijan",
        "Bangladesh",
        "Bhutan",
        "Brunei",
        "Cambodia",
        "China",
        "Georgia",
        "India",
        "Indonesia",
        "Japan",
        "Kazakhstan",
        "Kyrgyzstan",
        "Laos",
        "Malaysia",
        "Maldives",
        "Mongolia",
        "Myanmar",
        "Nepal",
        "North Korea",
        "Pakistan",
        "Philippines",
        "Singapore",
        "South Korea",
        "Sri Lanka",
        "Taiwan",
        "Tajikistan",
        "Thailand",
        "Timor-Leste",
        "Turkmenistan",
        "Uzbekistan",
        "Vietnam",
    ];
    
    
    var australiaOceaniaCountries = [
        "Australia",
        "Fiji",
        "Kiribati",
        "Marshall Islands",
        "Micronesia",
        "Nauru",
        "New Zealand",
        "Palau",
        "Papua New Guinea",
        "Samoa",
        "Solomon Islands",
        "Tonga",
        "Tuvalu",
        "Vanuatu"
    ];
    
    var centralAmericaCountries = [
        "Belize",
        "Costa Rica",
        "El Salvador",
        "Guatemala",
        "Honduras",
        "Nicaragua",
        "Panama"
    ];
    
    var middleEastCountries = [
        "Bahrain",
        "Cyprus",
        "Iran",
        "Iraq",
        "Israel",
        "Jordan",
        "Kuwait",
        "Lebanon",
        "Oman",
        "Palestine",
        "Qatar",
        "Saudi Arabia",
        "Syria",
        "Turkey",
        "United Arab Emirates",
        "Yemen",
        "West Bank",
        "Egypt"
    ];
    
    var southAmericaCountries = [
        "Argentina",
        "Bolivia",
        "Brazil",
        "Chile",
        "Colombia",
        "Ecuador",
        "Guyana",
        "Paraguay",
        "Peru",
        "Suriname",
        "Uruguay",
        "Venezuela"
    ];

    var usCountries = [
        "United States of America"
    ]

    var mexicoCountries =[
        "Mexico"
    ]

    var canadaCountries =[
        "Canada"
    ]

    // Create an SVG container
    var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    // Initialize slider value
    var currentYear = 2005;

    // Create a color scale
    var color = d3.scaleSequential(d3.interpolateReds);
    
    // Define tooltip for country name
    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");


    // Read the data
    d3.csv("./data/map_data.csv").then(function(data) {
        d3.json("./data/countries.geojson").then(function(geojson) {
            
            // Create map projection
            var projection = d3.geoEquirectangular() // or any other projection you want
                .fitSize([1050, 500], geojson);
            
            // Create a geographical path generator
            var path = d3.geoPath()
                .projection(projection);

            // Prepare data for the current year
            var yearData = data.filter(d => +d.year === currentYear);
            updateColorScale(yearData);
        
            // Draw the map
            drawMap(geojson, yearData);

            // Create a slider
            var slider = d3.sliderBottom()
                .min(d3.min(data, d => +d.year))
                .max(d3.max(data, d => +d.year))
                .step(1)
                .width(1000)
                .tickFormat(d3.format('.4'))
                .on('end', val => { 
                    currentYear = val;
                    yearData = data.filter(d => +d.year === currentYear);
                    updateColorScale(yearData);
                    drawMap(geojson, yearData);
                });

            // Append the slider to a div
            var gTime = d3
                .select('div#slider') 
                .append('svg')
                .attr('width', 1250)
                .attr('height', 100)
                .append('g')
                .attr('transform', 'translate(30,30)');

            gTime.call(slider);
            function updateColorScale(data) {
                color.domain([0, d3.max(data, d => +d.passenger_count)]);
            }

            function drawMap(geojson, data) {
                console.log(geojson.features);
                svg.selectAll("path").remove();
            
                svg.append("g")
                    .selectAll("path")
                    .data(geojson.features)
                    .enter().append("path")
                    .attr("fill", function(d) {
                        // Find the region that contains this country
                        var region = findRegion(d.properties.ADMIN);
                        // Find the passengers for this region
                        var passengers = data.find(function(el) { 
                            return el.GEO_Region === region;
                        });
                        console.log(passengers)
                        // Return the color based on the passenger count
                        return passengers ? color(+passengers.passenger_count) : "white";
                    })
                    .attr("d", path)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 0.5);
            }
            
            function findRegion(name) {
                if (centralAmericaCountries.includes(name)) return 'Central America';
                if (asiaCountries.includes(name)) return 'Asia';
                if (europeCountries.includes(name)) return 'Europe';
                if (canadaCountries.includes(name)) return 'Canada';
                if (mexicoCountries.includes(name)) return 'Mexico';
                if (australiaOceaniaCountries.includes(name)) return 'Australia / Oceania';
                if (middleEastCountries.includes(name)) return 'Middle East';
                if (southAmericaCountries.includes(name)) return 'South America';
                if (usCountries.includes(name)) return 'US';
                if (africanCountries.includes(name)) return 'Africa';
                return null;
            }
        }).catch(function(error) {
            console.log(error);
          });
    });

})();
