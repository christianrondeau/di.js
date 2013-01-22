describe("di", function () {
    var container, a, b;

    beforeEach(function () {
        container = di.create();
        a = {};
        b = {};
    });

    it("returns undefined when no mapping is found", function () {
        expect(container.get("whatever")).toBeUndefined();
    });

    it("returns the desired object when an instance mapping is found", function () {
        var o = {};
        container.set("mine", o);

        expect(container.get("mine")).toBe(o);
    });

    it("returns the desired object when a function mapping is found", function () {
        var o = {};
        container.set("something", function () {
            return o;
        });

        expect(container.get("something")).toBe(o);
    });
});