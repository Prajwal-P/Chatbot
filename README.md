# Chatbot

This ChatBot is used to Book, Track, and Cancel service appointments made.

Implemented using Dialogflow, Firestore and firebase-functions.

Frontend: Dialogflow
Backend: Firestore database.

Dialogflow:

First we create Chatbot Agent which answers the customers request.

Then we create entities to identify 
   *  productLine
   *  serialNumber
   *  modelNumber

Then we create 6 intents to respond to different requests

    * Default Welcome Intent.
    
        * It is used to respond to hi, hello request.
    
    * BookService.
    
        * It accepts appliance serialNumber, modelNumber, applianceType and sends it to firebase function to verify whether             it is valid and returns back the response to user.
    * BookServiceDataCapture.
    
        * Here the intent gets user details like name, email, phone, address,
          problem with the appliance, pincode and responds with the booking slots available for that corresponding pincode. 
    
    * BookServiceGetTime.
    
        * If the pincode is not available in the database then online booking cant be done and the customer will be contacted           by the customer support team as soon as possible for alternative methods.
        * Here the customer chooses the booking slot from the provided options 
          and finally the service request is booked.
    
    * TrackService.
        * This intent handles the tracking requests of the user and replies the status by fetching from the database.
    
    * CancelService.
        * This intent handles canceling of service request if the customer doesnt need service.



![screenshot from 2018-10-07 15-48-22](https://user-images.githubusercontent.com/32369302/46582212-0dfb1f80-ca61-11e8-93d1-bd4776cd196d.png)
![screenshot from 2018-10-07 15-48-25](https://user-images.githubusercontent.com/32369302/46582217-13586a00-ca61-11e8-98a7-566b42166349.png)


Firebase database:
Firebase database user the concept of collections and documents to store data.
We need to create collections of 
    • serialNumber to store details of all the products so that we can verify the serialNumber entered by the customer.
    • pincode to store the day the service personnel is available for that perticular pincode.
    • BookingDetails to store the service request details booked by the user.


![screenshot from 2018-10-07 15-48-03](https://user-images.githubusercontent.com/32369302/46582139-29b1f600-ca60-11e8-9c25-c4c1a8787aec.png)
![screenshot from 2018-10-07 15-48-09](https://user-images.githubusercontent.com/32369302/46582147-3c2c2f80-ca60-11e8-9971-34c6f827839e.png)
![screenshot from 2018-10-07 15-48-15](https://user-images.githubusercontent.com/32369302/46582144-3898a880-ca60-11e8-9f38-ab36d6ca5cf8.png)


Instructions to run:
1. First set up firebase project. refer https://firebase.google.com/docs/cli/
2. Replace the index.js file in functions folder with one  in the github repo.
3. use 'firebase deploy' to deploy function.
4. Insert product details, pincode into firebase database as shown in figure.
5. Open Dialogflow and create agent and choose import from settings and select the Chatbot folder you  
    downloaded from the github repo.
6. In dialogflow fulfillment paste the firebase functions link.
7. Now you can book service and the details will be stored in the database.


