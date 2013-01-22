(function (window, console) {
    var createConsoleLog = function () {
        var self = {};

        var counter = 0;

        self.debug = function (text) {
            if (console && console.log) {
                console.log((++counter) + ": " + text);
            }
        };

        return self;
    };

    window.sample = window.sample || {};
    window.sample.createConsoleLog = createConsoleLog;
})(window, console);