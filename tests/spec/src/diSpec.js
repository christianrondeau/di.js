describe("di", function () {
    var container;

    beforeEach(function () {
        container = di.create();
    });

    it("returns self when no mapping is found", function () {
        var target = {};
        expect(container.inject(target)).toBe(target);
    });

    it("returns the desired object when an instance mapping is found", function () {
        var target = {
            property: undefined
        };
        var injected = {};
        container.set("property", injected);

        expect(container.inject(target).property).toBe(injected);
    });

    it("returns the desired object when a function mapping is found", function () {
        var target = {
            property: undefined
        };
        var injected = {};
        container.set("property", function() {
            return injected;
        });

        expect(container.inject(target).property).toBe(injected);
    });
});