var createSimpleDomOutput = function (el) {
    var self = {};

    self.send = function (value) {
        if (typeof el["innerText"] === "undefined")
            throw new Error("Element does not have innerText property");
        
        el.innerText = value;
    };

    return self;
}