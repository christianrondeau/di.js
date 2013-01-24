di.js, a simple dependency injection container
==============================================

This is a very simple dependency injection framework. It uses property names to dynamically create dependencies on JavaScript objects.

Alpha
-----

This is only a very early alpha and is subject to major changes. Your suggestions and ideas are welcome!

Usage
-----

First, create a kernel

    var kernel = di.createKernel();

You can then define what instance to assign to a property

    kernel.set("property", instance);

You can also define a construction method instead of an instance

    kernel.set("property", function() {
		return ...;
	});

You can now inject dependencies into an object and its recursive dependencies

	var o = {
		property: undefined
	};

    kernel.inject(o);

Keep in mind that kernel.inject returns the instance, so you can create your objects in a single line

	var o = kernel.inject(createMyObject());

Recursivity and reuse
---------------------

When injecting an object, every injected object will also be injected with the mapped properties.

If many objects share the same dependency and a construction method was provided, only one instance will be created for all injected objects in the hierarchy.

Placeholders
---------------------

You can create a placeholder in objects to inject.

Placeholders allow for getting better error messages and allow autocomplete in IDEs.

	var target = {
		property = {
			di: "auto",
			doSomething: function() { throw new Error("propertyToInject not set") };
		};
	};

	kernel.inject(target);

You could also use placeholders for implementing a default behavior if nothing is injected in the property.

Constructor parameters
---------------------

You can use placeholders to provide parameters to the injected construction function.

	kernel.set("property", function(param1, param2) {
		return ...;
	});

	var target = {
		property = {
			di: "auto",
			ctor: ["param1", "param2"]
		};
	};

	kernel.inject(target);

Download
--------

You can download the latest stable version of di.js here on github: [download](https://raw.github.com/christianrondeau/di.js/master/di/di.js)

Licence
-------

Copyright (c) Christian Rondeau 2013. This is provided under MIT Licence (see [LICENCE](https://github.com/christianrondeau/di.js/blob/master/LICENCE) for details)