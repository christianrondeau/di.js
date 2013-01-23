/*global window*/

(function () {
    "use strict";

    var model = (function (window) {
        var self = {};

        self.createPerson = function (name) {
            var person = {};

            // Dependencies
            person.talking = {
                di: "auto",
                send: function () { throw new Error("person.talking not set"); }
            }; ;
            person.log = {
                di: "auto",
                debug: function () { throw new Error("person.log not set"); }
            };

            person.say = function (bleh) {
                person.log.debug((name || "Unidentified person") + " is now saying '" + bleh + "'");
                person.talking.send(bleh);
            };

            return person;
        };

        return self;
    } ());

    window.sample = window.sample || {};
    window.sample.model = model;
} (window));