describe("di", function () {
    var container;

    beforeEach(function () {
        container = di.create();
    });

    it("returns self when no mapping is found", function () {
        var target = {};
        expect(container.inject("whatever", target)).toBe(target);
    });

    it("returns the desired object when an instance mapping is found", function () {
        var target = {};
        var injected = {};
        container.set("mine", {
            property: injected
        });

        expect(container.inject("mine", target).property).toBe(injected);
    });

    it("returns the desired object when a function mapping is found", function () {

        var target = {};
        var injected = {};
        container.set("something", {
            property: function () {
                return injected;
            }
        });

        expect(container.inject("something", target).property).toBe(injected);
    });
});