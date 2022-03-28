import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/storage';
import envs from '../../config/env.js'
// Initialize Firebase

var config = {
    apiKey: envs.FB_API_KEY,
    authDomain: envs.FB_AUTH_DOMAIN,
    databaseURL: envs.FB_DATABASE_URL,
    projectId: envs.FB_PROJECT_ID,
    storageBucket: envs.FB_STORAGE_BUCKET,
    messagingSenderId: envs.FB_MESSAGING_SENDER
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
 }else {
    firebase.app(); // if already initialized, use this
 }
const Firebase=firebase;
export default Firebase;