/*global window*/

(function (window) {
    "use strict";

    var di = (function () {
        var self = {};

        self.createInjector = function () {
            var injector = {}, injected = {};

            injector.injectInto = function (target, mappings) {
                var propName, propValue, mapValue, mapType, toInject;

                for (propName in target) {
                    if (target.hasOwnProperty(propName)) {
                        propValue = target[propName];

                        if (propValue === undefined || propValue.di === "auto") {
                            mapValue = mappings[propName];
                            mapType = typeof mapValue;

                            toInject = injected[propName];

                            if (toInject === undefined) {
                                if (mapType === "function") {
                                    toInject = mapValue();
                                } else if (mapType === "object" && mapValue !== null) {
                                    toInject = mapValue;
                                }

                                injected[propName] = toInject;

                                if (typeof toInject === "object" && toInject !== null) {
                                    injector.injectInto(toInject, mappings);
                                }
                            }

                            target[propName] = toInject;
                        }
                    }
                }
            };

            return injector;
        };

        self.createKernel = function () {
            var o = {}, mappings = {};

            o.inject = function (target) {
                var injector = self.createInjector();

                injector.injectInto(target, mappings);

                return target;
            };

            o.set = function (name, mapping) {
                mappings[name] = mapping;
            };

            return o;
        };

        return self;
    }());

    window.di = di;
}(window));