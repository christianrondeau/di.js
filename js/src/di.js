var di = (function () {
    var self = {};

    self.create = function () {
        var o = {};

        var mappings = {};

        o.inject = function (target) {
            for (var propName in target) {
                var propValue = target[propName];
                var propType = typeof propValue;

                if (propType === "function")
                    continue;

                if (propType === "undefined") {
                    var mapValue = mappings[propName];
                    var mapType = typeof mapValue;

                    if (mapType === "function")
                        target[propName] = mapValue();

                    if (mapType === "object" && mapValue !== null)
                        target[propName] = mapValue;
                }
            }

            return target;
        };

        o.set = function(name, mapping) {
            mappings[name] = mapping;
        };

        return o;
    };

    return self;
})();