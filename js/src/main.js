var di = (function () {
    var self = {};

    self.create = function () {
        var o = {};

        var mappings = {};

        o.get = function (name) {
            var mapping = mappings[name];
            var mappingType = typeof mapping;

            if (mappingType === "function")
                return mapping();

            if (mappingType === "object" && mapping !== null)
                return mapping;

            return undefined;
        }

        o.set = function (name, instance) {
            mappings[name] = instance;
        }

        return o;
    };

    return self;
})();