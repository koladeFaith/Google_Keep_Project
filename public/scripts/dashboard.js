import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfh8yKY_gXwzAbQ4HDt4uyKLAkNBkzhXI",
    authDomain: "keep-e986b.firebaseapp.com",
    databaseURL: "https://keep-e986b-default-rtdb.firebaseio.com",
    projectId: "keep-e986b",
    storageBucket: "keep-e986b.firebasestorage.app",
    messagingSenderId: "746391927158",
    appId: "1:746391927158:web:739393ce1bdbc3b945a257"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const addNote = () => {
    const note = document.getElementById('text').value
    if (note === '') {
        alert('working')
    } else {
        
        show.innerHTML +=``
    }
}









window.addNote = addNote