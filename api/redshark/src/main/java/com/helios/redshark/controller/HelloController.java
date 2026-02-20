package com.helios.redshark.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
// Cho phép tất cả các nguồn gọi vào API này (Dùng cho môi trường Dev)
@CrossOrigin(origins = "*")
public class HelloController {

    @GetMapping("/greeting")
    public Map<String, String> getGreeting() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Kết nối từ React Native đến RedShark API thành công!");
        return response;
    }
}