(function(){
    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = {
            x: canvas.width,
            y: canvas.height
        };

        this.bodies = [new Player(this, gameSize)];

        var self = this;
        var tick = function() {
            self.update();
            self.draw(screen, gameSize);
            requestAnimationFrame(tick);
        };
        tick();
    };

    Game.prototype = {
        update: function() {
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
                var bullet = new Bullet({x: this.center.x, y: this.center.y },
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