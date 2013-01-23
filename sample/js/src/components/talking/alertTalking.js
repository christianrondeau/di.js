/*global window, alert*/

(function (window, alert) {
    "use strict";

    var createAlertTalking = function () {
        var self = {};

        self.send = function (value) {
            alert(value);
        };

        return self;
    };

    window.sample = window.sample || {};
    window.sample.createAlertTalking = createAlertTalking;
}(window, alert));