A Pen created at CodePen.io. You can find this one at http://codepen.io/Rowno/pen/Abtqg.

 Bug fix for the IE 10-11 Flexbox bug where flex items collapse to nothing when using the `flex` shorthand property in a vertical Flexbox layout. 

This happens because IE 10-11 treats the `flex-basis` as an absolute `height` when all flex items have a `flex`. And since the default value for `flex-basis` is `0px` when using `flex`, the elements end up being `0px` high.