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

    describe("inject", function () {

        it("returns the unmodified instance when no mapping is found", function () {
            var target = {
                property: undefined
            };

            expect(kernel.inject(target)).toBe(target);
            expect(kernel.inject(target).property).toBeUndefined();
        });

        it("injects the mapped properties when a mapping is found", function () {
            var target = {
                property: undefined
            };
            var injected = {};
            kernel.set("property", injected);

            expect(kernel.inject(target).property).toBe(injected);
        });

        it("does not inject the mapped properties when a mapping is found but a value is already assigned", function () {
            var existing = {};
            var target = {
                property: existing
            };
            var injected = {};
            kernel.set("property", injected);

            expect(kernel.inject(target).property).toBe(existing);
        });

        it("injects the result of the mapped construction method when a mapping is found", function () {
            var target = {
                property: undefined
            };
            var injected = {};
            kernel.set("property", function () {
                return injected;
            });

            expect(kernel.inject(target).property).toBe(injected);
        });

        it("injects recursive dependencies", function () {
            var targetOuter = {
                outer: undefined
            };
            var targetInner = {
                inner: undefined
            };
            var targetFinal = {};
            kernel.set("outer", function () {
                return targetInner;
            });
            kernel.set("inner", function () {
                return targetFinal;
            });

            var result = kernel.inject(targetOuter);

            expect(result.outer).toBe(targetInner);
            expect(result.outer.inner).toBe(targetFinal);
        });

        it("injects the same instance when many children map to the same dependency", function () {
            var times = 0;
            var parent = {
                child1: undefined,
                child2: undefined
            };
            var injected = {};
            kernel.set("child1", {
                property: undefined
            });
            kernel.set("child2", {
                property: undefined
            });
            kernel.set("property", function () {
                times++;
                return injected;
            });

            var result = kernel.inject(parent);

            expect(times).toBe(1);
            expect(result.child1.property).toBe(injected);
            expect(result.child2.property).toBe(injected);
        });

        it("injects the mapped properties when a mapping with placeholder is found", function () {
            var target = {
                property: { di: "auto" }
            };
            var injected = {};
            kernel.set("property", injected);

            expect(kernel.inject(target).property).toBe(injected);
        });

        it("injects the mapped properties with function parameters when a mapping with placeholder is found", function () {
            var target = {
                property: { di: "auto", property: ["ctor value"] }
            };
            kernel.set("property", function (value) {
                return { test: value };
            });

            expect(kernel.inject(target).property.test).toBe("ctor value");
        });
    });
});