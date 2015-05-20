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
        }
        tick();
    }

    Game.prototype = {
        update: function() {

        },
        draw: function(scrren, size) {
            console.log('hello');
        }
    };

    window.onload = function() {
        new Game("screen");
    };
})();