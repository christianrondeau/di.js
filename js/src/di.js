var di = (function () {
    var self = {};

    self.create = function () {
        var o = {};

        var mappings = {};

        o.inject = function (name, target) {
            var mapping = mappings[name];

            if (typeof mapping === "undefined")
                return target;

            for (var mappedProperty in mapping) {
                var mappedValue = mapping[mappedProperty];
                var mappingType = typeof mappedValue;

                if (mappingType === "function")
                    target[mappedProperty] = mappedValue();

                if (mappingType === "object" && mapping !== null)
                    target[mappedProperty] = mappedValue;
            }

            return target;
        }

        o.set = function (name, mapping) {
            mappings[name] = mapping;
        }

        return o;
    };

    return self;
})();