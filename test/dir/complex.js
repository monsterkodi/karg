(function() {
  var args;

  args = require('../../')("\ncomplex\n    additional    . ? unnamed arguments   . **\n    empty         . ? has no default\n    string        . ? has string default  . = string\n    int           . ? has integer default . = 6\n    float         . ? has float default   . = 1.23\n    changed-abbr  . ? has -C as abbr      . - C . = cool\n    \nhelp\n    some topic  some text  \n    another topix  more help\n    \nversion       1.0.0\n");

  console.log(require('noon').stringify(args, {
    colors: true
  }));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxleC5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb21wbGV4LmNvZmZlIiwic291cmNlcyI6WyJjb21wbGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQUEsQ0FBa0IsMFpBQWxCOztFQWtCUCxPQUFPLENBQUMsR0FBUixDQUFZLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQztJQUFBLE1BQUEsRUFBTztFQUFQLENBQWhDLENBQVo7QUFsQkEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmFyZ3MgPSByZXF1aXJlKCcuLi8uLi8nKSBcIlwiXCJcblxuY29tcGxleFxuICAgIGFkZGl0aW9uYWwgICAgLiA/IHVubmFtZWQgYXJndW1lbnRzICAgLiAqKlxuICAgIGVtcHR5ICAgICAgICAgLiA/IGhhcyBubyBkZWZhdWx0XG4gICAgc3RyaW5nICAgICAgICAuID8gaGFzIHN0cmluZyBkZWZhdWx0ICAuID0gc3RyaW5nXG4gICAgaW50ICAgICAgICAgICAuID8gaGFzIGludGVnZXIgZGVmYXVsdCAuID0gNlxuICAgIGZsb2F0ICAgICAgICAgLiA/IGhhcyBmbG9hdCBkZWZhdWx0ICAgLiA9IDEuMjNcbiAgICBjaGFuZ2VkLWFiYnIgIC4gPyBoYXMgLUMgYXMgYWJiciAgICAgIC4gLSBDIC4gPSBjb29sXG4gICAgXG5oZWxwXG4gICAgc29tZSB0b3BpYyAgc29tZSB0ZXh0ICBcbiAgICBhbm90aGVyIHRvcGl4ICBtb3JlIGhlbHBcbiAgICBcbnZlcnNpb24gICAgICAgMS4wLjBcblxuXCJcIlwiXG5cbmNvbnNvbGUubG9nIHJlcXVpcmUoJ25vb24nKS5zdHJpbmdpZnkgYXJncywgY29sb3JzOnRydWVcbiJdfQ==
//# sourceURL=C:/Users/kodi/s/karg/test/dir/complex.coffee