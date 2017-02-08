d3.flowerPlot = function() {
  let width = 200;
  let labelMargin = 20;
  let includeGuidelines = true;
  let includeLabels = true;
  let accessors = [];
  let labels = [];
  let title = nop;

  let margin = {
    top: 10,
    right: 0,
    bottom: 0,
    left: 0
  };

  let g;
  let datum;

  let radius = width / 2;
  let origin = [radius, radius];
  let radii = accessors.length;
  let radians = 2 * Math.PI / radii;

  let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, radius]);

  function chart(selection) {
    datum = selection.datum();
    g = selection
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    if (includeGuidelines) {
      drawGuidelines();
    }
    if (includeLabels) {
      drawLabels();
    }

    drawChart();
  }

  function drawGuidelines() {
    let r = 0;

    accessors.forEach(function(d, i) {
      let l, x, y;

      l = radius;
      x = l * Math.cos(r);
      y = l * Math.sin(r);

      g.append('line')
        .attr('class', 'flower-axis')
        .attr('x1', origin[0])
        .attr('y1', origin[1])
        .attr('x2', origin[0] + x)
        .attr('y2', origin[1] + y)

      r += radians;
    })
  }

  function drawLabels() {
    let r = 0;

    accessors.forEach(function(d, i) {
      let l, x, y;

      l = radius;
      x = (l + labelMargin + 5) * Math.cos(r);
      y = (l + labelMargin + 5) * Math.sin(r);

      g.append('text')
        .attr('class', 'label')
        .attr('x', origin[0] + x)
        .attr('y', origin[1] + y)
        .text(labels[i])
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'central')

      r += radians;
    })
  }

  function drawChart() {
    // circle in center of the diagram
    g.append('circle')
      .attr('class', 'origin')
      .attr('cx', origin[0])
      .attr('cy', origin[1])
      .attr('r', 2);

    let path = d3.line().curve(d3.curveCardinalClosed);
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let r = Math.PI / 2;

    // used to calculate some of the x-coordinates of the petal-path
    let totalPetalSpace = radians;
    if (radii <= 5) totalPetalSpace = 1; // tan would be INFINITY

    accessors.forEach(function(d) {

      let flowerPath = [[0,0]]; // holds all points of the petal-path

      let dx = scale(d(datum)) * Math.tan(totalPetalSpace) * 0.24;

      // the path of a flower petal is set by a cardinal curve through 5 points
      // The position of these 5 points is scaled by the value of the data entry
      // to fit the given space
      flowerPath.push(
        [0.4*dx, -scale(d(datum))*0.3],
        [dx, -scale(d(datum))*0.83],
        [0, -scale(d(datum))],
        [-dx, -scale(d(datum))*0.83],
        [-0.4*dx, -scale(d(datum))*0.3])

      // draw the petal of the flower representing one data entry using the
      // ponts from flowerpath. The resulting path is then rotated and
      // repositioned to the corresponding space in the flower
      g.append('path')
        .attr('class', 'flower-path')
        .attr('d', path(flowerPath) + 'Z')
        .attr('fill', color(d(datum)))
        .attr('transform', 'translate('+ origin[0] +','+ origin[1] +')rotate('+ r * (180 / Math.PI) +')');

      r += radians;
    });

    g.append('text')
      .attr('class', 'title')
      .attr('x', origin[0])
      .attr('y', -(margin.top / 2))
      .text(title(datum))
      .style('text-anchor', 'middle');
  }

  function nop() {
    return;
  }

  chart.accessors = function(_) {
    if (!arguments.length) return accessors;
    accessors = _;
    radii = accessors.length;
    radians = 2 * Math.PI / radii;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    radius = width / 2;
    origin = [radius, radius];
    scale.range([0, radius])
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    origin = [radius, radius];
    return chart;
  };

  chart.labelMargin = function(_) {
    if (!arguments.length) return labelMargin;
    labelMargin = _;
    return chart;
  };

  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.labels = function(_) {
    if (!arguments.length) return labels;
    labels = _;
    return chart;
  };

  chart.includeGuidelines = function(_) {
    if (!arguments.length) return includeGuidelines;
    includeGuidelines = _;
    return chart;
  };

  chart.includeLabels = function(_) {
    if (!arguments.length) return includeLabels;
    includeLabels = _;
    return chart;
  };

  return chart;
}
