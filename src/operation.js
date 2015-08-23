(function() {
    var utils = require("./utils");

    var id = function(x){return x;};
    var constantly = function(x){return function(){return x;};};

    var Operation = function(mw){
        mw = mw || id;

        var asOperation = function(h){
            return function(args){
              return h(mw(args));
            }
        };
        asOperation.and = function(nmw){
            return Operation(function(args){
                return nmw(mw(args)); 
            }); 
        }

        asOperation.end = function(h){
          return asOperation(h);
        }

        return asOperation;
    };

    var Start = Operation();

    var Attribute = function(attr, fn){
            return function(args) {
                args[attr] = fn(args);
                return args;
            }
    };

    var Method = function(method){
        return Attribute('method', constantly(method));
    };

    var buildPathPart = function(pth, args){
        var k = null;
        switch (utils.type(pth)) {
            case 'string':
                k = pth.indexOf(":") == 0 ? args[pth.substring(1)] : pth;
                break;
            case 'function':
                k = pth(args);
                break;
                defalut: k = pth;
        }
        if(k==null || k === undefined){ throw new Error("Parameter "+pth+" is required: " + JSON.stringify(args)); }
        return k;
    };

    // path chaining function
    // which return haldler wrapper: (h, cfg)->(args -> promise)
    // it's chainable Path("baseUrl").slash(":type").slash(":id").slash("_history")(id, {})({id: 5, type: 'Patient'})
    // and composable p0 = Path("baseUrl); p1 = p0.slash("path)
    var Path = function(tkn, chain){
        //Chainable
        var new_chain = function(args){
            return ((chain && (chain(args) + "/")) || "") +  buildPathPart(tkn, args);
        };
        var ch = Attribute('url', new_chain);
        ch.slash = function(tkn){
            return Path(tkn, new_chain);
        };
        return ch;
    };


    exports.Start = Start;
    exports.Path = Path;
    exports.Operation = Operation;
    exports.Attribute = Attribute;
    exports.Method = Method;
}).call(this);
