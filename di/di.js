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

            mapping = mappings.get(prop);

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

    // ********************************************** Mapping Dictionary

    di.createMappingDict = function () {
        var mappingDict = {}, dict = [];

        mappingDict.get = function (name) {
            return dict[name];
        };

        mappingDict.getOrCreate = function (name) {
            var o = dict[name];
            if (o === undefined) {
                o = di.createMapping(name);
                dict[name] = o;
            }
            return o;
        };

        return mappingDict;
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
            var mapping = mappings.getOrCreate(name);

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
        var container = {}, mappings = di.createMappingDict();

        container.inject = function (target) {
            di.createInjector(mappings).injectIntoTarget(target);

            return target;
        };

        container.create = function (name, params) {
            var mapping = mappings.getOrCreate(name);

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
            return mappings.get(name);
        };

        return container;
    };

    // ********************************************** Registering
    window.di = di;
} (window));