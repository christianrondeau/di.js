di.js, a simple dependency injection container
==============================================

This is a very simple dependency injection framework. It uses property names to dynamically create dependencies on JavaScript objects.

Alpha
-----

This is only a very early alpha and is subject to major changes. Your suggestions and ideas are welcome!

A simple example
-----

```javascript
    var kernel = di.createKernel();

	kernel.map("weapon").to(sword).when(function(context) { return context.target.strength > 10 });
	kernel.map("warrior").to(createNinja);

	var warrior = kernel.create("warrior", { name: "Zumoku" };
```

Usage
-----

First, create a kernel. This holds your mappings.

```javascript
    var kernel = di.createKernel();
```

You can then define an instance to assign to property with a given name

```javascript
    kernel.map("weapon").to(sword);
```

You can also define a construction method instead of an instance

```javascript
    kernel.map("weapon").to(function() {
		return createSword();
	});
```

You can provide conditional mappings using the `when` function; the `context` parameter contains a `placeholder` and the injection `target`

```javascript
    kernel.map("weapon").to(sword).when(function(context) { return context.target.strength >= 10 });
	kernel.map("weapon").to(stick).when(function(context) { return context.target.strength < 10 });
```

You can inject dependencies directly into an object

```javascript
	var warrior = {
		...
	};

    kernel.inject(warrior);
```

Keep in mind that `kernel.inject` returns the instance, so you can create and inject your objects in a single line

```javascript
	var warrior = kernel.inject(createWarrior());
```

You can also create an instance and inject it by using `kernel.create` and the mapped name

```javascript
	kernel.map("warrior").to(createNinja);

	var warrior = kernel.create("warrior");
```

Recursivity and reuse
---------------------

If an object has an injected property, the injected value will also be injected with dependencies.

If many objects have the same dependency, only one instance of that dependency will be created for the whole tree, unless the construction parameters are different.

Placeholders
---------------------

You can use placeholders on properties.

With placeholders you can throw custom error messages and use autocomplete in IDEs. They will be replaced by the injected properties if a mapping exists.

```javascript
	var warrior = {
		weapon = {
			inject: "placeholder",
			hit: function() { throw new Error("weapon not set") };
		};
	};
```

You could also use placeholders for implementing a default behavior if nothing was injected.

Construction function parameters
--------------------------------

You can use placeholders to provide parameters to the injected construction function.

```javascript
	kernel.map("weapon").to(function(enchantment) {
		return ...;
	});

	var warrior = {
		weapon = {
			inject: "placeholder",
			params: ["Magic Ice"]
		};
	};

	kernel.inject(warrior);
```

Download
--------

You can download the latest version of di.js here on github: [download](https://raw.github.com/christianrondeau/di.js/master/di/di.js)

Licence
-------

Copyright (c) Christian Rondeau 2013. This is provided under MIT Licence (see [LICENCE](https://github.com/christianrondeau/di.js/blob/master/LICENCE) for details)