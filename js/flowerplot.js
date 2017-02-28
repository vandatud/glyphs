d3.flowerPlot = function() {
  let width = 200;
  let labelMargin = 20;
  let includeGuidelines = false;
  let includeLabels = true;
  let useBrightnessIndication = true;
  let accessors = [];
  let labels = [];
  let title = nop;
  let petalScale = 0.29; // used to change the size of the tip of petals

  let colorDomain = ['Entertainment', 'Sport', 'Bildung', 'Band', 'Tourismus', 'Beauty'];
  let colorRange = ['46A9AE46A9AE46A9AE46A9AE46A9AE',
    'E1CE94E1CE94E1CE94E1CE94E1CE94', 'C57D60C57D60C57D60C57D60C57D60',
    '8FB5588FB5588FB5588FB5588FB558', '8768C88768C88768C88768C88768C8',
    'A55177A55177A55177A55177A55177'];

  let margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  let datum;
  let context;
  let originX;
  let originY;

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

  // adapt the scale dynamically to changes of the colorRange: The longer the
  // string for one single category, the more possible inttensities are possible
  let intensity = d3.scaleLinear()
    .domain([0, 100])
    .range([0, colorRange[0].length/6 - 1]);

  function chart(selection) {
    datum = selection.datum();

    context = selection.node().getContext('2d');

    originX = origin[0] + margin.left;
    originY = origin[1] + margin.top;

    context.translate(originX, originY);

    if (includeGuidelines) {
      drawGuidelines();
    }
    if (includeLabels) {
      drawLabels();
    }

    drawChart();
  }

  function drawGuidelines() {
    context.save();
    let r = 0;

    context.beginPath();
    context.strokeStyle = '#ccc';
    context.lineWidth = 1;

    accessors.forEach(function(d, i) {
      let l, x, y;

      l = radius;
      x = l * Math.cos(r);
      y = l * Math.sin(r);
      context.moveTo(0, 0)
      context.lineTo(x, y, 2);

      r += radians;
    });

    context.stroke();
    context.restore();
  }

  function drawLabels() {
    let r = 0;
    context.beginPath();
    context.textAlign = 'center';

    accessors.forEach(function(d, i) {
      let l, x, y;

      l = radius;
      x = (l + labelMargin + 5) * Math.cos(r);
      y = (l + labelMargin + 5) * Math.sin(r);

      context.fillText(labels[i], x, y);

      r += radians;
    })
  }

  function drawChart() {
    // circle in center of the diagram
    context.save();
    context.beginPath();

    // draw maximum-value circle
    context.strokeStyle = '#ccc';
    context.lineWidth = 1;
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.stroke();

    let path = d3.line().curve(d3.curveBasis); // use b-splines to draw petals
    let r = Math.PI / 2; // degree in which petal points in rad

    let fill;

    accessors.forEach(function(d, i) {
      context.save();
      context.rotate(r);

      let flowerPath = []; // holds all points of the petal-path
      let value = scale(d(datum));

      // calculate the width of the tip of the petal using the value of the
      // petal. Increase very small values
      let dx = value * petalScale;
      if (dx <= 3)
        dx *= 2;

      let b; // brightness index

      useBrightnessIndication
        ? b = parseInt(intensity(d(datum)))
        : b = i;

      fill = '#' + color(datum.Category).substring(b*6, b*6 + 6);

      // draw the petal of the flower representing one data entry using the
      // ponts from flowerpath. The resulting path is then rotated and
      // repositioned to the corresponding space in the flower
      if (value > 0)
        flowerPath.push(
          [0, 0],
          [0.2*dx, -value * (10 / 19)],
          [dx, -value * 0.89],
          [0, -value * 1.03],
          [-dx, -value * 0.89],
          [-0.2*dx, -value * (10 / 19)],
          [0, 0]);

      // hack: generate the path using svg-functionality and use it later for
      // canvas
      let p = d3.select('body').append('path').attr('d', path(flowerPath) + 'Z')

      let px = new Path2D(p.attr('d')); // use the path generated in svg
      context.strokeStyle = '#' + color(datum.Category).substring(12, 18);
      context.stroke(px);

      context.fillStyle = fill;
      context.fill(px);

      r += radians;
      context.restore();
    });

    context.restore();
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

    color.domain(colorDomain);

    return chart;
  };

  chart.colorRange = function(_) {
    if(!arguments.length) return colorRange;
    colorRange = _;

    color.domain(colorDomain).range(colorRange);
    intensity.range([0, colorRange[0].length/6 - 1]);

    return chart;
  };

  chart.petalScale = function(_) {
    if (!arguments.length) return petalScale;
    petalScale = _;
    return chart;
  };

  chart.useBrightnessIndication = function(_) {
    if (!arguments.length) return useBrightnessIndication;
    useBrightnessIndication = _;
    return chart;
  };

  return chart;
}
