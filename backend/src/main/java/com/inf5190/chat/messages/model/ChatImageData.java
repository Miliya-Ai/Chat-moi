package com.inf5190.chat.messages.model;

public record ChatImageData(String data, String type) {
    @Override
    public String data() {
        return data;
    }

    @Override
    public String type() {
        return type;
    }
}
