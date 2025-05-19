package com.example.habit_tracker.model;

public class ApiResponse {
    private String message;
    private Object data;

    // constructors, getters, setters
    public ApiResponse(String message, Object data) {
        this.message = message;
        this.data = data;
    }

    //setters and getters
    public Object getData() {
        return data;
    }
    public void setData(Object data) {
        this.data = data;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}

