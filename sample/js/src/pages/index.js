/*global window*/
/// <reference path="../../../../di/di.js" />
/// <reference path="../model/model.js" />
/// <reference path="../components/output/alertOutput.js" />
/// <reference path="../components/output/simpleDomOutput.js" />
/// <reference path="../components/log/consoleLog.js" />

(function (sample) {
    "use strict";

    // The Kernel
    var kernel = di.createKernel();

    kernel.set("log", sample.createConsoleLog());

    kernel.set("talking", function () {
        return sample.createSimpleDomTalking(document.getElementById("output-div"));
    });

    // The Code
    var person = kernel.inject(sample.model.createPerson("Bobby"));

    person.say("Hello World!");
}(window.sample));