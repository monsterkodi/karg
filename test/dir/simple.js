(function() {
  var args;

  args = require('../../')("\nsimple\n    additional  . ? unnamed argument  . * . = no name\n    an-option   . ? some description  . = default\n    boolean     . ? -b to turn it on  . = false\n    switch      . ? -s to turn it off . = true\n    invisible                 . = hidden\n    \nadditional help topic\n    some help\n    \nversion       1.0.0\n");

  console.log(require('noon').stringify(args, {
    colors: true
  }));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NpbXBsZS5jb2ZmZSIsInNvdXJjZXMiOlsic2ltcGxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQUEsQ0FBa0Isd1VBQWxCOztFQWdCUCxPQUFPLENBQUMsR0FBUixDQUFZLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQztJQUFBLE1BQUEsRUFBTztFQUFQLENBQWhDLENBQVo7QUFoQkEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmFyZ3MgPSByZXF1aXJlKCcuLi8uLi8nKSBcIlwiXCJcblxuc2ltcGxlXG4gICAgYWRkaXRpb25hbCAgLiA/IHVubmFtZWQgYXJndW1lbnQgIC4gKiAuID0gbm8gbmFtZVxuICAgIGFuLW9wdGlvbiAgIC4gPyBzb21lIGRlc2NyaXB0aW9uICAuID0gZGVmYXVsdFxuICAgIGJvb2xlYW4gICAgIC4gPyAtYiB0byB0dXJuIGl0IG9uICAuID0gZmFsc2VcbiAgICBzd2l0Y2ggICAgICAuID8gLXMgdG8gdHVybiBpdCBvZmYgLiA9IHRydWVcbiAgICBpbnZpc2libGUgICAgICAgICAgICAgICAgIC4gPSBoaWRkZW5cbiAgICBcbmFkZGl0aW9uYWwgaGVscCB0b3BpY1xuICAgIHNvbWUgaGVscFxuICAgIFxudmVyc2lvbiAgICAgICAxLjAuMFxuXG5cIlwiXCJcblxuY29uc29sZS5sb2cgcmVxdWlyZSgnbm9vbicpLnN0cmluZ2lmeSBhcmdzLCBjb2xvcnM6dHJ1ZVxuIl19
//# sourceURL=C:/Users/t.kohnhorst/s/karg/test/dir/simple.coffee