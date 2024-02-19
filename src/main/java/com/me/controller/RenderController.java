package com.me.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class RenderController {
    @GetMapping("/notes.html")
    public String home(Model model) {
        model.addAttribute("title", "Notes");
        return "notes";
    }

    @GetMapping("/login.html")
    public String login(Model model) {
        model.addAttribute("title", "Notes");
        return "login";
    }
}
