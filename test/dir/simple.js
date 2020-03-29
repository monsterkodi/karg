// koffee 1.12.0
var args;

args = require('../../')("\nsimple\n    additional  . ? unnamed arguments . **\n    an-option   . ? some description  . = default\n    boolean     . ? -b to turn it on  . = false\n    switch      . ? -s to turn it off . = true\n    invisible                         . = hidden\n    \nhelp\n    some help\n    \nversion       1.0.0\n");

console.log(require('noon').stringify(args, {
    colors: true
}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbInNpbXBsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQUEsQ0FBa0Isb1RBQWxCOztBQWdCUCxPQUFPLENBQUMsR0FBUixDQUFZLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQztJQUFBLE1BQUEsRUFBTyxJQUFQO0NBQWhDLENBQVoiLCJzb3VyY2VzQ29udGVudCI6WyJcbmFyZ3MgPSByZXF1aXJlKCcuLi8uLi8nKSBcIlwiXCJcblxuc2ltcGxlXG4gICAgYWRkaXRpb25hbCAgLiA/IHVubmFtZWQgYXJndW1lbnRzIC4gKipcbiAgICBhbi1vcHRpb24gICAuID8gc29tZSBkZXNjcmlwdGlvbiAgLiA9IGRlZmF1bHRcbiAgICBib29sZWFuICAgICAuID8gLWIgdG8gdHVybiBpdCBvbiAgLiA9IGZhbHNlXG4gICAgc3dpdGNoICAgICAgLiA/IC1zIHRvIHR1cm4gaXQgb2ZmIC4gPSB0cnVlXG4gICAgaW52aXNpYmxlICAgICAgICAgICAgICAgICAgICAgICAgIC4gPSBoaWRkZW5cbiAgICBcbmhlbHBcbiAgICBzb21lIGhlbHBcbiAgICBcbnZlcnNpb24gICAgICAgMS4wLjBcblxuXCJcIlwiXG5cbmNvbnNvbGUubG9nIHJlcXVpcmUoJ25vb24nKS5zdHJpbmdpZnkgYXJncywgY29sb3JzOnRydWVcbiJdfQ==
//# sourceURL=simple.coffee