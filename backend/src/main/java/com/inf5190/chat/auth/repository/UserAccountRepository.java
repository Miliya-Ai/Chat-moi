package com.inf5190.chat.auth.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;
// import com.google.firebase.cloud.FirestoreClient;
@Repository
public class UserAccountRepository {
    private static final String COLLECTION_NAME = "userAccounts";
    private final Firestore firestore; //= FirestoreClient.getFirestore();

    public UserAccountRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public FirestoreUserAccount getUserAccount(String username) throws InterruptedException, ExecutionException {
        CollectionReference collectionRef = firestore.collection(COLLECTION_NAME);
        ApiFuture<DocumentSnapshot> getFuture = collectionRef.document(username).get();
        DocumentSnapshot doc3Snapshot = getFuture.get();

        if(doc3Snapshot.exists()) {
            //doc3Snapshot.getReference().getId();
            return doc3Snapshot.toObject(FirestoreUserAccount.class);
        } else {
            return null;
        }
    }

    public void setUserAccount(FirestoreUserAccount userAccount){
        String username = userAccount.getUsername();
        firestore.collection(COLLECTION_NAME).document(username).set(userAccount);
    }
}