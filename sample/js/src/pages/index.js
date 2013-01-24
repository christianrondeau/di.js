/*global window, di*/
/// <reference path="../../../../di/di.js" />
/// <reference path="../model/model.js" />
/// <reference path="../components/output/alertOutput.js" />
/// <reference path="../components/output/simpleDomOutput.js" />
/// <reference path="../components/log/consoleLog.js" />

(function (document, sample, di) {
    "use strict";

    var kernel, person;

    // configuring the kernel
    kernel = di.createKernel();
    
    kernel.map("log").to(sample.createConsoleLog());

    kernel.map("talking").to(function () {
        return sample.createSimpleDomTalking(document.getElementById("output-div"));
    });
    
    // creating the instance
    person = kernel.inject(sample.model.createPerson("Bobby"));

    // working with the injected instance
    person.say("Hello World!");
}(document, sample, di));