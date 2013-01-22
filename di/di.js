(function (window) {
    var di = (function () {
        var self = {};

        /// @private createInjector
        var createInjector = function () {
            var injector = {};

            var injected = {};

            injector.injectInto = function (target, mappings) {
                for (var propName in target) {
                    var propValue = target[propName];
                    var propType = typeof propValue;

                    if (propType === "function")
                        continue;

                    if (propType === "undefined") {
                        var mapValue = mappings[propName];
                        var mapType = typeof mapValue;

                        var toInject = injected[propName];

                        if (typeof toInject === "undefined") {
                            if (mapType === "function")
                                toInject = mapValue();
                            else if (mapType === "object" && mapValue !== null)
                                toInject = mapValue;

                            injected[propName] = toInject;

                            if (typeof toInject === "object" && toInject !== null)
                                injector.injectInto(toInject, mappings);
                        }

                        target[propName] = toInject;
                    }
                }
            };

            return injector;
        };

        /// @public createKernel
        self.createKernel = function () {
            var o = {};

            var mappings = {};

            o.inject = function (target) {
                var injector = createInjector();

                injector.injectInto(target, mappings);

                return target;
            };

            o.set = function (name, mapping) {
                mappings[name] = mapping;
            };

            return o;
        };

        return self;
    })();

    window.di = di;
})(window);