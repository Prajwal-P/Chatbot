/*

Title: GEA ChatBot
Description: ChatBot to Book, Track, Cancel service for the appliance
author: Sharath B P

*/


const functions = require('firebase-functions');
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

exports.webhook = functions.https.onRequest((request, response) => {
    //this is to get the json object parameters
    let param = request.body.queryResult.parameters;

    //actions are used to execute specific code for that perticular action
    //switch is used to choose code respective to that perticular action
    switch(`${request.body.queryResult.action}`){
	/*
	     Here we get serialNumber and modelNumber and check against database if they match, it they dont then we ask user to re-enter
	     If they match then we check if there already exist booking in that serialNumber, if present we ask the user to track
	     else we proceed with requesting for the customer details 
	*/
        case 'BookService':
            
            firestore.collection('serialNumber').doc(`${param.serialNumber}`).get()
            .then((snapshot) => {
                if(snapshot.data().modelNumber !== `${param.modelNumber}`)
                    response.send({
                        fulfillmentText: `Dear customer the serial number and model number does'nt match please re-enter`
                    })
                throw new Error("Profile doesn't exist")
            }).catch(e => {
                console.log('error : ',e);
            })
            firestore.collection('bookingDetails').doc(`${param.serialNumber}`).get()
            .then((doc) => {
                if(!doc.exists)
                    response.send({
                        fulfillmentText: `May I know your name please?`
                    })
                else
                    response.send({
                        fulfillmentText: `Booking already exists please track your booking with your serial number`
                    })
                throw new Error("Profile doesn't exist")
            }).catch(e => {
                console.log('error : ',e);
            })

        break;
	
	/*    
	     After the data has been captured we ask user to choose time slot by giving slot options which is fetched from the database
	     If pincode is not present in the database then the service personnel cant service at home and so the have to contact customer case on 		     phone. If pincode is present then service will be booked and the stored in the database.			
	*/	
        case 'BookServiceDataCapture':
            var outcon = request.body.queryResult.outputContexts[0].parameters;
            var txt = '';
    
            firestore.collection('pincode').doc(`${outcon.pincode}`).get()
            .then((snapshot) => {
                if(snapshot.exists)

                    txt = `Choose your timings : ${snapshot.data().info}`;
                else    
                    txt = "Sorry! we can't provide service in your area our executive will contact you soon";
                throw new Error("Profile doesn't exist");
            }).catch(e => {
                console.log('error : ',e);
            })
            
            firestore.collection('bookingDetails').doc(`${outcon.serialNumber}`).set({
                serialNumber: `${outcon.serialNumber}`,
                productLine: `${outcon.productLine}`,
                name: `${outcon.name}`,
                email: `${outcon.email}`,
                phone: `${outcon.phone}`,
                address: `${outcon.address}`,
                probDesc: `${outcon.probDesc}`,
                pincode: `${outcon.pincode}`,
                service_date: ''
            }).then(() => {
                response.send({
                    fulfillmentText: txt
                })
                throw new Error("Profile doesn't exist");
            }).catch( e => {
                console.log('error : ',e);
            })

        break;
        /*
		here we accept the time chosen by the user and store it in the database 
	*/
        case 'BookServiceGetTime':
            var outcon1 = request.body.queryResult.outputContexts[0].parameters;
        
            firestore.collection('bookingDetails').doc(`${outcon1.serialNumber}`).update({
                service_date: `${outcon1.date}`
            }).then(()=>{
                response.send({
                    fulfillmentText: `Dear customer your service request has been booked for ${outcon1.date}`
                })
                throw new Error("Profile doesn't exist");
            }).catch(e =>{
                console.log('error : ',e);
            })
            
        break;

	/* 
		this is to cancel the booking. If canceled the booking will be deleted from the database and could'nt be tracked it will show service 			not booked
	*/
        case 'CancelService':
            
            firestore.collection('bookingDetails').doc(`${param.serialNumber}`).get()
            .then((snapshot) => {
                if(snapshot.exists){
                    firestore.collection('bookingDetails').doc(`${param.serialNumber}`).delete()
                    response.send({
                        fulfillmentText: `Dear customer your service request for your ${snapshot.data().productLine} has been canceled`
                    })
                }
                else{
                    response.send({
                        fulfillmentText: `Dear customer you haven't booked for any service yet`
                    })
                }
                throw new Error("Prifile doesn't exist")
            }).catch(e => {
                console.log('error: ',e);
            });

        break;

	// This is to track service booked if present in the database else it will display no service booked
        case 'TrackService':

            firestore.collection('bookingDetails').doc(`${param.serialNumber}`).get()
            .then((snapshot) => {
                if(!snapshot.exists)
                    response.send({
                        fulfillmentText: `Dear customer you haven't booked for any service yet`
                    })
                else
                    response.send({
                        fulfillmentText: `Dear customer your ${snapshot.data().productLine} will be services on ${snapshot.data().service_date}` 
                    })                    
                throw new Error("Profile doesn't exist")
            }).catch( e => {
                console.log('error : ',e);
            })

        break;

        default:
            response.send({
                fulfillmentText: "chatbot default"
            });


    }
    

});
