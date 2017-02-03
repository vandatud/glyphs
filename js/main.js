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
    var star = d3.starPlot()
      .width(width)
      .accessors([
        function(d) { return scale(d.Body); },
        function(d) { return scale(d.Sweetness); },
        function(d) { return scale(d.Smoky); },
        function(d) { return scale(d.Honey); },
        function(d) { return scale(d.Spicy); },
        function(d) { return scale(d.Nutty); },
        function(d) { return scale(d.Malty); },
        function(d) { return scale(d.Fruity); },
        function(d) { return scale(d.Floral); },
      ])
      .labels([
        'Body',
        'Sweetness',
        'Smoky',
        'Honey',
        'Spicy',
        'Nutty',
        'Malty',
        'Fruity',
        'Floral',
      ])
      .title(function(d) { return d.Distillery; })
      .margin(margin)
      .labelMargin(labelMargin)

    rows.forEach(function(d, i) {

      if (i > 3) return;

      d3.select('#target').append('svg')
        .attr('class', 'chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', width + margin.top + margin.bottom)
        .append('g')
          .datum(d)
          .call(star)
    });
  });
