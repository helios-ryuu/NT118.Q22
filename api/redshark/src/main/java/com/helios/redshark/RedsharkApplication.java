package com.helios.redshark;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RedsharkApplication {

	public static void main(String[] args) {
		SpringApplication.run(RedsharkApplication.class, args);
	}

}
