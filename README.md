# Glyphs
Allows to create Starplots and similar visualisation with flower-petals using
d3.

## Color Palette
Both [flowerplot](js/flowerplot.js) and [starplot](js/starplot.js) contain a
color palette, which is a string of hex-values representing
RGB color codes. Using an ordinal scale for which the ``Category`` Attribute
serves as the domain and a predefined color pallette as range, a brightness
value substring is picked.

Both flower- and starplots currently work with a preset color scheme holding
five different hue values. The domain and the range (--> colors) can be adapted
by calling the corresponding ``.colorDomain()`` and ``.colorRange()`` functions.

## Brightness of petals
The individual petal-color is a substring from the color palette for the current
flower (line 138 in [flowerplot.js](js/flowerplot.js)).

## Changing the petal layout
The Layout of the flowerplot's petals can be changed by placing new control
points inside the `flowerPath` Array. The intensity of the value is indicated
by the size of the petal, therefore the peak in the petal is calculated using
the scaled value (`-value`). Helping to keep the shape two other support
points are used.

Padding, margin, etc. of the petal can be influenced by calling the
corresponding member function for `d3.starplot` and `d3.flowerplot` (last
lines inside the scripts).

## Changing the data source
For the test script, the data comes from a csv file which is parsed by the
`d3.csv()` functionality in [file](js/main.js). To change the data source:

* exchange the string for the path to the data
* for all numerical attributes in your data, set them to their absolute values
  inside the `.row()` function after that
* if non-numerical values should be visualized, adapt the used scales for these
values using ordinal scales
* Adapt the `domain` and `range` values according to your data
