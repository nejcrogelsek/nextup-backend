import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyD9sAUrj8uSSiGbtxJUQQorE4Wq0RNi5Hw',
	authDomain: 'nextup-auth.firebaseapp.com',
	projectId: 'nextup-auth',
	storageBucket: 'nextup-auth.appspot.com',
	messagingSenderId: '436072068719',
	appId: '1:436072068719:web:4741b7efa842f1b1e5ff9a',
	measurementId: 'G-5SLVNSV22J'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
auth.useDeviceLanguage()

export { auth }