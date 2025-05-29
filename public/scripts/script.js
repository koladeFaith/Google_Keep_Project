// Toastify
const toastify = (text, background, color) => {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: background,
            color: color,
        },
        onClick: function () { } // Callback after click
    }).showToast();
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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

// SIGN UP
const signUpUser = () => {
    const userName = document.getElementById('uName').value
    const email = document.getElementById('mail').value
    const password = document.getElementById('pass').value

    if (userName === '' || email === '' || password === '') {
        alert("Fill the input required")
        toastify("Fill the input required", "#f00", "#fff")

    } else {
        const userOBJ = {
            userName, email, password
        }
        console.log(userOBJ);


    }
}

// GOOGLE SIGN UP
const signUpGoogle = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        })
        .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode, error);
            if (errorCode === 'auth/account-exists-with-different-credential') {
                toastify('Another sign up provider has been used for this mail', "#f00", "#fff");
            }
            if (errorCode === 'auth/popup-closed-by-user') {
                toastify('The sign-in popup was closed before completing the sign in.', "#f00", "#fff");
            }
            if (errorCode === 'auth/cancelled-popup-request') {
                toastify('Popup sign in was canceled because another popup was opened.', "#f00", "#fff");
            }
            if (errorCode === 'auth/popup-blocked') {
                toastify('The browser blocked the sign-in popup. Please allow popups and try again.', "#f00", "#fff");
            }
            if (errorCode === 'auth/operation-not-allowed') {
                toastify('Google sign-in is not enabled in your Firebase project.', "#f00", "#fff");
            }
            if (errorCode === 'auth/unauthorized-domain') {
                toastify('This domain is not authorized for OAuth operations.', "#f00", "#fff");
            }
            if (errorCode === 'auth/network-request-failed') {
                toastify('Network error. Please check your connection and try again.', "#f00", "#fff");
            }
            if (errorCode === 'auth/invalid-credential') {
                toastify('The credential received is malformed or has expired.', "#f00", "#fff");
            }
        })
}

// GITHUB SIGN UP
const signUpGithub = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        })
        .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode, error);
            if (errorCode === 'auth/account-exists-with-different-credential') {
                toastify('Another sign up provider has been used for this mail', "#f00", "#fff");
            }
            if (errorCode === 'auth/popup-closed-by-user') {
                toastify('The sign-in popup was closed before completing the sign in.', "#f00", "#fff");
            }
            if (errorCode === 'auth/cancelled-popup-request') {
                toastify('Popup sign in was canceled because another popup was opened.', "#f00", "#fff");
            }
            if (errorCode === 'auth/popup-blocked') {
                toastify('The browser blocked the sign-in popup. Please allow popups and try again.', "#f00", "#fff");
            }
            if (errorCode === 'auth/operation-not-allowed') {
                toastify('Google sign-in is not enabled in your Firebase project.', "#f00", "#fff");
            }
            if (errorCode === 'auth/unauthorized-domain') {
                toastify('This domain is not authorized for OAuth operations.', "#f00", "#fff");
            }
            if (errorCode === 'auth/network-request-failed') {
                toastify('Network error. Please check your connection and try again.', "#f00", "#fff");
            }
            if (errorCode === 'auth/invalid-credential') {
                toastify('The credential received is malformed or has expired.', "#f00", "#fff");
            }
        })
}


window.signUpUser = signUpUser
window.signUpGoogle = signUpGoogle
window.signUpGithub = signUpGithub
// Show/Hide Password
const password = document.getElementById('pass')
const show = document.querySelector("#show")
show.addEventListener("click", () => {
    if (password.getAttribute("type") === "password") {
        password.setAttribute("type", "text")
        show.classList.replace("bi-eye", "bi-eye-slash")
    } else {
        password.setAttribute("type", "password")
        show.classList.replace("bi-eye-slash", "bi-eye")

    }
})