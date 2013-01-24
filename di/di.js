/*global window*/

(function(window) {
    "use strict";

    var di = {};

    di.createInjector = function() {
        var injector = {}, cache = {};

        injector.injectInto = function(target, mappings) {
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

    di.createKernel = function() {
        var kernel = {}, mappings = {};

        kernel.inject = function(target) {
            var injector = di.createInjector();

            injector.injectInto(target, mappings);

            return target;
        };

        kernel.map = function(name) {
            return {
                to: function(target) {
                    mappings[name] = target;
                }
            };
        };

        kernel.get = function(name) {
            return mappings[name];
        };

        return kernel;
    };

    window.di = di;
}(window));