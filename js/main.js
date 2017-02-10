var margin = {
  top: 36,
  right: 50,
  bottom: 20,
  left: 50
};

var width = 240 - margin.left - margin.right;
var height = 240 - margin.top - margin.bottom;
var labelMargin = 8;

var scale = d3.scaleLinear()
  .domain([0, 4])
  .range([0, 100])

// for specifics to whiskies.csv see documentation in drawFlowerplot()
function drawStarplot(noOfRows) {
  d3.csv('whiskies.csv')
    .row(function(d) {
        d.Body = +d.Body;
        d.Sweetness = +d.Sweetness;
        d.Smoky = +d.Smoky;
        d.Medicinal = +d.Medicinal;
        d.Tobacco = +d.Tobacco;
        d.Honey = +d.Honey;
        d.Spicy = +d.Spicy;
        d.Winey = +d.Winey;
        d.Nutty = +d.Nutty;
        d.Malty = +d.Malty;
        d.Fruity = +d.Fruity;
        d.Floral = +d.Floral;
        return d;
    })
    .get(function(error, rows) {
      let labels = [];
      let accessors = [];
      let pp = 0;
      for (let x in rows[0]) {
        pp++;
        if (pp > 3 + noOfRows || pp > 14) break;
        if (pp < 3) continue;
        labels.push(x);
        accessors.push(function(d) { return scale(d[x]); })
      }

      var star = d3.starPlot()
        .width(width)
        .accessors(accessors)
        .labels(labels)
        .includeLabels(showStarLabels)
        .title(function(d) { return d.Distillery; })
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function(d, i) {

        if (i > 11) return; // draw 4 starplots (4 rows of data)

        d3.select('#target').append('svg')
          .datum(d)
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .on('click', debug)
          .append('g')
            .call(star)
      });
    });
    $('#starRowsCounter').text("Achsen: " + (currentNoOfRowsFlower+1));
}

function drawFlowerplot(noOfRows) {
  d3.csv('whiskies.csv')
    .row(function(d) { // all values are set to their absolutes
        d.Body = +d.Body;
        d.Sweetness = +d.Sweetness;
        d.Smoky = +d.Smoky;
        d.Medicinal = +d.Medicinal;
        d.Tobacco = +d.Tobacco;
        d.Honey = +d.Honey;
        d.Spicy = +d.Spicy;
        d.Winey = +d.Winey;
        d.Nutty = +d.Nutty;
        d.Malty = +d.Malty;
        d.Fruity = +d.Fruity;
        d.Floral = +d.Floral;
        return d;
    })
    .get(function(error, rows) {
      let labels = [];
      let accessors = [];
      let pp = 0;

      // get headers of the data-columns
      for (let x in rows[0]) {
        pp++;
        // in the whiskies.csv, the first three rows and some of the last ones
        // are not suitable for plotting, therefore ignore those
        if (pp > 3 + noOfRows || pp > 14) break;
        if (pp < 3) continue;
        labels.push(x); // name of the column
        // a linear scale for the current data entry
        accessors.push(function(d) { return scale(d[x]); })
      }

      // setup the flower's attributes
      var flower = d3.flowerPlot()
        .width(width)
        .accessors(accessors)
        .labels(labels)
        .includeLabels(showFlowerLabels)
        .title(function(d) { return d.Distillery; }) // unique to whiskies.csv
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function(d, i) {

        if (i > 11) return;

        // draw the flower
        d3.select('#flowerTarget').append('svg')
          .datum(d)
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .on('click', debug)
          .append('g')
            .call(flower)
      });
    });
    $('#flowerRowsCounter').text("Achsen: " + (currentNoOfRowsFlower+1));
}

function debug(d) {
  console.debug('Click: ' + d.toSource());
}

let currentNoOfRowsStar = 5;
let currentNoOfRowsFlower = 5;

let showFlowerLabels = true;
let showStarLabels = true;

drawStarplot(currentNoOfRowsStar);
drawFlowerplot(currentNoOfRowsFlower);

$('#guidelineToggle').on('click', function() { $('.star-axis').toggle(); });
$('#flowerGuidelineToggle').on('click', function() { $('.flower-axis').toggle(); });

$('#flowerLabelsToggle').on('click', function() {
  // showFlowerLabels = !showFlowerLabels;
  $('#flowerTarget svg text').toggle();
});

$('#starLabelsToggle').on('click', function() {
  // showStarLabels = !showStarLabels;
  $('#target svg text').toggle();
});

$('#moreDataButton').on('click', function() {
  if (currentNoOfRowsStar > 14) return;
  currentNoOfRowsStar++;

  $('#target svg').remove();
  drawStarplot(currentNoOfRowsStar)
});
$('#lessDataButton').on('click', function() {
  if (currentNoOfRowsStar < 4) return;
  currentNoOfRowsStar--;

  $('#target svg').remove();
  drawStarplot(currentNoOfRowsStar)
});
$('#flowerMoreDataButton').on('click', function() {
  if (currentNoOfRowsFlower > 14) return;
  currentNoOfRowsFlower++;

  $('#flowerTarget svg').remove();
  drawFlowerplot(currentNoOfRowsFlower)
});
$('#flowerLessDataButton').on('click', function() {
  if (currentNoOfRowsFlower < 4) return;
  currentNoOfRowsFlower--;

  $('#flowerTarget svg').remove();
  drawFlowerplot(currentNoOfRowsFlower)
});
