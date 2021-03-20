//package edu.eci.arsw.collabpaint.controller;
//
//import edu.eci.arsw.collabpaint.model.Point;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class PointsController {
//    @MessageMapping("/newpoint")
//    @SendTo("/topic/newpoint")
//    public Point pointStomp (Point point) throws Exception{
//        System.out.println("IT'S HERE!!!"+point.getX());
//        return new Point(point.getX(),point.getY());
//    }
//}
