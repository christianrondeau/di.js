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

You can also define a construction method instead

    kernel.set("property", function() {
		return creationFunction(params);
	});

You can now inject recursive dependencies into an object

    var instance = kernel.inject(createMyInstance());

Recursivity and reuse
---------------------

When injecting an object, every injected object will also be injected with the mapped properties.

If many objects share the same dependency and a construction method was provided, only one instance will be created for all injected objects in the hierarchy.

Download
--------

You can download the latest stable version of di.js here on github: [download](https://raw.github.com/christianrondeau/di.js/master/di/di.js)

Licence
-------

Copyright (c) Christian Rondeau 2013. This is provided under MIT Licence (see [LICENCE](https://github.com/christianrondeau/di.js/blob/master/LICENCE) for details)