# TP2

Application de messagerie simple - API.

## Démarer le serveur
``./mvnw clean spring-boot:run``

## Vérifiez que vous pouvez exécuter les tests avec:
``./mvnw clean verify``

## tests d’intégration du backend

```
npm install -g firebase-tools
firebase login
firebase init
```

lancer l’émulateur

``firebase emulators:start``

lancer tests

``firebase emulators:exec "./mvnw clean verify"``