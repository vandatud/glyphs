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
        .title(function(d) { return d.Distillery; })
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function(d, i) {

        if (i > 3) return; // draw 4 starplots (4 rows of data)

        d3.select('#target').append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .append('g')
            .datum(d)
            .call(star)
      });
    });
}

function drawFlowerplot(noOfRows) {
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

      var flower = d3.flowerPlot()
        .width(width)
        .accessors(accessors)
        .labels(labels)
        .title(function(d) { return d.Distillery; })
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function(d, i) {

        if (i > 3) return; // draw 4 starplots (4 rows of data)

        d3.select('#flowerTarget').append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .append('g')
            .datum(d)
            .call(flower)
      });
    });
}

let currentNoOfRowsStar = 6;
let currentNoOfRowsFlower = 6;

drawStarplot(currentNoOfRowsStar);
drawFlowerplot(currentNoOfRowsFlower);

$('#guidelineToggle').on('click', function() { $('.star-axis').toggle(); });
$('#flowerGuidelineToggle').on('click', function() { $('.flower-axis').toggle(); });

$('#moreDataButton').on('click', function() {
  if (currentNoOfRowsStar > 10) return;
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
  if (currentNoOfRowsFlower > 10) return;
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
