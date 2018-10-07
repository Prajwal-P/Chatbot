# Chatbot
Chatbot to book, Track, Cancel service request.


Instructions to run:
1. First set up firebase project. refer https://firebase.google.com/docs/cli/
2. Replace the index.js file in functions folder with one  in the github repo.
3. use 'firebase deploy' to deploy function.
4. Insert product details, pincode into firebase database as shown in figure.
5. Open Dialogflow and create agent and choose import from settings and select the Chatbot folder you  
    downloaded from the github repo.
6. In dialogflow fulfillment paste the firebase functions link.
7. Now you can book service and the details will be stored in the database.


