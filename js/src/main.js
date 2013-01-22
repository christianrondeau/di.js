/// <reference path="di.js" />

var main = (function () {
    var self = {};

    var _kernel = di.create();

    self.kernel = _kernel;

    self.createPerson = function () {
        var person = {};

        person.output = function () {
            console.log("No output defined");
        };

        person.say = function (bleh) {
            alert(bleh);
        };

        return person;
    };

    return self;
})();

var createAlertOutput = (function(){
    var self = {};

    self.send = function(value) {
        alert(value);
    };

    return self;
})();

main.kernel.set("person", {
    output: createAlertOutput
});

var person = main.kernel.inject("person", main.createPerson());

person.say("Hello World!");