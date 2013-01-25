describe("di", function () {
    it("is defined", function() {
        expect(di).toBeDefined();
    });

    it("creates a kernel", function () {
        expect(di.createKernel()).toBeDefined();
    });
});

describe("kernel", function () {
    var kernel;

    beforeEach(function () {
        kernel = di.createKernel();
    });

    describe("map", function () {
        it("registers the mapping of a property name to an object", function () {
            var o = {};
            kernel.map("property").to(o);

            expect(kernel.getMapping("property").name).toBe("property");
        });
    });

    describe("create", function () {

        it("returns undefined when no mapping is found", function () {
            expect(kernel.create("something")).toBeUndefined();
        });

        it("returns the correct instance when a mapping is found", function () {
            var instance = {};
            kernel.map("something").to(instance);

            expect(kernel.create("something")).toEqual(instance);
        });

        it("provides the parameters to the construction methods when there are parameters", function () {
            kernel.map("something").to(function (name) {
                return { name: name };
            });

            expect(kernel.create("something", ["John"]).name).toEqual("John");
        });
    });

    describe("inject", function () {

        describe("is chainable", function () {

            it("returns the unmodified instance when no mapping is found", function () {
                var target = {};

                expect(kernel.inject(target)).toEqual(target);
            });

        });

        describe("applies mappings to the target object", function () {

            it("does not modify the target when no mapping is found", function () {
                expect(kernel.inject({ property: "any value" }).property).toEqual("any value");
            });

            it("does not inject the mapped properties when a mapping is found but a value is already assigned", function () {
                kernel.map("property").to({});
                var existing = {};

                expect(kernel.inject({ property: existing }).property).toEqual(existing);
            });

            it("sets the properties when a mapping is found", function () {
                var injected = {};
                kernel.map("property").to(injected);

                expect(kernel.inject({ property: undefined }).property).toEqual(injected);
            });

            it("sets the properties using construction method when a mapping is found", function () {
                var injected = {};
                kernel.map("property").to(function () {
                    return injected;
                });

                expect(kernel.inject({ property: undefined }).property).toEqual(injected);
            });

            it("sets the properties when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder" }
                };
                var injected = {};
                kernel.map("property").to(injected);

                expect(kernel.inject(target).property).toEqual(injected);
            });

            it("keeps the placeholder when no mapping is found", function () {
                var placeholder = { inject: "placeholder" };
                var target = {
                    property: placeholder
                };

                expect(kernel.inject(target).property).toEqual(placeholder);
            });

            it("sets the properties using the function and ctor parameters when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder", params: ["foo"] }
                };
                kernel.map("property").to(function (value) {
                    return { test: value };
                });

                expect(kernel.inject(target).property.test).toEqual("foo");
            });

            it("injects when the 'when' condition on the placeholder returns a truthy value", function () {
                var injected = {};
                var o = {
                    property: { inject: "placeholder", someValue: 1 }
                };
                kernel.map("property").to(injected).when(function (context) { return context.placeholder.someValue === 1; });

                expect(kernel.inject(o).property).toEqual(injected);
            });

            it("injects when the 'when' condition on the target returns a truthy value", function () {
                var injected = {};
                var o = {
                    property: { inject: "placeholder" },
                    someValue: 1
                };
                kernel.map("property").to(injected).when(function (context) { return context.target.someValue === 1; });

                expect(kernel.inject(o).property).toEqual(injected);
            });

            it("does not inject when the 'when' property returns a falsy value", function () {
                var injected = {};
                var o = {
                    property: { inject: "placeholder", someValue: 1 }
                };
                kernel.map("property").to(injected).when(function (context) { return context.placeholder.someValue !== 1; });

                expect(kernel.inject(o).property.inject).toEqual("placeholder");
            });

            it("sets the properties using the function and a single ctor parameter when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder", params: "test" }
                };
                kernel.map("property").to(function (value) {
                    return { test: value };
                });

                expect(kernel.inject(target).property.test).toEqual("test");
            });

            it("sets the properties using the function and the placeholder parameters when a mapping with placeholder is found", function () {
                var target = {
                    property: { inject: "placeholder", params: ["value"] }
                };
                kernel.map("property").to(function (value) {
                    return { test: value };
                });

                expect(kernel.inject(target).property.test).toEqual("value");
            });

            it("sets properties recursively", function () {
                var targetOuter = { outer: undefined };
                var targetInner = { inner: undefined };
                var targetFinal = {};
                kernel.map("outer").to(function () {
                    return targetInner;
                });
                kernel.map("inner").to(function () {
                    return targetFinal;
                });

                var result = kernel.inject(targetOuter);

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
                kernel.map("child1").to({
                    property: undefined
                });
                kernel.map("child2").to({
                    property: undefined
                });
                kernel.map("property").to(function () {
                    times++;
                    return injected;
                });

                var result = kernel.inject(parent);

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
                kernel.map("child1").to({
                    property: {
                        inject: "placeholder",
                        params: {}
                    }
                });
                kernel.map("child2").to({
                    property: {
                        inject: "placeholder",
                        params: {}
                    }
                });
                kernel.map("property").to(function (o) {
                    times++;
                    return injected;
                });

                var result = kernel.inject(parent);

                expect(times).toEqual(1);
                expect(result.child1.property).toEqual(injected);
                expect(result.child2.property).toEqual(injected);
            });

        });

    });

});