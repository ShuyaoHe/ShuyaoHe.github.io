

 var stateNames = {

   "AL": "Alabama",
   "AK": "Alaska",
   "AZ": "Arizona",
   "AR": "Arkansas",
   "CA": "California",
   "CO": "Colorado",
   "CT": "Connecticut",
   "DE": "Delaware",
   "FL": "Florida",
   "GA": "Georgia",
   "HI": "Hawaii",
   "ID": "Idaho",
   "IL": "Illinois",
   "IN": "Indiana",
   "IA": "Iowa",
   "KS": "Kansas",
   "KY": "Kentucky",
   "LA": "Louisiana",
   "ME": "Maine",
   "MD": "Maryland",
   "MA": "Massachusetts",
   "MI": "Michigan",
   "MN": "Minnesota",
   "MS": "Mississippi",
   "MO": "Missouri",
   "MT": "Montana",
   "NE": "Nebraska",
   "NV": "Nevada",
   "NJ": "New Jersey",
   "NM": "New Mexico",
   "NY": "New York",
   "NH": "New Hampshire",
   "NC": "North Carolina",
   "ND": "North Dakota",
   "OH": "Ohio",
   "OK": "Oklahoma",
   "OR": "Oregon",
   "PA": "Pennsylvania",
   "RI": "Rhode Island",
   "SC": "South Carolina",
   "SD": "South Dakota",
   "TN": "Tennessee",
   "TX": "Texas",
   "UT":  "Utah",
   "VT": "Vermont",
   "VA": "Virginia",
   "WA": "Washington",
   "WV": "West Virginia",
   "WI": "Wisconsin",
   "WY": "Wyoming"

 };

  var width = 1000, height = 600;

  var states;
  var transLookup = {};

  var svg = d3.select("#map")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

  var colorScale = d3.scaleLinear()
    .domain([0, 0.002, 0.004, 0.006, 0.008])
    .range(["#FDE6D0", "#FFFDFE", "#FCD0A5", "#FBAE70","#CA6918"]);

  // Data Organize //
  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "HowManyTrans.csv")
    .awaitAll(function(error, data, data2){
      console.log(error);
      console.log(data);
      console.log(data2);
      var topoData = data[0];

     var transData = data[1];
      transData.forEach(function(d, i){

        for ( var poop in d){
          var num = +d[poop];
          if (isNaN(num) == false) {
            d[poop] = num;
          }
        }
        transLookup[d.STATE] = d;
      });
    console.log(transLookup);

// converts Topojson to
    var geoJSON = topojson.feature(topoData, topoData.objects.states);

    var proj = d3.geoAlbersUsa()
      .fitSize([window.innerWidth/1.2, window.innerHeight/1.2], geoJSON);

// creates a path generator
    var path = d3.geoPath()
      .projection(proj);

    states = svg.selectAll("path")
      .data(geoJSON.features)
      .enter().append("path")
        .attr("d", function(d) {
          return path(d);
        })
      .on("mouseover", function(d){

              var stateName = stateNames[d.id];
              var mydata = transLookup[stateName];
                console.log(mydata);
                console.log("mouseover");

                // d3.select(this)
                //   .attr("fill", "red");

              var point= d3.mouse(this);
              console.log(point);
              var tooltip =d3.select('.tooltip');
              tooltip.transition()
                  .style('opacity',0.7)
                  .style('left', d3.event.pageX+ "px")
                  .style('top', d3.event.pageY + "px");


                       d3.select(this)
                         .transition()
                         .duration(500);



                  tooltip
                        .select('.state')
                        .text(" "+stateName);

                  tooltip
                        .select('.population')
                        .text("Transgender Adults Population: "+mydata.POPULATION);

                  tooltip
                        .select('.percentage')
                        .text(" Percentage: "+(mydata.PERCENT * 100) + "%");

                  tooltip
                         .select('.rank')
                         .text(" Rank: "+mydata.Rank);

                 tooltip
                        .select('.teens')
                        .text("Transgender Teens Population: "+mydata.teens);
                 tooltip
                        .select('.teensPercent')
                        .text("Percentage: "+(mydata.teensPercent * 100)+"%");
      })
      .on('mouseout', function () {
        var tooltip =d3.select('.tooltip');
        tooltip.transition()
            .style('opacity',0);

            // d3.select(this)
            //   .attr("fill", updateData("PERCENT"));



      });


      updateData("PERCENT");

    });

    function updateData(column) {

      states
        .attr("fill", function(d) {
          var stateId = d.id;
          var stateName = stateNames[stateId];
          var mydata = transLookup[stateName];
        //  console.log(stateId, stateName, mydata);
          if (mydata != undefined){
            var color = colorScale(mydata[column]);
            return color;
          }
          else{
            return "#ccc";
          }

        });

    }
