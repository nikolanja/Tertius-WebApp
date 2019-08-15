import firebase from 'firebase';

var config = {
    /*
	*/
};

var fire = firebase.initializeApp(config);
export var database = firebase.database();

export const defaultSignedUrl = "/posts";
export const defaultUrl = '/';

export var googleProvider = new firebase.auth.GoogleAuthProvider();
export default fire;
