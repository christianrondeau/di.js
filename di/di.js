/*global window*/

(function (window) {
    "use strict";

    var di = {};

    // ********************************************** Cache

    di.createCache = function () {
        var cache = {}, entries = {};

        cache.acquire = function (prop, params) {
            var key, value;
            key = prop + (params ? "::" + (params.join ? params.join(",") : params) : "");
            value = entries[key];

            return {
                exists: function () {
                    return value !== undefined;
                },
                hasValue: function () {
                    return value;
                },
                getValue: function () {
                    return value;
                },
                setValue: function (o) {
                    value = o;
                    entries[key] = value;
                }
            };
        };

        return cache;
    };

    // ********************************************** Injector

    di.createInjector = function (mappings) {
        var injector = {}, cache = di.createCache();

        injector.canPlaceholderBeInjected = function (placeholder) {
            return placeholder === undefined || placeholder === null || typeof placeholder.inject === "string";
        };

        injector.injectIntoTarget = function (target) {
            var propName;

            if (!target) {
                return;
            }

            for (propName in target) {
                if (target.hasOwnProperty(propName)) {
                    injector.injectIntoProperty(target, propName);
                }
            }
        };

        injector.getOrCreateDependency = function (target, mapping, params) {
            var targetType, i;
            
            for(i = 0; i < mapping.targets; i++) {
                var targetMapping = mapping[i];

                if(!targetMapping.condition || targetMapping.condition(targetMapping.target, placeholder))
                {
                    targetType = typeof targetMapping.target, dependency;

                    if (targetType === "function") {
                        dependency = targetMapping.target.apply(target, Array.isArray(params) ? params : [params]);
                    } else if (targetType === "object" && source !== null) {
                        dependency = targetMapping.target;
                    }

                    if (typeof dependency === "object" && dependency !== null) {
                        injector.injectIntoTarget(dependency);
                        return dependency;
                    }

                    return null;
                }
            }

            return null;
        };

        injector.injectIntoProperty = function (target, prop) {
            var placeholder, dependency, params, entry;

            placeholder = target[prop];

            if (injector.canPlaceholderBeInjected(placeholder)) {

                params = placeholder ? placeholder.ctor : undefined;
                entry = cache.acquire(prop, params);

                if (!entry.exists()) {
                    dependency = injector.getOrCreateDependency(target, mappings[prop], params);

                    entry.setValue(dependency);
                }

                if (entry.hasValue()) {
                    target[prop] = entry.getValue();
                }
            }
        };

        return injector;
    };

    // ********************************************** Kernel

    di.createKernel = function () {
        var kernel = {}, mappings = {};

        kernel.inject = function (target) {
            di.createInjector(mappings).injectIntoTarget(target);

            return target;
        };

        kernel.create = function (name, params) {
            return di.createInjector(mappings).getOrCreateDependency(this, mappings[name], params);
        };

        kernel.map = function (name) {
            return {
                to: function (target) {
                    var mapping = kernel.createMapping(name);
                    mappings[name] = mapping;
                    var targetMapping = mapping.addTarget(target);
                    return {
                        when: function (condition) {
                            targetMapping.condition = condition;
                        }
                    };
                };
            };
        };

        kernel.get = function (name) {
            return mappings[name];
        };

        kernel.createMapping(name) {
            var mapping = {};

            mapping.name = name;

            mapping.targets = [];

            mapping.addTarget(target) {
                var targetMapping = {target: target};
                targets.push(targetMapping);
                return targetMapping;
            }

            return mapping;
        }

        return kernel;
    };

    // ********************************************** Registering
    window.di = di;
} (window));