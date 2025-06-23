// Toastify
const toast = (text, background, color) => {
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
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (userName === '' || email === '' || password === '') {
        toast("Fill the input required", "#f00", "#fff")
        return;
    }
    // PASSWORD CITERIAS
    if (!passwordRegex.test(password)) {
        toast(
            "Password must be at least 6 characters and include uppercase, lowercase, and a special character.",
            "#f00",
            "#fff"
        );
        return;
    }
    else {
        const userOBJ = {
            userName, email, password
        }
        console.log(userOBJ);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                // EMAIL VERIFICATION
                sendEmailVerification(user)
                    .then(() => {
                        // Email sent!
                        toast("Verification email sent. Please check your inbox.", "#1689d3", "#fff");
                        setTimeout(() => {
                            window.location.href = 'signin.html'
                        }, 1000)
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode, error);
                if (errorCode === 'auth/email-already-in-use') {
                    toast('Email already in use. Please use a different email.', "#f00", "#fff");
                }
                if (errorCode === 'auth/invalid-email') {
                    toast('Invalid email format. Please enter a valid email.', "#f00", "#fff");
                }
                if (errorCode === 'auth/weak-password') {
                    toast('Weak password. Please enter a stronger password.', "#f00", "#fff");
                }
                if (errorCode === 'auth/operation-not-allowed') {
                    toast('Email/password accounts are not enabled. Please enable them in Firebase console.', "#f00", "#fff");
                }
                if (errorCode === 'auth/too-many-requests') {
                    toast('Too many requests. Please try again later.', "#f00", "#fff");
                }
                if (errorCode === 'auth/user-not-found') {
                    toast('User not found.', "#f00", "#fff");
                }
                if (errorCode === 'auth/invalid-recipient-email') {
                    toast('Invalid recipient email address.', "#f00", "#fff");
                }
                if (errorCode === 'auth/network-request-failed') {
                    toast('Invalid credential.', "#f00", "#fff");
                }
            })

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
            if (errorCode === 'auth/network-request-failed') {
                toast('Invalid credential.', "#f00", "#fff");
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
            if (errorCode === 'auth/network-request-failed') {
                toast('Invalid credential.', "#f00", "#fff");
            }
        })
}

// KEY DOWN 'ENTER'
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter')
        signUpUser()

})

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