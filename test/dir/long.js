(function() {
  var args;

  args = require('../../')("\nlong\n    very-long-key-name  . ? some very long description text which doesn't make much sense. . * . = and some default\n    another-long-one    . ? some modest length description. . = but very long default that doesn't make sense either...\n    short   . ? simple  . = true\n    \nsome longer help topic header\n    some longer help text body content whatever could stand here");

  console.log(require('noon').stringify(args, {
    colors: true
  }));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9uZy5qcyIsInNvdXJjZVJvb3QiOiIuLi9sb25nLmNvZmZlIiwic291cmNlcyI6WyJsb25nLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQUEsQ0FBa0IsK1hBQWxCOztFQVdQLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLFNBQWhCLENBQTBCLElBQTFCLEVBQWdDO0lBQUEsTUFBQSxFQUFPO0VBQVAsQ0FBaEMsQ0FBWjtBQVhBIiwic291cmNlc0NvbnRlbnQiOlsiXG5hcmdzID0gcmVxdWlyZSgnLi4vLi4vJykgXCJcIlwiXG5cbmxvbmdcbiAgICB2ZXJ5LWxvbmcta2V5LW5hbWUgIC4gPyBzb21lIHZlcnkgbG9uZyBkZXNjcmlwdGlvbiB0ZXh0IHdoaWNoIGRvZXNuJ3QgbWFrZSBtdWNoIHNlbnNlLiAuICogLiA9IGFuZCBzb21lIGRlZmF1bHRcbiAgICBhbm90aGVyLWxvbmctb25lICAgIC4gPyBzb21lIG1vZGVzdCBsZW5ndGggZGVzY3JpcHRpb24uIC4gPSBidXQgdmVyeSBsb25nIGRlZmF1bHQgdGhhdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgZWl0aGVyLi4uXG4gICAgc2hvcnQgICAuID8gc2ltcGxlICAuID0gdHJ1ZVxuICAgIFxuc29tZSBsb25nZXIgaGVscCB0b3BpYyBoZWFkZXJcbiAgICBzb21lIGxvbmdlciBoZWxwIHRleHQgYm9keSBjb250ZW50IHdoYXRldmVyIGNvdWxkIHN0YW5kIGhlcmVcblwiXCJcIlxuXG5jb25zb2xlLmxvZyByZXF1aXJlKCdub29uJykuc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG4iXX0=
//# sourceURL=C:/Users/t.kohnhorst/s/karg/test/dir/long.coffee