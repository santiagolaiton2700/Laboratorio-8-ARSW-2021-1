var app = (function () {
    

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var initMouseEvent = function(){
        let mouseInteractionCanvas = document.getElementById("canvas").getContext('2d');
        

        mouseInteractionCanvas.canvas.addEventListener('click', function(event){

            var mouseX = event.clientX - mouseInteractionCanvas.canvas.offsetLeft;
            var mouseY = event.clientY - mouseInteractionCanvas.canvas.offsetTop;

            stompClient.send("/topic/newpoint",{},JSON.stringify(new Point(mouseX, mouseY)));
            
        });

    }

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        console.log(evt.clientX - rect.left);
        console.log(evt.clientY - rect.top);
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        
        var socket = new SockJS('/stompendpoint');        
        stompClient = Stomp.over(socket);        
        
        stompClient.connect({}, function (frame) {
            
            console.log('Connected: ' + frame);
            
            stompClient.subscribe('/topic/newpoint', function (message) {
                var messagePoint=JSON.parse(message.body);
                // alert("Punto X: "+objectJS.x+" Punto T: "+objectJS.y); //first commit
                addPointToCanvas(messagePoint);

            });
        });

    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection

            connectAndSubscribe();
            initMouseEvent();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            // addPointToCanvas(pt);

            //publicar el evento
            
            stompClient.send("/topic/newpoint",{},JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();