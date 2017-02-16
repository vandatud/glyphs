d3.flowerPlot = function() {
  let width = 200;
  let labelMargin = 20;
  let includeGuidelines = true;
  let includeLabels = true;
  let accessors = [];
  let labels = [];
  let title = nop;
  let petalScale = 0.29; // used to change the size of the tip of petals

  let colorDomain = ['arts/entertainment/nightlife',
    'sports/recreation/activities', 'education', 'musician/band',
    'tours/sightseeing', 'health/beauty'];
  let colorRange = ['99BABC5F8F913A7477205D600B4144',
    'FFFACFF0E79DC5BA60A09435716711', 'FFE5CFF0C49DC58E60A06635713D11',
    'DFF1C4BEDD908FB5586B9331446810', 'B4A6C98470A3604786442B6D29124D',
    'E4B9CDCA84A4A55177862D555F0E33'];

  let margin = {
    top: 0,
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

  let color = d3.scaleOrdinal()
    .domain(colorDomain)
    .range(colorRange);

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

    let path = d3.line().curve(d3.curveBasis); // use b-splines to draw petals
    let r = Math.PI / 2; // degree in which petal points in rad

    accessors.forEach(function(d, i) {

      let flowerPath = []; // holds all points of the petal-path
      let value = scale(d(datum));

      // calculate the width of the tip of the petal using the value of the
      // petal. Increase very small values
      let dx = value * petalScale;
      if (dx <= 3)
        dx *= 2;

      if (value > 0)
        flowerPath.push(
          [0, 0],
          [0.25*dx, -value * (10 / 19)],
          [dx,  -value * 0.85],
          [0, -value],
          [-dx,  -value * 0.85],
          [-0.25*dx, -value * (10 / 19)],
          [0, 0])

      // draw the petal of the flower representing one data entry using the
      // ponts from flowerpath. The resulting path is then rotated and
      // repositioned to the corresponding space in the flower
      g.append('path')
        .attr('class', 'flower-path')
        .attr('d', path(flowerPath) + 'Z')
        .attr('fill', '#' + color(datum.Category).substring(i*6, i*6 + 6))
        .attr('stroke', '#' + color(datum.Category).substring(12, 18))
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

  chart.colorDomain = function(_) {
    if(!arguments.length) return colorDomain;
    colorDomain = _;
    return chart;
  };

  chart.colorRange = function(_) {
    if(!arguments.length) return colorRange;
    colorRange = _;
    return chart;
  };

  chart.petalScale = function(_) {
    if (!arguments.length) return petalScale;
    petalScale = _;
    return chart;
  };

  return chart;
}
