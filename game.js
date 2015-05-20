(function(){
    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var size = {
            x: canvas.width,
            y: canvas.height
        };

        var self = this;
        var tick = function() {
            self.update();
            self.draw(screen, size);
            requestAnimationFrame(tick);
        }
        tick();
    }

    Game.prototype = {
        update: function() {
            console.log('hello');
        },
        draw: function(scrren, size) {

        }
    };

    window.onload = function() {
        new Game("screen");
    };
})();