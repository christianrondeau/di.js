describe("di", function () {
    it("is defined", function() {
        expect(di).toBeDefined();
    });

    it("creates a container", function () {
        expect(di.createContainer()).toBeDefined();
    });
});

describe("cache", function () {

    describe("acquire.exists", function () {

        it("creates a cache entry the first time it is called", function () {
            expect(di.createCache().acquire("key").exists()).toEqual(false);
        });

        it("gets the same cache entry second time it is called", function () {
            var cache = di.createCache({ key: "test" });

            expect(cache.acquire("key").exists()).toEqual(true);
        });

    });

    describe("acquire.hasValue", function () {

        it("returns true when an object is found", function () {
            expect(di.createCache({ key: {} }).acquire("key").hasValue()).toEqual(true);
        });

        it("returns false when the key is not found", function () {
            expect(di.createCache().acquire("key").hasValue()).toEqual(false);
        });

        it("returns false when null is found", function () {
            expect(di.createCache({ key: null }).acquire("key").hasValue()).toEqual(false);
        });

    });

    describe("acquire.getValue", function () {

        it("returns undefined when an object is not found", function () {
            expect(di.createCache().acquire("key").getValue()).toBeUndefined();
        });

        it("returns the cached object when the key is found", function () {
            expect(di.createCache({ key: "test" }).acquire("key").getValue()).toEqual("test");
        });
    });

    describe("acquire.setValue", function () {

        it("sets the value under the specified key", function () {
            var values = {}, cache = di.createCache(values);
            cache.acquire("key").setValue("value");

            expect(values.key).toEqual("value");
        });

    });

    describe("acquire.key", function () {

        it("is exactly the provided key", function () {
            expect(di.createCache().acquire("key").getGey()).toEqual("key");
        });

        it("is the provided key plus the param", function () {
            expect(di.createCache().acquire("key", "param1").getGey()).toEqual("key::param1");
        });

        it("is the provided key plus the list of params", function () {
            expect(di.createCache().acquire("key",  ["param1", "param2"]).getGey()).toEqual("key::param1,param2");
        });

    });

});

describe("container", function () {
    var container;

    beforeEach(function () {
        container = di.createContainer();
    });

    describe("map", function () {
        it("registers the mapping of a property name to an object", function () {
            var o = {};
            container.map("property").to(o);

            expect(container.getMapping("property").name).toBe("property");
        });
    });

    describe("create", function () {

        it("returns undefined when no mapping is found", function () {
            expect(container.create("something")).toBeUndefined();
        });

        it("returns the correct instance when a mapping is found", function () {
            var instance = {};
            container.map("something").to(instance);

            expect(container.create("something")).toEqual(instance);
        });

        it("provides the parameters to the construction methods when there are parameters", function () {
            container.map("something").to(function (name) {
                return { name: name };
            });

            expect(container.create("something", ["John"]).name).toEqual("John");
        });
    });

    describe("inject", function () {

        describe("is chainable", function () {

            it("returns the unmodified instance when no mapping is found", function () {
                var target = {};

                expect(container.inject(target)).toEqual(target);
            });

        });

        describe("applies mappings to the target object", function () {

            it("does not modify the target when no mapping is found", function () {
                expect(container.inject({ property: "any value" }).property).toEqual("any value");
            });

            it("does not inject the mapped properties when a mapping is found but a value is already assigned", function () {
                container.map("property").to({});
                var existing = {};

                expect(container.inject({ property: existing }).property).toEqual(existing);
            });

            it("sets the properties when a mapping is found", function () {
                var injected = {};
                container.map("property").to(injected);

                expect(container.inject({ property: undefined }).property).toEqual(injected);
            });

            it("sets the properties using construction method when a mapping is found", function () {
                var injected = {};
                container.map("property").to(function () {
                    return injected;
                });

                expect(container.inject({ property: undefined }).property).toEqual(injected);
            });

            it("sets the properties when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder" }
                };
                var injected = {};
                container.map("property").to(injected);

                expect(container.inject(target).property).toEqual(injected);
            });

            it("keeps the placeholder when no mapping is found", function () {
                var placeholder = { inject: "placeholder" };
                var target = {
                    property: placeholder
                };

                expect(container.inject(target).property).toEqual(placeholder);
            });

            it("sets the properties using the function and ctor parameters when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder", params: ["foo"] }
                };
                container.map("property").to(function (value) {
                    return { test: value };
                });

                expect(container.inject(target).property.test).toEqual("foo");
            });

            it("injects when the 'when' condition on the placeholder returns a truthy value", function () {
                var injected = {};
                var o = {
                    property: { inject: "placeholder", someValue: 1 }
                };
                container.map("property").to(injected).when(function (context) { return context.placeholder.someValue === 1; });

                expect(container.inject(o).property).toEqual(injected);
            });

            it("injects when the 'when' condition on the target returns a truthy value", function () {
                var injected = {};
                var o = {
                    property: { inject: "placeholder" },
                    someValue: 1
                };
                container.map("property").to(injected).when(function (context) { return context.target.someValue === 1; });

                expect(container.inject(o).property).toEqual(injected);
            });

            it("does not inject when the 'when' property returns a falsy value", function () {
                var injected = {};
                var o = {
                    property: { inject: "placeholder", someValue: 1 }
                };
                container.map("property").to(injected).when(function (context) { return context.placeholder.someValue !== 1; });

                expect(container.inject(o).property.inject).toEqual("placeholder");
            });

            it("sets the properties using the function and a single ctor parameter when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder", params: "test" }
                };
                container.map("property").to(function (value) {
                    return { test: value };
                });

                expect(container.inject(target).property.test).toEqual("test");
            });

            it("sets the properties using the function and the placeholder parameters when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder", params: ["value"] }
                };
                container.map("property").to(function (value) {
                    return { test: value };
                });

                expect(container.inject(target).property.test).toEqual("value");
            });

            it("sets properties recursively", function () {
                var targetOuter = { outer: undefined };
                var targetInner = { inner: undefined };
                var targetFinal = {};
                container.map("outer").to(function () {
                    return targetInner;
                });
                container.map("inner").to(function () {
                    return targetFinal;
                });

                var result = container.inject(targetOuter);

                expect(result.outer).toEqual(targetInner);
                expect(result.outer.inner).toEqual(targetFinal);
            });

            it("sets the same instance to many properties in one injection", function () {
                var times = 0;
                var parent = {
                    child1: undefined,
                    child2: undefined
                };
                var injected = {};
                container.map("child1").to({
                    property: undefined
                });
                container.map("child2").to({
                    property: undefined
                });
                container.map("property").to(function () {
                    times++;
                    return injected;
                });

                var result = container.inject(parent);

                expect(times).toEqual(1);
                expect(result.child1.property).toEqual(injected);
                expect(result.child2.property).toEqual(injected);
            });

            it("sets a different instance to many properties in one injection when the construction function is provided with an object", function () {
                var times = 0;
                var parent = {
                    child1: undefined,
                    child2: undefined
                };
                var injected = {};
                container.map("child1").to({
                    property: {
                        inject: "placeholder",
                        params: {}
                    }
                });
                container.map("child2").to({
                    property: {
                        inject: "placeholder",
                        params: {}
                    }
                });
                container.map("property").to(function (o) {
                    times++;
                    return injected;
                });

                var result = container.inject(parent);

                expect(times).toEqual(1);
                expect(result.child1.property).toEqual(injected);
                expect(result.child2.property).toEqual(injected);
            });

        });

    });

});