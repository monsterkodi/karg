// koffee 1.14.0

/*
000   000   0000000   00000000    0000000 
000  000   000   000  000   000  000      
0000000    000000000  0000000    000  0000
000  000   000   000  000   000  000   000
000   000  000   000  000   000   0000000
 */
var error, expand, parse,
    indexOf = [].indexOf;

require('klor').kolor.globalize();


/*
00000000  000   000  00000000    0000000   000   000  0000000  
000        000 000   000   000  000   000  0000  000  000   000
0000000     00000    00000000   000000000  000 0 000  000   000
000        000 000   000        000   000  000  0000  000   000
00000000  000   000  000        000   000  000   000  0000000
 */

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


/*
00000000  00000000   00000000    0000000   00000000 
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000  
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
 */

error = function(msg) {
    var s;
    s = dim(red("[" + bold("ERROR") + "] "));
    s += red(msg.trim().split('\n').join("\n        "));
    return console.log(s);
};


/*
00000000    0000000   00000000    0000000  00000000
000   000  000   000  000   000  000       000     
00000000   000000000  0000000    0000000   0000000 
000        000   000  000   000       000  000     
000        000   000  000   000  0000000   00000000
 */

parse = function(config, options) {
    var addIgnored, addParam, addParamOrIgnore, arg, argv, df, expandedArgs, help, helpText, k, lng, maxArgLength, maxHelpLength, name, noon_parse, noon_stringify, optionsText, pad, param, paramList, ref, ref1, result, short, sht, v, version;
    if (options == null) {
        options = {};
    }
    pad = function(s, l) {
        s = String(s);
        while (s.length < l) {
            s += ' ';
        }
        return s;
    };
    if (typeof config === 'string') {
        noon_parse = require('noon/js/parse');
        config = noon_parse(config);
    } else {
        config = Object.assign({}, config);
    }
    name = Object.keys(config)[0];
    result = {};
    help = {};
    short = {};
    param = '';
    paramList = false;
    ref = config[name];
    for (k in ref) {
        v = ref[k];
        if (0 <= k.indexOf(' ')) {
            console.error("wrong karg setup: " + (bold("keys can't contain spaces!")) + "\nbroken key: " + (bold(yellow(k))));
            process.exit(1);
        }
        if (v['='] != null) {
            result[k] = v['='];
        }
        sht = (v['-'] != null) && v['-'] || k[0];
        if (Array.isArray(v)) {
            if (indexOf.call(v, '*') >= 0) {
                param = k;
            } else if (indexOf.call(v, '**') >= 0) {
                param = k;
                paramList = true;
                result[param] = [];
            } else {
                short[sht] = k;
            }
        } else {
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
    }

    /*
     0000000   00000000   000000000  000   0000000   000   000   0000000
    000   000  000   000     000     000  000   000  0000  000  000     
    000   000  00000000      000     000  000   000  000 0 000  0000000 
    000   000  000           000     000  000   000  000  0000       000
     0000000   000           000     000   0000000   000   000  0000000
     */
    optionsText = "";
    maxArgLength = 0;
    maxHelpLength = 0;
    for (sht in short) {
        lng = short[sht];
        if (help[sht] != null) {
            maxArgLength = Math.max(maxArgLength, sht.length + lng.length);
            maxHelpLength = Math.max(maxHelpLength, strip(help[sht]).length);
        }
    }
    for (sht in short) {
        lng = short[sht];
        if (help[sht] != null) {
            df = (function() {
                switch (result[lng]) {
                    case false:
                        return red(dim('✘'));
                    case true:
                        return green(bold('✔'));
                    default:
                        return result[lng];
                }
            })();
            optionsText += '\n';
            optionsText += "    " + (gray('-')) + sht + (gray(', --')) + lng;
            optionsText += gray(bold("    " + (pad('', Math.max(0, maxArgLength - sht.length - lng.length))) + " " + help[sht]));
            if (df != null) {
                optionsText += magenta("    " + (pad('', Math.max(0, maxHelpLength - strip(help[sht]).length))) + " " + df);
            }
        }
    }

    /*
    000   000  00000000  000      00000000 
    000   000  000       000      000   000
    000000000  0000000   000      00000000 
    000   000  000       000      000      
    000   000  00000000  0000000  000
     */
    helpText = "\n" + (gray('usage:')) + "  " + (bold(name)) + " ";
    if (1 < Object.keys(short)) {
        helpText += "" + (gray('[')) + (bold(gray('options'))) + (gray(']')) + " ";
    }
    helpText += "" + (gray('[')) + (bold(yellow(param))) + (paramList && gray(' ... ]') || gray(']'));
    helpText += '\n';
    if ((ref1 = config[name][param]) != null ? ref1['?'] : void 0) {
        helpText += yellow(bold("\n" + (pad('        ' + param, maxArgLength + 9)) + " " + (gray(config[name][param]['?']))));
        if ((config[name][param]['='] != null) && !paramList) {
            helpText += magenta("  " + (pad('', Math.max(0, maxHelpLength - strip(config[name][param]['?']).length))) + " " + config[name][param]['=']);
        }
        helpText += '\n';
    }
    if (optionsText.length) {
        helpText += gray("\noptions:\n");
        helpText += optionsText;
        helpText += '\n\n';
    }
    if (short['h'] != null) {
        short['h'];
    } else {
        short['h'] = 'help';
    }
    if (config.version != null) {
        version = config.version;
        delete config.version;
        if (short['V'] != null) {
            short['V'];
        } else {
            short['V'] = 'version';
        }
    }
    delete config[name];
    if (Object.keys(config).length) {
        noon_stringify = require('noon/js/stringify');
        helpText += noon_stringify(config, {
            maxalign: 16,
            colors: {
                key: gray,
                string: white
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
    if (options.ignoreArgs != null) {
        options.ignoreArgs;
    } else {
        options.ignoreArgs = 2;
    }
    if (options.argv) {
        argv = options.argv;
    } else {
        argv = process.argv.slice(options.ignoreArgs);
    }
    expandedArgs = expand(argv);
    addParam = function(arg) {
        if (paramList) {
            return result[param].push(arg);
        } else {
            return result[param] = arg;
        }
    };
    addIgnored = function(arg) {
        if (!result['__ignored']) {
            result['__ignored'] = [];
        }
        return result['__ignored'].push(arg);
    };
    addParamOrIgnore = function(arg) {
        if (param) {
            return addParam(arg);
        } else {
            return addIgnored(arg);
        }
    };
    while (arg = expandedArgs.shift()) {
        if (arg.substr(0, 2) === '--') {
            arg = arg.substr(2);
        } else if (arg[0] === '-') {
            if (!short[arg.substr(1)]) {
                addIgnored(arg);
                continue;
            }
            arg = short[arg.substr(1)];
        } else {
            addParamOrIgnore(arg);
            continue;
        }
        if (arg === 'help') {
            if (options.returnLog) {
                return helpText;
            }
            console.log(helpText);
            if (options.dontExit) {
                return;
            }
            process.exit();
        } else if (arg === 'version' && (version != null)) {
            if (options.returnLog) {
                return version;
            }
            console.log(version);
            if (options.dontExit) {
                return;
            }
            process.exit();
        }
        if (result[arg] === false || result[arg] === true) {
            result[arg] = !result[arg];
        } else if (!isNaN(Number(result[arg]))) {
            result[arg] = parseFloat(expandedArgs.shift());
        } else if (indexOf.call(Object.keys(short).map(function(k) {
            return short[k];
        }), arg) >= 0) {
            result[arg] = expandedArgs.shift();
        } else {
            addParamOrIgnore(arg);
        }
    }
    return result;
};

module.exports = parse;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyZy5qcyIsInNvdXJjZVJvb3QiOiIuLi9jb2ZmZWUiLCJzb3VyY2VzIjpbImthcmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLG9CQUFBO0lBQUE7O0FBUUEsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQUssQ0FBQyxTQUF0QixDQUFBOzs7QUFFQTs7Ozs7Ozs7QUFRQSxNQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ0wsUUFBQTtBQUFBLFNBQUEsbUNBQUE7O1FBQ0ksSUFBRyxLQUFBLEdBQVEsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FBbkIsQ0FBWDtZQUNJLENBQUEsR0FBSSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVCxDQUFlLEVBQWYsQ0FBa0IsQ0FBQyxHQUFuQixDQUF1QixTQUFDLENBQUQ7dUJBQU8sR0FBQSxHQUFJO1lBQVgsQ0FBdkI7WUFDSixDQUFDLENBQUMsT0FBRixDQUFVLENBQUMsQ0FBQyxPQUFGLENBQVUsS0FBSyxDQUFDLEtBQWhCLENBQVYsRUFBa0MsQ0FBbEM7WUFDQSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQVQsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0FBQ0EsbUJBQU8sTUFBQSxDQUFPLENBQVAsRUFKWDs7QUFESjtXQU1BO0FBUEs7OztBQVNUOzs7Ozs7OztBQVFBLEtBQUEsR0FBUSxTQUFDLEdBQUQ7QUFDSixRQUFBO0lBQUEsQ0FBQSxHQUFJLEdBQUEsQ0FBSSxHQUFBLENBQUksR0FBQSxHQUFNLElBQUEsQ0FBSyxPQUFMLENBQU4sR0FBc0IsSUFBMUIsQ0FBSjtJQUNKLENBQUEsSUFBSyxHQUFBLENBQUksR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFzQixDQUFDLElBQXZCLENBQTRCLFlBQTVCLENBQUo7V0FBNkMsT0FBQSxDQUNsRCxHQURrRCxDQUM5QyxDQUQ4QztBQUY5Qzs7O0FBS1I7Ozs7Ozs7O0FBY0EsS0FB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Q0FBQyxRQUFsQjtBQUFBLHVCQUFBOztZQUNBLE9BQU8sQ0FBQyxJQUFSLENBQUEsRUFKQzs7UUFNTCxJQUFHLE1BQU8sQ0FBQSxHQUFBLENBQVAsS0FBZSxLQUFmLElBQXdCLE1BQU8sQ0FBQSxHQUFBLENBQVAsS0FBZSxJQUExQztZQUNJLE1BQU8sQ0FBQSxHQUFBLENBQVAsR0FBYyxDQUFJLE1BQU8sQ0FBQSxHQUFBLEVBRDdCO1NBQUEsTUFFSyxJQUFHLENBQUksS0FBQSxDQUFNLE1BQUEsQ0FBTyxNQUFPLENBQUEsR0FBQSxDQUFkLENBQU4sQ0FBUDtZQUNELE1BQU8sQ0FBQSxHQUFBLENBQVAsR0FBYyxVQUFBLENBQVcsWUFBWSxDQUFDLEtBQWIsQ0FBQSxDQUFYLEVBRGI7U0FBQSxNQUVBLElBQUcsYUFBTyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosQ0FBa0IsQ0FBQyxHQUFuQixDQUF1QixTQUFDLENBQUQ7bUJBQU8sS0FBTSxDQUFBLENBQUE7UUFBYixDQUF2QixDQUFQLEVBQUEsR0FBQSxNQUFIO1lBQ0QsTUFBTyxDQUFBLEdBQUEsQ0FBUCxHQUFjLFlBQVksQ0FBQyxLQUFiLENBQUEsRUFEYjtTQUFBLE1BQUE7WUFHRCxnQkFBQSxDQUFpQixHQUFqQixFQUhDOztJQTVCVDtXQWdDQTtBQXpMSTs7QUEyTFIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwIFxuMDAwICAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgXG4wMDAwMDAwICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDBcbjAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4jIyNcblxucmVxdWlyZSgna2xvcicpLmtvbG9yLmdsb2JhbGl6ZSgpXG4gICAgXG4jIyNcbjAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuMDAwICAgICAgICAwMDAgMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4wMDAwMDAwICAgICAwMDAwMCAgICAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAgICAwMDBcbjAwMCAgICAgICAgMDAwIDAwMCAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgXG4jIyNcblxuZXhwYW5kID0gKGwpIC0+XG4gICAgZm9yIGEgaW4gbCBcbiAgICAgICAgaWYgbWF0Y2ggPSAvXlxcLShcXHdcXHcrKSQvLmV4ZWMgYVxuICAgICAgICAgICAgYSA9IG1hdGNoWzFdLnNwbGl0KCcnKS5tYXAgKGkpIC0+ICctJytpXG4gICAgICAgICAgICBhLnVuc2hpZnQgbC5pbmRleE9mKG1hdGNoLmlucHV0KSwgMVxuICAgICAgICAgICAgbC5zcGxpY2UuYXBwbHkgbCwgYVxuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZCBsXG4gICAgbFxuXG4jIyNcbjAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAwMDAwICBcbjAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbjAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiMjI1xuXG5lcnJvciA9IChtc2cpIC0+XG4gICAgcyA9IGRpbSByZWQgXCJbXCIgKyBib2xkKFwiRVJST1JcIikgKyBcIl0gXCJcbiAgICBzICs9IHJlZCBtc2cudHJpbSgpLnNwbGl0KCdcXG4nKS5qb2luKFwiXFxuICAgICAgICBcIilcbiAgICBsb2cgc1xuXG4jIyNcbjAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMFxuMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgXG4wMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCBcbjAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgMDAwICAwMDAgICAgIFxuMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwXG4jIyNcblxuIyBvcHRpb25zOiBcbiMgICAgIGlnbm9yZUFyZ3M6ICBudW1iZXIgb2YgbGVhZGluZyBwcm9jZXNzLmFyZ3YgaXRlbXMgdG8gaWdub3JlIChkZWZhdWx0PTIpXG4jICAgICBhcmd2OiAgICAgICAgbGlzdCBvZiBzdHJpbmcgYXJndW1lbnRzIHRvIHVzZSBpbnN0ZWFkIG9mIHByb2Nlc3MuYXJndlxuIyAgICAgZG9udEV4aXQ6ICAgIGRvbid0IGV4aXQgcHJvY2VzcyBvbiAtVi8tLXZlcnNpb24gb3IgLWgvLS1oZWxwICAocmV0dXJucyB1bmRlZmluZWQgaW5zdGVhZClcbiMgICAgIHJldHVybkxvZzogICBoZWxwL3ZlcnNpb24gb3V0cHV0IGlzIHJldHVybmVkIGluc3RlYWQgb2YgbG9nZ2VkIChpbXBsaWVzIGRvbnRFeGl0KVxuXG5wYXJzZSA9IChjb25maWcsIG9wdGlvbnM9e30pIC0+XG4gICAgXG4gICAgcGFkID0gKHMsIGwpIC0+XG4gICAgICAgIHMgPSBTdHJpbmcgc1xuICAgICAgICB3aGlsZSBzLmxlbmd0aCA8IGwgdGhlbiBzICs9ICcgJ1xuICAgICAgICBzXG4gICAgXG4gICAgaWYgdHlwZW9mKGNvbmZpZykgPT0gJ3N0cmluZydcbiAgICAgICAgbm9vbl9wYXJzZSA9IHJlcXVpcmUgJ25vb24vanMvcGFyc2UnXG4gICAgICAgIGNvbmZpZyA9IG5vb25fcGFyc2UgY29uZmlnXG4gICAgZWxzZVxuICAgICAgICBjb25maWcgPSBPYmplY3QuYXNzaWduIHt9LCBjb25maWdcbiAgICAgICAgICAgIFxuICAgIG5hbWUgICA9IE9iamVjdC5rZXlzKGNvbmZpZylbMF0gIyB0aGUgYXBwbGljYXRpb24vc2NyaXB0IG5hbWVcbiAgICByZXN1bHQgPSB7fSAjIHRoZSBvYmplY3QgY3JlYXRlZCBmcm9tIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYW5kIHRoZSBjb25maWd1cmF0aW9uXG4gICAgaGVscCAgID0ge30gIyBtYXBzIHNob3J0Y3V0IGtleXMgdG8gaGVscCB0ZXh0c1xuICAgIHNob3J0ICA9IHt9ICMgbWFwcyBzaG9ydGN1dCBrZXlzIHRvIGxvbmcga2V5IG5hbWVzXG4gICAgcGFyYW0gID0gJycgIyBuYW1lIG9mIG5vbi1vcHRpb24gcGFyYW1ldGVyc1xuICAgIHBhcmFtTGlzdCA9IGZhbHNlXG4gICAgXG4gICAgZm9yIGssdiBvZiBjb25maWdbbmFtZV1cbiAgICAgICAgXG4gICAgICAgIGlmIDAgPD0gay5pbmRleE9mICcgJ1xuICAgICAgICAgICAgZXJyb3IgXCJcIlwiXG4gICAgICAgICAgICB3cm9uZyBrYXJnIHNldHVwOiAje2JvbGQgXCJrZXlzIGNhbid0IGNvbnRhaW4gc3BhY2VzIVwifVxuICAgICAgICAgICAgYnJva2VuIGtleTogI3tib2xkIHllbGxvdyBrfVxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQgMVxuICAgICAgICBcbiAgICAgICAgaWYgdlsnPSddPyB0aGVuIHJlc3VsdFtrXSA9IHZbJz0nXVxuICAgICAgICBcbiAgICAgICAgc2h0ID0gdlsnLSddPyBhbmQgdlsnLSddIG9yIGtbMF1cbiAgICAgICAgXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkgdlxuICAgICAgICAgICAgaWYgJyonIGluIHZcbiAgICAgICAgICAgICAgICBwYXJhbSA9IGtcbiAgICAgICAgICAgIGVsc2UgaWYgJyoqJyBpbiB2XG4gICAgICAgICAgICAgICAgcGFyYW0gPSBrXG4gICAgICAgICAgICAgICAgcGFyYW1MaXN0ID0gdHJ1ZVxuICAgICAgICAgICAgICAgIHJlc3VsdFtwYXJhbV0gPSBbXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNob3J0W3NodF0gPSBrXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmICcqJyBpbiBPYmplY3Qua2V5cyB2XG4gICAgICAgICAgICAgICAgcGFyYW0gPSBrXG4gICAgICAgICAgICBlbHNlIGlmICcqKicgaW4gT2JqZWN0LmtleXMgdlxuICAgICAgICAgICAgICAgIHBhcmFtID0ga1xuICAgICAgICAgICAgICAgIHBhcmFtTGlzdCA9IHRydWVcbiAgICAgICAgICAgICAgICByZXN1bHRbcGFyYW1dID0gW11cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzaG9ydFtzaHRdID0ga1xuICAgICAgICAgICAgICAgIGhlbHBbc2h0XSA9IHZbJz8nXVxuXG4gICAgIyMjXG4gICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDBcbiAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgIFxuICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgICAgICAwMDBcbiAgICAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwIFxuICAgICMjI1xuICAgIFxuICAgIG9wdGlvbnNUZXh0ID0gXCJcIlxuICAgICAgICBcbiAgICBtYXhBcmdMZW5ndGggPSAwXG4gICAgbWF4SGVscExlbmd0aCA9IDBcbiAgICBmb3Igc2h0LGxuZyBvZiBzaG9ydFxuICAgICAgICBpZiBoZWxwW3NodF0/XG4gICAgICAgICAgICBtYXhBcmdMZW5ndGggID0gTWF0aC5tYXgobWF4QXJnTGVuZ3RoLCBzaHQubGVuZ3RoK2xuZy5sZW5ndGgpXG4gICAgICAgICAgICBtYXhIZWxwTGVuZ3RoID0gTWF0aC5tYXgobWF4SGVscExlbmd0aCwgc3RyaXAoaGVscFtzaHRdKS5sZW5ndGgpXG4gICAgICAgICAgICBcbiAgICBmb3Igc2h0LGxuZyBvZiBzaG9ydFxuICAgICAgICBpZiBoZWxwW3NodF0/XG4gICAgICAgICAgICBkZiA9IHN3aXRjaCByZXN1bHRbbG5nXVxuICAgICAgICAgICAgICAgIHdoZW4gZmFsc2UgdGhlbiByZWQgZGltICfinJgnXG4gICAgICAgICAgICAgICAgd2hlbiB0cnVlICB0aGVuIGdyZWVuIGJvbGQgJ+KclCdcbiAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdFtsbmddXG4gICAgICAgICAgICBvcHRpb25zVGV4dCArPSAnXFxuJ1xuICAgICAgICAgICAgb3B0aW9uc1RleHQgKz0gXCIgICAgI3tncmF5ICctJ30je3NodH0je2dyYXkgJywgLS0nfSN7bG5nfVwiXG4gICAgICAgICAgICBvcHRpb25zVGV4dCArPSBncmF5IGJvbGQgXCIgICAgI3twYWQgJycsIE1hdGgubWF4KDAsbWF4QXJnTGVuZ3RoLXNodC5sZW5ndGgtbG5nLmxlbmd0aCl9ICN7aGVscFtzaHRdfVwiXG4gICAgICAgICAgICBvcHRpb25zVGV4dCArPSBtYWdlbnRhIFwiICAgICN7cGFkICcnLCBNYXRoLm1heCgwLG1heEhlbHBMZW5ndGgtc3RyaXAoaGVscFtzaHRdKS5sZW5ndGgpfSAje2RmfVwiIGlmIGRmP1xuXG4gICAgIyMjXG4gICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgMDAwXG4gICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgXG4gICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwICAgICAgXG4gICAgIyMjXG4gICAgXG4gICAgaGVscFRleHQgID0gXCJcXG4je2dyYXkgJ3VzYWdlOid9ICAje2JvbGQgbmFtZX0gXCJcbiAgICBoZWxwVGV4dCArPSBcIiN7Z3JheSAnWyd9I3tib2xkIGdyYXkgJ29wdGlvbnMnfSN7Z3JheSAnXSd9IFwiIGlmIDEgPCBPYmplY3Qua2V5cyhzaG9ydClcbiAgICBoZWxwVGV4dCArPSBcIiN7Z3JheSAnWyd9I3tib2xkIHllbGxvdyBwYXJhbX0je3BhcmFtTGlzdCBhbmQgZ3JheSgnIC4uLiBdJykgb3IgZ3JheSgnXScpfVwiXG4gICAgaGVscFRleHQgKz0gJ1xcbidcbiAgICBpZiBjb25maWdbbmFtZV1bcGFyYW1dP1snPyddXG4gICAgICAgIGhlbHBUZXh0ICs9IHllbGxvdyBib2xkIFwiXFxuI3twYWQgJyAgICAgICAgJytwYXJhbSwgbWF4QXJnTGVuZ3RoKzl9ICN7Z3JheSBjb25maWdbbmFtZV1bcGFyYW1dWyc/J119XCJcbiAgICAgICAgaGVscFRleHQgKz0gbWFnZW50YShcIiAgI3twYWQgJycsIE1hdGgubWF4KDAsbWF4SGVscExlbmd0aC1zdHJpcChjb25maWdbbmFtZV1bcGFyYW1dWyc/J10pLmxlbmd0aCl9ICN7Y29uZmlnW25hbWVdW3BhcmFtXVsnPSddfVwiKSBpZiBjb25maWdbbmFtZV1bcGFyYW1dWyc9J10/IGFuZCBub3QgcGFyYW1MaXN0XG4gICAgICAgIGhlbHBUZXh0ICs9ICdcXG4nXG4gICAgICAgICAgICBcbiAgICBpZiBvcHRpb25zVGV4dC5sZW5ndGhcbiAgICAgICAgaGVscFRleHQgKz0gZ3JheSBcIlxcbm9wdGlvbnM6XFxuXCJcbiAgICAgICAgaGVscFRleHQgKz0gb3B0aW9uc1RleHRcbiAgICAgICAgaGVscFRleHQgKz0gJ1xcblxcbidcbiAgICBcbiAgICBzaG9ydFsnaCddID89ICdoZWxwJ1xuICAgIFxuICAgIGlmIGNvbmZpZy52ZXJzaW9uP1xuICAgICAgICB2ZXJzaW9uID0gY29uZmlnLnZlcnNpb25cbiAgICAgICAgZGVsZXRlIGNvbmZpZy52ZXJzaW9uXG4gICAgICAgIHNob3J0WydWJ10gPz0gJ3ZlcnNpb24nXG4gICAgICAgIFxuICAgIGRlbGV0ZSBjb25maWdbbmFtZV1cbiAgICBpZiBPYmplY3Qua2V5cyhjb25maWcpLmxlbmd0aCBcbiAgICAgICAgbm9vbl9zdHJpbmdpZnkgPSByZXF1aXJlICdub29uL2pzL3N0cmluZ2lmeSdcbiAgICAgICAgaGVscFRleHQgKz0gbm9vbl9zdHJpbmdpZnkgY29uZmlnLCBcbiAgICAgICAgICAgIG1heGFsaWduOiAxNlxuICAgICAgICAgICAgY29sb3JzOiBcbiAgICAgICAgICAgICAgICBrZXk6ICAgICBncmF5XG4gICAgICAgICAgICAgICAgc3RyaW5nOiAgd2hpdGVcbiAgICAgICAgaGVscFRleHQgKz0gJ1xcbidcbiAgICAgICAgXG4gICAgIyMjXG4gICAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwMDAwMDAwXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgXG4gICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgXG4gICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgXG4gICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgIyMjXG5cbiAgICBvcHRpb25zLmlnbm9yZUFyZ3MgPz0gMlxuICAgIFxuICAgIGlmIG9wdGlvbnMuYXJndlxuICAgICAgICBhcmd2ID0gb3B0aW9ucy5hcmd2XG4gICAgZWxzZVxuICAgICAgICBhcmd2ID0gcHJvY2Vzcy5hcmd2LnNsaWNlIG9wdGlvbnMuaWdub3JlQXJnc1xuICAgICAgICBcbiAgICBleHBhbmRlZEFyZ3MgPSBleHBhbmQgYXJndlxuXG4gICAgYWRkUGFyYW0gPSAoYXJnKSAtPlxuICAgICAgICBpZiBwYXJhbUxpc3RcbiAgICAgICAgICAgIHJlc3VsdFtwYXJhbV0ucHVzaCBhcmdcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzdWx0W3BhcmFtXSA9IGFyZ1xuICAgICAgICAgICAgXG4gICAgYWRkSWdub3JlZCA9IChhcmcpIC0+XG4gICAgICAgIGlmIG5vdCByZXN1bHRbJ19faWdub3JlZCddIHRoZW4gcmVzdWx0WydfX2lnbm9yZWQnXSA9IFtdXG4gICAgICAgIHJlc3VsdFsnX19pZ25vcmVkJ10ucHVzaCBhcmdcbiAgICAgICAgXG4gICAgYWRkUGFyYW1Pcklnbm9yZSA9IChhcmcpIC0+XG4gICAgICAgIGlmIHBhcmFtXG4gICAgICAgICAgICBhZGRQYXJhbSBhcmdcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYWRkSWdub3JlZCBhcmdcbiAgICBcbiAgICB3aGlsZSBhcmcgPSBleHBhbmRlZEFyZ3Muc2hpZnQoKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGFyZy5zdWJzdHIoMCwyKSA9PSAnLS0nXG4gICAgICAgICAgICBhcmcgPSBhcmcuc3Vic3RyIDJcbiAgICAgICAgZWxzZSBpZiBhcmdbMF0gPT0gJy0nXG4gICAgICAgICAgICBpZiBub3Qgc2hvcnRbYXJnLnN1YnN0ciAxXVxuICAgICAgICAgICAgICAgIGFkZElnbm9yZWQgYXJnXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIGFyZyA9IHNob3J0W2FyZy5zdWJzdHIgMV1cbiAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIGFkZFBhcmFtT3JJZ25vcmUgYXJnXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGFyZyA9PSAnaGVscCdcbiAgICAgICAgICAgIGlmIG9wdGlvbnMucmV0dXJuTG9nIHRoZW4gcmV0dXJuIGhlbHBUZXh0XG4gICAgICAgICAgICBsb2cgaGVscFRleHRcbiAgICAgICAgICAgIHJldHVybiBpZiBvcHRpb25zLmRvbnRFeGl0XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoKVxuICAgICAgICBlbHNlIGlmIGFyZyA9PSAndmVyc2lvbicgYW5kIHZlcnNpb24/XG4gICAgICAgICAgICBpZiBvcHRpb25zLnJldHVybkxvZyB0aGVuIHJldHVybiB2ZXJzaW9uXG4gICAgICAgICAgICBsb2cgdmVyc2lvblxuICAgICAgICAgICAgcmV0dXJuIGlmIG9wdGlvbnMuZG9udEV4aXRcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgcmVzdWx0W2FyZ10gPT0gZmFsc2Ugb3IgcmVzdWx0W2FyZ10gPT0gdHJ1ZVxuICAgICAgICAgICAgcmVzdWx0W2FyZ10gPSBub3QgcmVzdWx0W2FyZ11cbiAgICAgICAgZWxzZSBpZiBub3QgaXNOYU4gTnVtYmVyIHJlc3VsdFthcmddXG4gICAgICAgICAgICByZXN1bHRbYXJnXSA9IHBhcnNlRmxvYXQgZXhwYW5kZWRBcmdzLnNoaWZ0KClcbiAgICAgICAgZWxzZSBpZiBhcmcgaW4gT2JqZWN0LmtleXMoc2hvcnQpLm1hcCgoaykgLT4gc2hvcnRba10pXG4gICAgICAgICAgICByZXN1bHRbYXJnXSA9IGV4cGFuZGVkQXJncy5zaGlmdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFkZFBhcmFtT3JJZ25vcmUgYXJnXG4gICAgcmVzdWx0XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VcbiJdfQ==
//# sourceURL=../coffee/karg.coffee