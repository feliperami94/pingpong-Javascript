//Pregunta 1. A que hace referencia la palabra reservada self?
// R/ Es equivalente a la palabra reservada window, de donde se maneja la ventana del navegador.

(function(){ 
    self.Board = function(width, height){
            this.width = width;  
            this.height = height;
            this.playing = false;
            this.game_over = false;
            this.bars = [];
            this.ball = null;
            this.playing = false;
    }

    //Pregunta 2: Qué hace esta línea .prototype?
    // R/ Define un método del objeto Board, en este caso, el get elements.
    
    self.Board.prototype = { 
        get elements(){    
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;

        }
    }

})();

(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 2;
    }

    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height() {
            return this.radius * 2;
        },
        collision: function(bar){
            //Reacciona a la colision con una barra que recibe como parametro.
            var relative_intersect_y = ( bar.y + (bar.height/2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height/2);
            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        }
    }
})();

(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;

        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return `x: ${this.x} y: ${this.y} `;
        }
    }
})();


//Pregunta 3. Que hace el metodo getContext("2d") de la linea 106?
// R/ Devuelve el contexto de renderizado del canvas, en este caso es un contexto en dos dimensiones.
(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0,0,board.width, board.height);
        },
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];

                draw(this.ctx, el);
            }
            
        },
        play: function(){
            if (this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        },
        check_collisions: function(){
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
                
            }
        }
    }

    function hit(a, b){
        //Revisa si a colisiona con b
        var hit = false;
        //Colisiones horizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            //Colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        //Colision de a con b
        else if (b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }
        //Colision de b con a
        else if (a.x <= b.x && a.x + a.width >= b.x +b.width){
            if (a.y <= b.y && a.y +a.height >= b.y + b.height){
                hit = true;
            }
        }
        //Colision con los bordes
        else if (b.x - b.width){
            if (b.x + b.width >= 800){
                hit = true;
            }
        }
        else if(b.y + b.height <= 0){
            if (b.y + b.height >=400){
                hit = true;
            }   
        }


        
        return hit;
    }

    function draw(ctx, element){
        switch(element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
        }


    }
})();

var board = new Board(800,400);
var bar = new Bar(734, 250, 40, 100, board)
var bar_2 = new Bar(20, 100, 40, 100, board)
var canvas = document.getElementById('canvas');
var boardView = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);


//Pregunta 3. Que hace la propiedad code del evento keydown?
// R/ Devuelve la tecla presionada. Esta propiedad reemplaza al keyCode que se utiliza en el video.
document.addEventListener("keydown", function(ev){
    ev.preventDefault();
    if (ev.code === "ArrowUp"){
        bar.up();

    } else if (ev.code === "ArrowDown"){
        bar.down();
    } else if (ev.code === "KeyW"){
        bar_2.up();

    } else if (ev.code === "KeyS"){
        bar_2.down();
    } else if (ev.code === "Space"){
        board.playing = !board.playing;
    }
});

boardView.draw();
window.requestAnimationFrame(controller);


function controller(){
    boardView.play();
    window.requestAnimationFrame(controller);
}