(function() {
  var args;

  args = require('./')("\nscriptname\n    additional  . ? unnamed arguments . **\n    anOption    . ? some description  . = default\n    boolean     . ? -b to turn it on  . = false\n    switch      . ? -s to turn it off . = true\n    invisible                 . = hidden\n    \nadditional help topic\n    some help\n    \nversion       1.0.0\n");

  console.log(require('noon').stringify(args, {
    colors: true
  }));

}).call(this);
