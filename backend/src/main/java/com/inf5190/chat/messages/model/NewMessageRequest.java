package com.inf5190.chat.messages.model;

public record NewMessageRequest(String username, String text, ChatImageData imageData) {
    @Override
    public String username() {
        return username;
    }

    @Override
    public String text() {
        return text;
    }

    public ChatImageData imageData() {
        return imageData;
    }
}
