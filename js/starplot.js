d3.starPlot = function() {
  let width = 200;
  let labelMargin = 20;
  let includeGuidelines = true;
  let includeLabels = true;
  let accessors = [];
  let labels = [];
  let title = nop;

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
        .attr('class', 'star-axis')
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
      x = (l + labelMargin) * Math.cos(r);
      y = (l + labelMargin) * Math.sin(r);

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
    g.append('circle')
      .attr('class', 'origin')
      .attr('cx', origin[0])
      .attr('cy', origin[1])
      .attr('r', 2);

    let path = d3.radialLine();

    let pathData = [];
    let r = Math.PI / 2;
    let c = parseInt(datum.RowID) % 50;

    pallette = '1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5';

    accessors.forEach(function(d) {
      pathData.push([
        r,
        scale(d(datum))
      ]);

      r += radians;
    });

    g.append('path')
      .attr('class', 'star-path')
      .attr('transform', 'translate(' + origin[0] + ',' + origin[1] + ')')
      .attr('fill', '#' + pallette.substring(c, c+6))
      .attr('d', path(pathData) + 'Z');

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
