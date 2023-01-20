package com.example.demo;

import lombok.*;

import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Entity;

@Entity
@Data
@NoArgsConstructor
public class Todo {

    @Id
    @GeneratedValue
    private Long id;

    @NonNull
    private String title;

    private Boolean completed = false;

}
