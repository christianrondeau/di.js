/// <reference path="di.js" />
/// <reference path="main.js" />
/// <reference path="alertOutput.js" />

// The Kernel
var kernel = di.create();

kernel.set("output", createAlertOutput);

// The Code
var person = kernel.inject(main.createPerson());

person.say("Hello World!");