di.js, a simple dependency injection container
==============================================

This is a very simple dependency injection framework. It uses property names to dynamically create dependencies on JavaScript objects.

Alpha
-----

This is only a very early alpha and is subject to major changes. Your suggestions and ideas are welcome!

Usage
-----

First, create a kernal

    var kernel = di.create();

You can then define what instance to assign to a property

    kernel.set("property", instance);

You can also define a construction method instead

    kernel.set("property", function() {
		return ...;
	});

That's it!

Licence
-------

Copyright (c) Christian Rondeau 2013. This is provided under MIT Licence (see [LICENCE](https://github.com/christianrondeau/di.js/blob/master/LICENCE) for details)