import firebase from "firebase";
import "firebase/storage";
import { useHistory } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyDFuLd21L19kuAnIrUpZrS4l1OssqJBYFo",
  authDomain: "fir-auth-a8b79.firebaseapp.com",
  projectId: "fir-auth-a8b79",
  databaseURL: "gs://fir-auth-a8b79.appspot.com",
  storageBucket: "fir-auth-a8b79.appspot.com",
  messagingSenderId: "958134136709",
  appId: "1:958134136709:web:449ae5b8a5623b088b9eec",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
export const storage = firebase.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();
const isOnline = true;

const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;

    const userRoles = "renter";
    const userRef = db.doc(`users/${user.email}`);
    const snapshot = userRef.get(user.email);

    if (!snapshot.exists) {
      userRef.set({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        userRoles,
        isOnline,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithEmailAndPassword = async (email, password) => {
  // const history = useHistory();
  try {
    await auth.signInWithEmailAndPassword(email, password);

    db.collection("users").doc(email).update({
      isOnline: true,
    });
    // history.replace("/dashboard");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    if (!name) {
      alert("Please Enter Name");
    } else {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      const user = res.user;

      const userRoles = "renter";
      const userRef = db.doc(`users/${email}`);
      const snapshot = userRef.get(email);

      if (!snapshot.exists) {
        userRef.set({
          uid: user.uid,
          name,
          authProvider: "local",
          email,
          userRoles,
          isOnline,
        });
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  auth.signOut();
};

export {
  auth,
  db,
  signInWithGoogle,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
};
export default firebase;
