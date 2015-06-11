(function(){
    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = {
            x: canvas.width,
            y: canvas.height
        };

        this.bodies = createInvaders(this).concat(new Player(this, gameSize));

        var self = this;
        var tick = function() {
            self.update();
            self.draw(screen, gameSize);
            requestAnimationFrame(tick);
        };
        tick();
    };

     var colliding = function(b1, b2) {
      return !( b1 === b2 ||
                b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
                b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
                b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
                b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };

    Game.prototype = {
        update: function() {
            var bodies = this.bodies;
            var notCollidingWithAnything = function(b1) {
                return bodies.filter(function(b2) {
                    return colliding(b1, b2);
                }).length === 0;
            };

            this.bodies = this.bodies.filter(notCollidingWithAnything);
            for(var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }
        },
        draw: function(screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            for(var i = 0; i < this.bodies.length; i++) {
                drawRect(screen, this.bodies[i]);
            }
        },
        addBody: function(body) {
            this.bodies.push(body);
        }
    };

    var Player = function(game, gameSize) {
        this.game = game;
        this.size = {x: 15, y: 15};
        this.center = {x: gameSize.x / 2, y: gameSize.y - this.size.x};
        this.keyborder = new KeyBoarder();
    };

    Player.prototype = {
        update: function() {
            if(this.keyborder.isDown(this.keyborder.KEYS.LEFT)) {
                this.center.x = this.center.x - 2;
            } else if (this.keyborder.isDown(this.keyborder.KEYS.RIGHT)) {
                this.center.x = this.center.x + 2;
            }

            if(this.keyborder.isDown(this.keyborder.KEYS.SPACE)) {
                var bullet = new Bullet({x: this.center.x, y: this.center.y - this.size.x },
                    {x: 0, y: -6});
                this.game.addBody(bullet);
            }
        }
    };

    var drawRect = function(screen, body) {
        screen.fillRect(body.center.x - body.size.x/ 2, body.center.y, body.size.x, body.size.y);
    };

    var Bullet = function(center, velocity) {
        this.size = {x: 3, y: 3};
        this.center = center;
        this.velocity = velocity;
    };

    Bullet.prototype = {
        update: function() {
            this.center.x = this.center.x + this.velocity.x;
            this.center.y = this.center.y + this.velocity.y;
        }
    };

    var Invader = function(game, center) {
        this.game = game;
        this.size = {x: 15, y: 15};
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    };

    Invader.prototype = {
        update: function() {
            if(this.patrolX < 0 || this.patrolX > 40) {
                this.speedX = -this.speedX;
            }
            this.center.x += this.speedX;
            this.patrolX += this.speedX;

            if(Math.random() > 0.95 && !this.hasBelowInvaders()) {
                var bullet = new Bullet({x: this.center.x, y: this.center.y + this.size.x },
                    {x: Math.random() - 0.5, y: 2});
                this.game.addBody(bullet);
            }
        },
        hasBelowInvaders: function() {
            var that = this;
            return this.game.bodies.filter(function(invader) {
              return that.center.y < invader.center.y && Math.abs(that.center.x - invader.center.x) < that.size.x;
            }).length > 0;
        }
    };

    var createInvaders = function(game) {
        var invaders = [];
        for(var i = 0; i < 24; i++) {
            var x = 30 + (i % 8) * 30;
            var y = 30 + (i % 3) * 30;
            invaders.push(new Invader(game, {x: x, y: y}));
        }
        return invaders;
    };

    var KeyBoarder = function() {
        var keyState = {};

        window.onkeyup = function(e) {
            keyState[e.keyCode] = false;
        };

        window.onkeydown = function(e) {
            keyState[e.keyCode] = true;
        };

        this.isDown = function(code) {
            return keyState[code] === true;
        };

        this.KEYS = {
            RIGHT: 39,
            LEFT: 37,
            SPACE: 32
        };
    };


    window.onload = function() {
        new Game("screen");
    };
})();