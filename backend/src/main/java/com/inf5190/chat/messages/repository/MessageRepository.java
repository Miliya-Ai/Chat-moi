package com.inf5190.chat.messages.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Bucket.BlobTargetOption;
import com.google.cloud.storage.Storage.PredefinedAcl;
import com.google.firebase.cloud.StorageClient;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Classe qui gère la persistence des messages.
 *
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {
    private static final String COLLECTION_NAME = "messages";
    private final Firestore firestore;
    private StorageClient storageClient;
    private static final int DEFAULT_LIMIT = 20;

    @Autowired
    @Qualifier("storageBucketName")
    private String storageBucketName;

    public MessageRepository(Firestore firestore, StorageClient storageClient) {
        this.firestore = firestore;
        this.storageClient = storageClient;
    }

    public List<Message> getMessages(String fromId) throws InterruptedException, ExecutionException{
        List<Message> messages = new ArrayList<>();
        ApiFuture<QuerySnapshot> future;

        if (fromId != null) {
            ApiFuture<DocumentSnapshot> futureSnapshot = firestore.collection(COLLECTION_NAME).document(fromId).get();
            DocumentSnapshot snapshot = futureSnapshot.get();
            if (snapshot.exists()) {
                Timestamp timestamp = snapshot.getTimestamp("timestamp");
                future = firestore.collection(COLLECTION_NAME).orderBy("timestamp").startAfter(timestamp).get();
            } else {
                future = firestore.collection(COLLECTION_NAME).orderBy("timestamp").limitToLast(DEFAULT_LIMIT).get();
            }
        } else {
            future = firestore.collection(COLLECTION_NAME).orderBy("timestamp").limitToLast(DEFAULT_LIMIT).get();
        }


        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            String id = document.getId();
            FirestoreMessage firestoreMessage = document.toObject(FirestoreMessage.class);
            String username = firestoreMessage.getUsername();
            Timestamp timestamp = firestoreMessage.getTimestamp();
            Long time = timestamp.getSeconds();
            String text = firestoreMessage.getText();
            String imageUrl = firestoreMessage.getImageUrl();
            Message message = new Message(id, username, time, text, imageUrl);
            messages.add(message);
        }
        return messages;
    }

    public Message createMessage(NewMessageRequest message) throws InterruptedException, ExecutionException {
        DocumentReference ref = firestore.collection(COLLECTION_NAME).document();

        String imageUrl = null;
        if (message.imageData() != null) {
            Bucket b = storageClient.bucket(this.storageBucketName);
            String path = String.format("images/%s.%s", ref.getId(), message.imageData().type());
            b.create(path, Decoders.BASE64.decode(message.imageData().data()),
                    BlobTargetOption.predefinedAcl(PredefinedAcl.PUBLIC_READ));
            imageUrl = String.format("https://storage.googleapis.com/%s/%s", this.storageBucketName, path);
        }

        FirestoreMessage firestoreMessage = new FirestoreMessage(
                message.username(),
                Timestamp.now(),
                message.text(),
                imageUrl);

        ref.create(firestoreMessage).get();
        return this.toMessage(ref.getId(), firestoreMessage);
    }

    private Message toMessage(String id, FirestoreMessage firestoreMessage) {
        return new Message(id, firestoreMessage.getUsername(),
                firestoreMessage.getTimestamp().toDate().getTime(), firestoreMessage.getText(),
                firestoreMessage.getImageUrl());
    }

}
