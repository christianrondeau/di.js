(function (window, alert) {
    var createAlertTalking = function() {
        var self = {};

        self.send = function(value) {
            alert(value);
        };

        return self;
    };

    window.sample = window.sample || {};
    window.sample.createAlertTalking = createAlertTalking;
})(window, alert);