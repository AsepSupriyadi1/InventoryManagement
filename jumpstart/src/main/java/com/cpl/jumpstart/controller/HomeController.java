package com.cpl.jumpstart.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/hello")
    public String index(){
        return "Hello Guysss";
    }

}
