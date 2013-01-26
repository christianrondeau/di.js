/*global window*/

(function (window) {
    "use strict";

    var di = {};

    // ********************************************** Dict

    di.createDict = function (init) {
        var dict = {}, entries = init || {};

        dict.acquire = function (prop, params) {
            var key, value;
            key = prop + (params ? "::" + (params.join ? params.join(",") : params) : "");
            value = entries[key];

            return {
                getGey: function () {
                    return key;
                },
                exists: function () {
                    return value !== undefined;
                },
                hasValue: function () {
                    return value !== undefined && value != null;
                },
                getValue: function () {
                    return value;
                },
                setValue: function (o) {
                    value = o;
                    entries[key] = value;
                },
                getOrCreate: function (createFunc) {
                    var entry = entries[key];
                    if (!entry) {
                        entry = createFunc();
                        entries[key] = entry;
                    }
                    return entry;
                }
            };
        };

        return dict;
    };

    // ********************************************** Injector

    di.createInjector = function (mappings) {
        var injector = {}, cache = di.createDict();

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

        injector.getOrCreateDependency = function (target, mapping, params, placeholder) {
            var targetValue, targetType, i, dependency, context;

            for (i = 0; i < mapping.targets.length; i++) {
                var targetMapping = mapping.targets[i];
                targetValue = targetMapping.target;

                context = {
                    target: target,
                    placeholder: placeholder
                };

                if (!targetMapping.condition || targetMapping.condition(context)) {

                    targetType = typeof targetValue;

                    if (targetType === "function") {
                        dependency = targetValue.apply(target, Array.isArray(params) ? params : [params]);
                    } else if (targetType === "object" && targetValue !== null) {
                        dependency = targetValue;
                    }

                    if (typeof dependency === "object" && dependency !== null) {
                        injector.injectIntoTarget(dependency);
                        return dependency;
                    }

                    return undefined;
                }
            }

            return undefined;
        };

        injector.injectIntoProperty = function (target, prop) {
            var mapping, placeholder, dependency, params, entry;

            mapping = mappings.acquire(prop).getValue();

            if (!mapping)
                return;

            placeholder = target[prop];

            if (injector.canPlaceholderBeInjected(placeholder)) {

                params = placeholder ? placeholder.params : undefined;
                entry = cache.acquire(prop, params);

                if (!entry.exists()) {
                    dependency = injector.getOrCreateDependency(target, mapping, params, placeholder);

                    entry.setValue(dependency);
                }

                if (entry.hasValue()) {
                    target[prop] = entry.getValue();
                }
            }
        };

        return injector;
    };

    // ********************************************** Mapping

    di.createMapping = function (name) {
        var mapping = {};

        mapping.name = name;

        mapping.targets = [];

        mapping.addTarget = function (target) {
            var targetMapping = { target: target };
            mapping.targets.push(targetMapping);
            return targetMapping;
        };

        return mapping;
    };

    // ********************************************** Map Chain

    di.createMapChain = function (mappings, name) {
        var map = {};

        map.to = function (target) {
            var mapping = mappings.acquire(name).getOrCreate(function () { return di.createMapping(name); });

            var targetMapping = mapping.addTarget(target);

            return {
                when: function (condition) {
                    targetMapping.condition = condition;
                }
            };
        }

        return map;
    };

    // ********************************************** Container

    di.createContainer = function () {
        var container = {}, mappings = di.createDict();

        container.inject = function (target) {
            di.createInjector(mappings).injectIntoTarget(target);

            return target;
        };

        container.create = function (name, params) {
            var mapping = mappings.acquire(name).getOrCreate(function () { return di.createMapping(name) });

            if (mapping) {
                return di.createInjector(mappings).getOrCreateDependency(this, mapping, params);
            } else {
                return undefined;
            }
        };

        container.map = function (name) {
            return di.createMapChain(mappings, name);
        };

        container.getMapping = function (name) {
            return mappings.acquire(name).getValue();
        };

        return container;
    };

    // ********************************************** Registering
    window.di = di;
} (window));