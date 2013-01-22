/// <reference path="../../../../di/di.js" />
/// <reference path="../model/model.js" />
/// <reference path="../components/output/alertOutput.js" />
/// <reference path="../components/output/simpleDomOutput.js" />

(function() {
    // The Kernel
    var kernel = di.createKernel();

    kernel.set("output", function() {
        return createSimpleDomOutput(document.getElementById("output-div"));
    });

    // The Code
    var person = kernel.inject(model.createPerson());

    person.say("Hello World!");
})();