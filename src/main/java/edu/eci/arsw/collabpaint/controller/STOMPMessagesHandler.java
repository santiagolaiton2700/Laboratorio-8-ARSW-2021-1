package edu.eci.arsw.collabpaint.controller;

import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.Polygon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
public class STOMPMessagesHandler {
    @Autowired
    SimpMessagingTemplate msgt;
    List<Polygon> polygonList = Collections.synchronizedList(new ArrayList<Polygon>());
    List<Point> pointsForPolygon = Collections.synchronizedList(new ArrayList<Point>());
    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!: "+pt);
        msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);


        if (pointsForPolygon.size()<4) {
            pointsForPolygon.add(pt);
        }

        if (pointsForPolygon.size()==4){

            Polygon generatedPolygon=new Polygon(pointsForPolygon);
            polygonList.add(generatedPolygon);
            pointsForPolygon = Collections.synchronizedList(new ArrayList<Point>());
            msgt.convertAndSend("/topic/newpolygon."+numdibujo, generatedPolygon);
        }


    }
}
