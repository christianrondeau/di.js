/*global window*/

(function (window) {
    "use strict";

    var createSimpleDomTalking = function (el) {
        var self = {};

        // Dependencies
        self.log = undefined;

        self.send = function (value) {
            if (typeof el["innerText"] === "undefined")
                throw new Error("Element does not have innerText property");

            el.innerText = value;
            self.log.debug("Wrote '" + value + "' into element " + el.id);
        };

        return self;
    };

    window.sample = window.sample || {};
    window.sample.createSimpleDomTalking = createSimpleDomTalking;
}(window));