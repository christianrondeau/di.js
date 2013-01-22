// The "main" object
var main = (function () {
    var self = {};

    self.createPerson = function () {
        var person = {};

        person.output = undefined;

        person.say = function (bleh) {
            person.output.send(bleh);
        };

        return person;
    };

    return self;
})();