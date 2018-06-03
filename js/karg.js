(function() {
  /*
  000   000   0000000   00000000    0000000 
  000  000   000   000  000   000  000      
  0000000    000000000  0000000    000  0000
  000  000   000   000  000   000  000   000
  000   000  000   000  000   000   0000000 
  */
  /*
  00000000  00000000   00000000    0000000   00000000 
  000       000   000  000   000  000   000  000   000
  0000000   0000000    0000000    000   000  0000000  
  000       000   000  000   000  000   000  000   000
  00000000  000   000  000   000   0000000   000   000
  */
  /*
  00000000  000   000  00000000    0000000   000   000  0000000  
  000        000 000   000   000  000   000  0000  000  000   000
  0000000     00000    00000000   000000000  000 0 000  000   000
  000        000 000   000        000   000  000  0000  000   000
  00000000  000   000  000        000   000  000   000  0000000  
  */
  var clone, colors, error, expand, isEmpty, isString, log, noon, padEnd, parse, size, values,
    indexOf = [].indexOf;

  log = console.log;

  noon = require('noon');

  colors = require('colors');

  isEmpty = require('lodash.isempty');

  padEnd = require('lodash.padend');

  size = require('lodash.size');

  values = require('lodash.values');

  isString = require('lodash.isstring');

  clone = require('lodash.clone');

  expand = function(l) {
    var a, j, len, match;
    for (j = 0, len = l.length; j < len; j++) {
      a = l[j];
      if (match = /^\-(\w\w+)$/.exec(a)) {
        a = match[1].split('').map(function(i) {
          return '-' + i;
        });
        a.unshift(l.indexOf(match.input), 1);
        l.splice.apply(l, a);
        return expand(l);
      }
    }
    return l;
  };

  error = function(msg) {
    var s;
    s = "[".dim.red + "ERROR".bold.dim.red + "] ".dim.red;
    s += msg.trim().split('\n').join("\n        ").red;
    return log(s);
  };

  /*
  00000000    0000000   00000000    0000000  00000000
  000   000  000   000  000   000  000       000     
  00000000   000000000  0000000    0000000   0000000 
  000        000   000  000   000       000  000     
  000        000   000  000   000  0000000   00000000
  */
  // options: 
  //     dontExit:    don't exit process on -V/--version or -h/--help  (returns undefined instead)
  parse = function(config, options = {}) {
    /*
    000   000  00000000  000      00000000 
    000   000  000       000      000   000
    000000000  0000000   000      00000000 
    000   000  000       000      000      
    000   000  00000000  0000000  000      
    */
    /*
     0000000   00000000   000000000  000   0000000   000   000   0000000
    000   000  000   000     000     000  000   000  0000  000  000     
    000   000  00000000      000     000  000   000  000 0 000  0000000 
    000   000  000           000     000  000   000  000  0000       000
     0000000   000           000     000   0000000   000   000  0000000 
    */
    var arg, df, expandedArgs, help, helpText, k, lng, maxArgLength, maxHelpLength, name, optionsText, param, paramList, ref, ref1, result, short, sht, v, version;
    if (isString(config)) {
      config = noon.parse(config);
    } else {
      config = clone(config);
    }
    name = Object.keys(config)[0];
    result = {}; // the object we are creating from the provided arguments and the configuration
    help = {}; // maps shortcut keys to help texts
    short = {}; // maps shortcut keys to long key names
    param = '';
    paramList = false;
    ref = clone(config[name]);
    for (k in ref) {
      v = ref[k];
      if (0 <= k.indexOf(' ')) {
        error(`wrong karg setup: ${"keys can't contain spaces!".bold}\nbroken key: ${k.bold.yellow}`);
        process.exit(1);
      }
      if (v['='] != null) {
        result[k] = v['='];
      }
      sht = (v['-'] != null) && v['-'] || k[0];
      if (k !== k.toLowerCase()) {
        delete config[name][k];
        k = k.toLowerCase();
        config[name][k] = v;
      }
      if (indexOf.call(Object.keys(v), '*') >= 0) {
        param = k;
      } else if (indexOf.call(Object.keys(v), '**') >= 0) {
        param = k;
        paramList = true;
        result[param] = [];
      } else {
        short[sht] = k;
        help[sht] = v['?'];
      }
    }
    optionsText = "";
    maxArgLength = 0;
    maxHelpLength = 0;
    for (sht in short) {
      lng = short[sht];
      if (help[sht] != null) {
        maxArgLength = Math.max(maxArgLength, sht.length + lng.length);
        maxHelpLength = Math.max(maxHelpLength, help[sht].strip.length);
      }
    }
    for (sht in short) {
      lng = short[sht];
      if (help[sht] != null) {
        df = (function() {
          switch (result[lng]) {
            case false:
              return '✘'.red.dim;
            case true:
              return '✔'.green.bold;
            default:
              return result[lng];
          }
        })();
        optionsText += '\n';
        optionsText += `    ${'-'.gray}${s}${', --'.gray}${lng}`;
        optionsText += `    ${padEnd('', Math.max(0, maxArgLength - sht.length - lng.length))} ${help[sht]}`.gray.bold;
        if (df != null) {
          optionsText += `    ${padEnd('', Math.max(0, maxHelpLength - help[sht].strip.length))} ${df}`.magenta;
        }
      }
    }
    helpText = `\n${'usage:'.gray}  ${n.bold} `;
    if (1 < size(short)) {
      helpText += `${'['.gray}${'options'.bold.gray}${']'.gray} `;
    }
    helpText += `${'['.gray}${p.bold.yellow}${l && ' ... ]'.gray || ']'.gray}`;
    helpText += '\n';
    if ((ref1 = config[name][param]) != null ? ref1['?'] : void 0) {
      helpText += `\n${padEnd('        ' + p, maxArgLength + 9)} ${config[name][param]['?'].gray}`.yellow.bold;
      if ((config[name][param]['='] != null) && !l) {
        helpText += `  ${padEnd('', Math.max(0, maxHelpLength - config[name][param]['?'].strip.length))} ${config[name][param]['=']}`.magenta;
      }
      helpText += '\n';
    }
    if (optionsText.length) {
      helpText += "\noptions:\n".gray;
      helpText += optionsText;
      helpText += '\n\n';
    }
    short['h'] = 'help';
    if (config.version != null) {
      version = config.version;
      delete config.version;
      short['V'] = 'version';
    }
    delete config[name];
    if (!isEmpty(config)) {
      helpText += noon.stringify(config, {
        maxalign: 16,
        colors: {
          key: colors.gray,
          string: colors.white
        }
      });
      helpText += '\n';
    }
    /*
    00000000   00000000   0000000  000   000  000      000000000
    000   000  000       000       000   000  000         000   
    0000000    0000000   0000000   000   000  000         000   
    000   000  000            000  000   000  000         000   
    000   000  00000000  0000000    0000000   0000000     000   
    */
    if (options.ignoreArgs == null) {
      options.ignoreArgs = 2;
    }
    expandedArgs = expand(process.argv.slice(options.ignoreArgs));
    while (arg = expandedArgs.shift()) {
      if (arg.substr(0, 2) === '--') {
        arg = arg.substr(2);
      } else if (arg[0] === '-') {
        arg = short[arg.substr(1)];
      } else {
        if (paramList) {
          result[param].push(arg);
        } else {
          result[param] = arg;
        }
        continue;
      }
      if (arg === 'help') {
        log(helpText);
        if (options.dontExit) {
          return;
        }
        process.exit();
      } else if (arg === 'version' && (version != null)) {
        log(version);
        if (options.dontExit) {
          return;
        }
        process.exit();
      }
      if (result[arg] === false || result[arg] === true) {
        result[arg] = !result[arg];
      } else if (!isNaN(parseInt(result[arg]))) {
        result[arg] = parseInt(a.shift());
      } else if (indexOf.call(values(short), arg) >= 0) {
        result[arg] = a.shift();
      } else {
        if (paramList) {
          result[param].push(arg);
        } else {
          result[param] = arg;
        }
      }
    }
    return result;
  };

  module.exports = parse;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyZy5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlL2thcmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBO0lBQUE7O0VBUUEsR0FBQSxHQUFXLE9BQU8sQ0FBQzs7RUFDbkIsSUFBQSxHQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7RUFDWCxPQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsZUFBUjs7RUFDWCxJQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsTUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSOztFQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVI7O0VBQ1gsS0FBQSxHQUFXLE9BQUEsQ0FBUSxjQUFSOztFQVVYLE1BQUEsR0FBUyxRQUFBLENBQUMsQ0FBRCxDQUFBO0FBQ0wsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQTtJQUFBLEtBQUEsbUNBQUE7O01BQ0ksSUFBRyxLQUFBLEdBQVEsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FBbkIsQ0FBWDtRQUNJLENBQUEsR0FBSSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVCxDQUFlLEVBQWYsQ0FBa0IsQ0FBQyxHQUFuQixDQUF1QixRQUFBLENBQUMsQ0FBRCxDQUFBO2lCQUFPLEdBQUEsR0FBSTtRQUFYLENBQXZCO1FBQ0osQ0FBQyxDQUFDLE9BQUYsQ0FBVSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQUssQ0FBQyxLQUFoQixDQUFWLEVBQWtDLENBQWxDO1FBQ0EsQ0FBQyxD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SUFBZCxDQUFtQixHQUFuQixFQURKO1NBQUEsTUFBQTtVQUdJLE1BQU8sQ0FBQSxLQUFBLENBQVAsR0FBZ0IsSUFIcEI7U0FIQzs7SUExQlQ7V0FpQ0E7RUF4Skk7O0VBMEpSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBck5qQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgXG4wMDAgIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICBcbjAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMCAgMDAwMFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcbiMjI1xuXG5sb2cgICAgICA9IGNvbnNvbGUubG9nXG5ub29uICAgICA9IHJlcXVpcmUgJ25vb24nXG5jb2xvcnMgICA9IHJlcXVpcmUgJ2NvbG9ycydcbmlzRW1wdHkgID0gcmVxdWlyZSAnbG9kYXNoLmlzZW1wdHknXG5wYWRFbmQgICA9IHJlcXVpcmUgJ2xvZGFzaC5wYWRlbmQnXG5zaXplICAgICA9IHJlcXVpcmUgJ2xvZGFzaC5zaXplJ1xudmFsdWVzICAgPSByZXF1aXJlICdsb2Rhc2gudmFsdWVzJ1xuaXNTdHJpbmcgPSByZXF1aXJlICdsb2Rhc2guaXNzdHJpbmcnXG5jbG9uZSAgICA9IHJlcXVpcmUgJ2xvZGFzaC5jbG9uZSdcblxuIyMjXG4wMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICBcbjAwMCAgICAgICAgMDAwIDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgIDAwMFxuMDAwMDAwMCAgICAgMDAwMDAgICAgMDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4wMDAgICAgICAgIDAwMCAwMDAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDBcbjAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyMjXG5cbmV4cGFuZCA9IChsKSAtPlxuICAgIGZvciBhIGluIGwgXG4gICAgICAgIGlmIG1hdGNoID0gL15cXC0oXFx3XFx3KykkLy5leGVjIGFcbiAgICAgICAgICAgIGEgPSBtYXRjaFsxXS5zcGxpdCgnJykubWFwIChpKSAtPiAnLScraVxuICAgICAgICAgICAgYS51bnNoaWZ0IGwuaW5kZXhPZihtYXRjaC5pbnB1dCksIDFcbiAgICAgICAgICAgIGwuc3BsaWNlLmFwcGx5IGwsIGFcbiAgICAgICAgICAgIHJldHVybiBleHBhbmQgbFxuICAgIGxcblxuIyMjXG4wMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4wMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4wMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4jIyNcblxuZXJyb3IgPSAobXNnKSAtPlxuICAgIHMgPSBcIltcIi5kaW0ucmVkICsgXCJFUlJPUlwiLmJvbGQuZGltLnJlZCArIFwiXSBcIi5kaW0ucmVkIFxuICAgIHMgKz0gbXNnLnRyaW0oKS5zcGxpdCgnXFxuJykuam9pbihcIlxcbiAgICAgICAgXCIpLnJlZFxuICAgIGxvZyBzXG5cbiMjI1xuMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICBcbjAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwIFxuMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgXG4wMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDBcbiMjI1xuXG4jIG9wdGlvbnM6IFxuIyAgICAgZG9udEV4aXQ6ICAgIGRvbid0IGV4aXQgcHJvY2VzcyBvbiAtVi8tLXZlcnNpb24gb3IgLWgvLS1oZWxwICAocmV0dXJucyB1bmRlZmluZWQgaW5zdGVhZClcblxucGFyc2UgPSAoY29uZmlnLCBvcHRpb25zPXt9KSAtPlxuICAgIFxuICAgIGlmIGlzU3RyaW5nIGNvbmZpZ1xuICAgICAgICBjb25maWcgPSBub29uLnBhcnNlIGNvbmZpZ1xuICAgIGVsc2VcbiAgICAgICAgY29uZmlnID0gY2xvbmUgY29uZmlnXG5cbiAgICBuYW1lICAgPSBPYmplY3Qua2V5cyhjb25maWcpWzBdICMgdGhlIGFwcGxpY2F0aW9uL3NjcmlwdCBuYW1lXG4gICAgcmVzdWx0ID0ge30gIyB0aGUgb2JqZWN0IHdlIGFyZSBjcmVhdGluZyBmcm9tIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYW5kIHRoZSBjb25maWd1cmF0aW9uXG4gICAgaGVscCAgID0ge30gIyBtYXBzIHNob3J0Y3V0IGtleXMgdG8gaGVscCB0ZXh0c1xuICAgIHNob3J0ICA9IHt9ICMgbWFwcyBzaG9ydGN1dCBrZXlzIHRvIGxvbmcga2V5IG5hbWVzXG4gICAgcGFyYW0gID0gJydcbiAgICBwYXJhbUxpc3QgPSBmYWxzZVxuICAgIFxuICAgIGZvciBrLHYgb2YgY2xvbmUgY29uZmlnW25hbWVdXG4gICAgICAgIFxuICAgICAgICBpZiAwIDw9IGsuaW5kZXhPZiAnICdcbiAgICAgICAgICAgIGVycm9yIFwiXCJcIlxuICAgICAgICAgICAgd3Jvbmcga2FyZyBzZXR1cDogI3tcImtleXMgY2FuJ3QgY29udGFpbiBzcGFjZXMhXCIuYm9sZH1cbiAgICAgICAgICAgIGJyb2tlbiBrZXk6ICN7ay5ib2xkLnllbGxvd31cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0IDFcbiAgICAgICAgXG4gICAgICAgIGlmIHZbJz0nXT8gdGhlbiByZXN1bHRba10gPSB2Wyc9J11cbiAgICAgICAgXG4gICAgICAgIHNodCA9IHZbJy0nXT8gYW5kIHZbJy0nXSBvciBrWzBdXG4gICAgICAgIFxuICAgICAgICBpZiBrICE9IGsudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZ1tuYW1lXVtrXVxuICAgICAgICAgICAgayA9IGsudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgY29uZmlnW25hbWVdW2tdID0gdlxuICAgICAgICAgICAgXG4gICAgICAgIGlmICcqJyBpbiBPYmplY3Qua2V5cyB2XG4gICAgICAgICAgICBwYXJhbSA9IGtcbiAgICAgICAgZWxzZSBpZiAnKionIGluIE9iamVjdC5rZXlzIHZcbiAgICAgICAgICAgIHBhcmFtID0ga1xuICAgICAgICAgICAgcGFyYW1MaXN0ID0gdHJ1ZVxuICAgICAgICAgICAgcmVzdWx0W3BhcmFtXSA9IFtdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNob3J0W3NodF0gPSBrXG4gICAgICAgICAgICBoZWxwW3NodF0gPSB2Wyc/J11cblxuICAgICMjI1xuICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwXG4gICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwIFxuICAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwXG4gICAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMCBcbiAgICAjIyNcbiAgICBcbiAgICBvcHRpb25zVGV4dCA9IFwiXCJcbiAgICBcbiAgICBtYXhBcmdMZW5ndGggPSAwXG4gICAgbWF4SGVscExlbmd0aCA9IDBcbiAgICBmb3Igc2h0LGxuZyBvZiBzaG9ydFxuICAgICAgICBpZiBoZWxwW3NodF0/XG4gICAgICAgICAgICBtYXhBcmdMZW5ndGggID0gTWF0aC5tYXgobWF4QXJnTGVuZ3RoLCBzaHQubGVuZ3RoK2xuZy5sZW5ndGgpXG4gICAgICAgICAgICBtYXhIZWxwTGVuZ3RoID0gTWF0aC5tYXgobWF4SGVscExlbmd0aCwgaGVscFtzaHRdLnN0cmlwLmxlbmd0aClcbiAgICAgICAgICAgIFxuICAgIGZvciBzaHQsbG5nIG9mIHNob3J0XG4gICAgICAgIGlmIGhlbHBbc2h0XT9cbiAgICAgICAgICAgIGRmID0gc3dpdGNoIHJlc3VsdFtsbmddXG4gICAgICAgICAgICAgICAgd2hlbiBmYWxzZSB0aGVuICfinJgnLnJlZC5kaW1cbiAgICAgICAgICAgICAgICB3aGVuIHRydWUgIHRoZW4gJ+KclCcuZ3JlZW4uYm9sZFxuICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0W2xuZ11cbiAgICAgICAgICAgIG9wdGlvbnNUZXh0ICs9ICdcXG4nXG4gICAgICAgICAgICBvcHRpb25zVGV4dCArPSBcIiAgICAjeyctJy5ncmF5fSN7c30jeycsIC0tJy5ncmF5fSN7bG5nfVwiXG4gICAgICAgICAgICBvcHRpb25zVGV4dCArPSBcIiAgICAje3BhZEVuZCAnJywgTWF0aC5tYXgoMCxtYXhBcmdMZW5ndGgtc2h0Lmxlbmd0aC1sbmcubGVuZ3RoKX0gI3toZWxwW3NodF19XCIuZ3JheS5ib2xkXG4gICAgICAgICAgICBvcHRpb25zVGV4dCArPSBcIiAgICAje3BhZEVuZCAnJywgTWF0aC5tYXgoMCxtYXhIZWxwTGVuZ3RoLWhlbHBbc2h0XS5zdHJpcC5sZW5ndGgpfSAje2RmfVwiLm1hZ2VudGEgaWYgZGY/XG5cbiAgICAjIyNcbiAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAwMDBcbiAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICBcbiAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAgICAgICBcbiAgICAjIyNcbiAgICBcbiAgICBoZWxwVGV4dCAgPSBcIlxcbiN7J3VzYWdlOicuZ3JheX0gICN7bi5ib2xkfSBcIlxuICAgIGhlbHBUZXh0ICs9IFwiI3snWycuZ3JheX0jeydvcHRpb25zJy5ib2xkLmdyYXl9I3snXScuZ3JheX0gXCIgaWYgMSA8IHNpemUgc2hvcnRcbiAgICBoZWxwVGV4dCArPSBcIiN7J1snLmdyYXl9I3twLmJvbGQueWVsbG93fSN7bCBhbmQgKCcgLi4uIF0nLmdyYXkpIG9yICgnXScuZ3JheSl9XCJcbiAgICBoZWxwVGV4dCArPSAnXFxuJ1xuICAgIGlmIGNvbmZpZ1tuYW1lXVtwYXJhbV0/Wyc/J11cbiAgICAgICAgaGVscFRleHQgKz0gXCJcXG4je3BhZEVuZCAnICAgICAgICAnK3AsIG1heEFyZ0xlbmd0aCs5fSAje2NvbmZpZ1tuYW1lXVtwYXJhbV1bJz8nXS5ncmF5fVwiLnllbGxvdy5ib2xkXG4gICAgICAgIGhlbHBUZXh0ICs9IFwiICAje3BhZEVuZCAnJywgTWF0aC5tYXgoMCxtYXhIZWxwTGVuZ3RoLWNvbmZpZ1tuYW1lXVtwYXJhbV1bJz8nXS5zdHJpcC5sZW5ndGgpfSAje2NvbmZpZ1tuYW1lXVtwYXJhbV1bJz0nXX1cIi5tYWdlbnRhIGlmIGNvbmZpZ1tuYW1lXVtwYXJhbV1bJz0nXT8gYW5kIG5vdCBsXG4gICAgICAgIGhlbHBUZXh0ICs9ICdcXG4nXG4gICAgICAgICAgICBcbiAgICBpZiBvcHRpb25zVGV4dC5sZW5ndGhcbiAgICAgICAgaGVscFRleHQgKz0gXCJcXG5vcHRpb25zOlxcblwiLmdyYXlcbiAgICAgICAgaGVscFRleHQgKz0gb3B0aW9uc1RleHRcbiAgICAgICAgaGVscFRleHQgKz0gJ1xcblxcbidcbiAgICBcbiAgICBzaG9ydFsnaCddID0gJ2hlbHAnXG4gICAgXG4gICAgaWYgY29uZmlnLnZlcnNpb24/XG4gICAgICAgIHZlcnNpb24gPSBjb25maWcudmVyc2lvblxuICAgICAgICBkZWxldGUgY29uZmlnLnZlcnNpb25cbiAgICAgICAgc2hvcnRbJ1YnXSA9ICd2ZXJzaW9uJ1xuICAgICAgICBcbiAgICBkZWxldGUgY29uZmlnW25hbWVdXG4gICAgaWYgbm90IGlzRW1wdHkgY29uZmlnXG4gICAgICAgIGhlbHBUZXh0ICs9IG5vb24uc3RyaW5naWZ5IGNvbmZpZywgXG4gICAgICAgICAgICBtYXhhbGlnbjogMTZcbiAgICAgICAgICAgIGNvbG9yczogXG4gICAgICAgICAgICAgICAga2V5OiAgICAgY29sb3JzLmdyYXlcbiAgICAgICAgICAgICAgICBzdHJpbmc6ICBjb2xvcnMud2hpdGVcbiAgICAgICAgaGVscFRleHQgKz0gJ1xcbidcbiAgICAgICAgXG4gICAgIyMjXG4gICAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAwXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgXG4gICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgXG4gICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgIyMjXG5cbiAgICBvcHRpb25zLmlnbm9yZUFyZ3MgPz0gMlxuICAgIGV4cGFuZGVkQXJncyA9IGV4cGFuZCBwcm9jZXNzLmFyZ3Yuc2xpY2Ugb3B0aW9ucy5pZ25vcmVBcmdzXG4gICAgXG4gICAgd2hpbGUgYXJnID0gZXhwYW5kZWRBcmdzLnNoaWZ0KClcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBhcmcuc3Vic3RyKDAsMikgPT0gJy0tJ1xuICAgICAgICAgICAgYXJnID0gYXJnLnN1YnN0ciAyXG4gICAgICAgIGVsc2UgaWYgYXJnWzBdID09ICctJ1xuICAgICAgICAgICAgYXJnID0gc2hvcnRbYXJnLnN1YnN0ciAxXVxuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgaWYgcGFyYW1MaXN0XG4gICAgICAgICAgICAgICAgcmVzdWx0W3BhcmFtXS5wdXNoIGFyZ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc3VsdFtwYXJhbV0gPSBhcmdcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgYXJnID09ICdoZWxwJ1xuICAgICAgICAgICAgbG9nIGhlbHBUZXh0XG4gICAgICAgICAgICByZXR1cm4gaWYgb3B0aW9ucy5kb250RXhpdFxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KClcbiAgICAgICAgZWxzZSBpZiBhcmcgPT0gJ3ZlcnNpb24nIGFuZCB2ZXJzaW9uP1xuICAgICAgICAgICAgbG9nIHZlcnNpb25cbiAgICAgICAgICAgIHJldHVybiBpZiBvcHRpb25zLmRvbnRFeGl0XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIHJlc3VsdFthcmddID09IGZhbHNlIG9yIHJlc3VsdFthcmddID09IHRydWVcbiAgICAgICAgICAgIHJlc3VsdFthcmddID0gbm90IHJlc3VsdFthcmddXG4gICAgICAgIGVsc2UgaWYgbm90IGlzTmFOIHBhcnNlSW50IHJlc3VsdFthcmddXG4gICAgICAgICAgICByZXN1bHRbYXJnXSA9IHBhcnNlSW50IGEuc2hpZnQoKVxuICAgICAgICBlbHNlIGlmIGFyZyBpbiB2YWx1ZXMgc2hvcnRcbiAgICAgICAgICAgIHJlc3VsdFthcmddID0gYS5zaGlmdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHBhcmFtTGlzdFxuICAgICAgICAgICAgICAgIHJlc3VsdFtwYXJhbV0ucHVzaCBhcmdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXN1bHRbcGFyYW1dID0gYXJnXG4gICAgcmVzdWx0XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VcbiJdfQ==
//# sourceURL=C:/Users/kodi/s/karg/coffee/karg.coffee