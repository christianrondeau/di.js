describe("di warriors example", function () {

    // ********************************************* warriors

    var warriors = {
        createNinja: function (name, health) {
            var self = {};

            self.name = name;

            self.health = health || 100;

            self.logger = {
                inject: "placeholder",
                write: function() { throw new Error("logger not injected"); }
            };

            self.weapon = undefined;

            self.attack = function (target) {
                if (self.weapon) {
                    self.logger.write("I, " + name + ", attack " + target.name + " with my ninja skills!");
                    self.weapon.use(target);
                } else {
                    self.logger.write("I, " + name + ", punch " + target.name + " with my ninja fists!");
                    target.hit(10);
                }
            };

            self.hit = function (points) {
                self.health -= points;

                if (self.health <= 0) {
                    self.logger.write(name + " died honorably today.");
                } else {
                    self.logger.write(name + " received a hit but is still standing!");
                }
            };

            return self;
        },

        createPeon: function (name) {
            var self = {};

            self.name = name;

            self.logger = {
                inject: "placeholder",
                write: function () { throw new Error("logger not injected"); }
            };

            self.attack = function (target) {
                self.logger.write("I'm " + name + " the peon, and I stumble on " + target.name + ".");
                target.hit(1);
            };

            self.hit = function () {
                self.logger.write(name + " has been beaten.");
            };

            return self;
        }
    };

    // ********************************************* weapons

    var weapons = {

        createSword: function () {
            var self = {};

            self.logger = {
                inject: "placeholder",
                write: function () { throw new Error("logger not injected"); }
            };

            self.use = function (target) {
                self.logger.write("Sword used on " + target.name + "!");
                target.hit(100);
            };

            return self;
        },

        createStick: function () {
            var self = {};

            self.logger = {
                inject: "placeholder",
                write: function () { throw new Error("logger not injected"); }
            };

            self.use = function (target) {
                self.logger.write("Sword used on " + target.name + "!");
                target.hit(5);
            };

            return self;
        }
    };

    // ********************************************* logger

    var loggers = {
        createMemoryLogger: function () {
            var self = {}, text = "";

            self.write = function (line) {
                text += line + "\n";
            };

            self.readAll = function () {
                return text.substring(0, text.length - 1);
            };

            return self;
        },
    };

    // ********************************************* setup

    var kernel, logger, fight;

    fight = function (attackerName, defenderName, defenderHealth) {
        var attacker = kernel.create("attacker", attackerName);
        var defender = kernel.create("defender", [defenderName, defenderHealth]);

        attacker.attack(defender);
    };

    beforeEach(function () {
        kernel = di.createKernel();

        logger = loggers.createMemoryLogger();

        kernel.map("logger").to(logger);
    });

    // ********************************************* tests

    it("Nitobi the ninja beats Bob the peon with a sword", function () {
        kernel.map("weapon").to(weapons.createSword);
        kernel.map("attacker").to(warriors.createNinja);
        kernel.map("defender").to(warriors.createPeon);

        fight("Nitobi", "Bob");

        expect(logger.readAll()).toEqual("I, Nitobi, attack Bob with my ninja skills!\nSword used on Bob!\nBob has been beaten.");
    });

    it("Nitobi the ninja kills Karasuma the ninja with a sword", function () {
        kernel.map("weapon").to(weapons.createSword);
        kernel.map("attacker").to(warriors.createNinja);
        kernel.map("defender").to(warriors.createNinja);

        fight("Nitobi", "Karasuma");

        expect(logger.readAll()).toEqual("I, Nitobi, attack Karasuma with my ninja skills!\nSword used on Karasuma!\nKarasuma died honorably today.");
    });

    it("Bob the peon barely hurts Nitobi the ninja", function () {
        kernel.map("attacker").to(warriors.createPeon);
        kernel.map("defender").to(warriors.createNinja);

        fight("Bob", "Nitobi");

        expect(logger.readAll()).toEqual("I'm Bob the peon, and I stumble on Nitobi.\nNitobi received a hit but is still standing!");
    });

    it("Nitobi the ninja hurts Karasuma the ninja with his fists", function () {
        kernel.map("attacker").to(warriors.createNinja);
        kernel.map("defender").to(warriors.createNinja);

        fight("Nitobi", "Karasuma");

        expect(logger.readAll()).toEqual("I, Nitobi, punch Karasuma with my ninja fists!\nKarasuma received a hit but is still standing!");
    });

    it("Nitobi the ninja kills the already hurt Karasuma the ninja with a stick", function () {
        kernel.map("weapon").to(weapons.createStick);
        kernel.map("attacker").to(warriors.createNinja);
        kernel.map("defender").to(warriors.createNinja);

        fight("Nitobi", "Karasuma", 5);

        expect(logger.readAll()).toEqual("I, Nitobi, attack Karasuma with my ninja skills!\nSword used on Karasuma!\nKarasuma died honorably today.");
    });

    it("Nitobi the ninja tries to kill Karasuma the ninja with a sword but only Jimmy can hold the sword!", function () {
        kernel.map("weapon").to(weapons.createSword).when(function(context){return context.target.name === "Jimmy"});
        kernel.map("attacker").to(warriors.createNinja);
        kernel.map("defender").to(warriors.createNinja);

        fight("Nitobi", "Karasuma");

        expect(logger.readAll()).toEqual("I, Nitobi, punch Karasuma with my ninja fists!\nKarasuma received a hit but is still standing!");
    });

});