package com.globalshop;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.globalshop.mapper")
public class GlobalShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(GlobalShopApplication.class, args);
    }
}
