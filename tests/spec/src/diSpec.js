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

    });
});