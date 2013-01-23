/*global window*/

(function (window) {
    "use strict";

    var di = (function () {
        var self = {};

        self.createInjector = function () {
            var injector = {}, cache = {};

            injector.injectInto = function (target, mappings) {
                var propName, propValue, mapValue, mapType, toInject, cacheKey;

                for (propName in target) {
                    if (target.hasOwnProperty(propName)) {
                        propValue = target[propName];

                        if (propValue === undefined || propValue === null || propValue.di === "auto") {
                            propValue = propValue || {};
                            mapValue = mappings[propName];
                            mapType = typeof mapValue;

                            cacheKey = propName + "::" + propValue.ctor;
                            toInject = cache[cacheKey];

                            if (toInject === undefined) {
                                if (mapType === "function") {
                                    toInject = mapValue.apply(target, propValue.ctor);
                                } else if (mapType === "object" && mapValue !== null) {
                                    toInject = mapValue;
                                }

                                if (typeof toInject === "object" && toInject !== null) {
                                    injector.injectInto(toInject, mappings);
                                } else {
                                    toInject = null;
                                }

                                cache[cacheKey] = toInject;
                            }

                            if (toInject !== null) {
                                target[propName] = toInject;
                            }
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
    } ());

    window.di = di;
} (window));