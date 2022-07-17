import firebase from 'firebase/compat/app'

import 'firebase/compat/firestore'
import 'firebase/compat/auth'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBpIA1hO1fmomjxcDYzBxwfQ7VDiu1NYnc",
	authDomain: "vacation-manager-7e403.firebaseapp.com",
	projectId: "vacation-manager-7e403",
	storageBucket: "vacation-manager-7e403.appspot.com",
	messagingSenderId: "816150621806",
	appId: "1:816150621806:web:1a27cca5ab70fc1a64007f",
	measurementId: "G-SH6NJ2J8MP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Firestore Service
const firestore = firebase.firestore()

// Initialize Authentication Service
const auth = firebase.auth()

export {
	firestore,
	auth
}