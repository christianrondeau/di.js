/*global window*/

(function () {
    "use strict";

    var model = (function (window) {
        var self = {};

        self.createPerson = function (name) {
            var person = {};

            // Dependencies
            person.talking = undefined;
            person.log = undefined;

            person.say = function (bleh) {
                person.log.debug((name || "Unidentified person") + " is now saying '" + bleh + "'");
                person.talking.send(bleh);
            };

            return person;
        };

        return self;
    }());

    window.sample = window.sample || {};
    window.sample.model = model;
}(window));