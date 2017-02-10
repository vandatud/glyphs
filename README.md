# Glyphs
Allows to create Starplots and similar visualisation with flower-petals using
d3.

## Colors Pallette
Both [flowerplot](js/flowerplot.js) and [starplot](js/starplot.js) contain (at least for
now) a hard-coded color palette, which is a string of hex-values representing
RGB color codes. The variable for pallette in both cases can be found in line
100 of the corresponding file. From this string, a 6-digit substring is then
used to get the color for the glyph (lines 114 and 126).

To change the colors, the whole process of picking one could either be replaced
with a more elegant approach like d3's functionality for color pallettes or by
simply replacing the string with another color-scheme.

## Transparency of petals
The transparency for the flower-petals is currently calculated by using a
the index of the current petal on the total numberof  petals. Therfore the first
"drawn" petal is the most and the last one the least transparent. (Will be
adapted, see #3)

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
