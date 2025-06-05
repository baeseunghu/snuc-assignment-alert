package com.unialert.model;

import java.time.LocalDate;

public class Assignment {
    private String id;
    private String courseName;
    private String title;
    private String description;
    private LocalDate dueDate;

    public Assignment(String id, String courseName, String title, String description, LocalDate dueDate) {
        this.id = id;
        this.courseName = courseName;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

    public String getId() { return id; }
    public String getCourseName() { return courseName; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDate getDueDate() { return dueDate; }
}