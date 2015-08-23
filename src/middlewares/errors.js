module.exports = function(args){
        try{
            return args;
        }catch(e){
            if(args.debug){
               console.log("\nDEBUG: (ERROR in middleware)");
               console.log(e.message);
               console.log(e.stack);
            }
            if(!args.defer) {throw new Error("I need adapter.defer");}
            var deff = args.defer();
            deff.reject(e);
            return deff.promise;
        }
};
