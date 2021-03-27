var app = (function () {
    

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    var subscribed = false;
    var subscribeNumber=null;

    var initMouseEvent = function(){
        let mouseInteractionCanvas = document.getElementById("canvas").getContext('2d');
        
        
            mouseInteractionCanvas.canvas.addEventListener('click', function(event){
                
                if (subscribed){
                    var mouseX = event.clientX - mouseInteractionCanvas.canvas.offsetLeft;
                    var mouseY = event.clientY - mouseInteractionCanvas.canvas.offsetTop;

                    // stompClient.send("/topic/newpoint",{},JSON.stringify(new Point(mouseX, mouseY)));
                    sendToStompClient(mouseX,mouseY);
                }
            });
        

    }

    var addPointToCanvas = function (point) {
        if (subscribed){
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else{
            alert("You have to assign a number to your current drawing!");
        }
    };
    
    var clearCanvas = function(){
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();

        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    // var connectAndSubscribe = function () {
    //     console.info('Connecting to WS...');
        
    //     var socket = new SockJS('/stompendpoint');        
    //     stompClient = Stomp.over(socket);        
        
    //     stompClient.connect({}, function (frame) {
            
    //         console.log('Connected: ' + frame);
            
    //         stompClient.subscribe('/topic/newpoint', function (message) {
    //             var messagePoint=JSON.parse(message.body);
    //             // alert("Punto X: "+objectJS.x+" Punto T: "+objectJS.y); //first commit
    //             addPointToCanvas(messagePoint);

    //         });
    //     });

    // };

    var addPolygonToCanvas = function (messagePolygon){
        
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.fillStyle = "cyan";
        context.beginPath();
        context.moveTo(messagePolygon[0].x, messagePolygon[0].y);

        for(var i = 1; i < messagePolygon.length; i++){
            context.lineTo(messagePolygon[i].x, messagePolygon[i].y);
        }
        context.closePath();
        context.fill();
    }

    var subscribeToPoint = function(idNumber){
        if (idNumber!==null){
                subscribed=true;
                subscribeNumber=idNumber;


                document.getElementById("sendPoint").disabled=false;
        
                console.info('Connecting to WS...');
                
                var socket = new SockJS('/stompendpoint');        
                stompClient = Stomp.over(socket);        
                stompClient.connect({}, function (frame) {
                    console.log('Connected: ' + frame);
                    // stompClient.subscribe('/topic/newpoint.'+idNumber, function (message) {
                    stompClient.subscribe('/topic/newpoint.'+idNumber, function (message) {

                        var messagePoint=JSON.parse(message.body);
                        // alert("Punto X: "+objectJS.x+" Punto T: "+objectJS.y); //first commit

                        addPointToCanvas(messagePoint);
        
                    });

                    stompClient.subscribe('/topic/newpolygon.'+idNumber, function (message) {
                        var messagePolygon=JSON.parse(message.body);
                        addPolygonToCanvas(messagePolygon.points);
                    });
                }); 
        }
    }

    var sendToStompClient= function(px, py){

        var pt=new Point(px,py);
        console.info("publishing point at "+pt);
        //addPointToCanvas(pt);

        //publicar el evento
        
        // stompClient.send("/topic/newpoint."+subscribeNumber,{},JSON.stringify(pt));
        stompClient.send("/app/newpoint."+subscribeNumber,{},JSON.stringify(pt));
            
 
    }
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            document.getElementById("sendPoint").disabled=true;
            //websocket connection

            // connectAndSubscribe();
            initMouseEvent();
        },

        publishPoint: function(px,py){
            px=parseInt(px);
            py=parseInt(py);


            if (!isNaN(px) && !isNaN(py)){

                sendToStompClient(px, py);
            }
            else {

                alert ("Drawing a point requires 2 coordinates!");
            }               
        },

        subscribeToPoint: function(idNumber){
            clearCanvas();
            subscribeToPoint(idNumber);
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