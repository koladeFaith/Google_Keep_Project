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
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHuPoJHhLK2ilNWZVL6hWgFpp66-PY8nI",
    authDomain: "keep-5faf9.firebaseapp.com",
    projectId: "keep-5faf9",
    storageBucket: "keep-5faf9.firebasestorage.app",
    messagingSenderId: "438049806599",
    appId: "1:438049806599:web:220c1b6b558def152a0da2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// SIGN IN USER
const signInUser = () => {
    const email = document.getElementById('mail').value
    const password = document.getElementById('pass').value
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (email === '' || password === '') {
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
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                localStorage.setItem('user', JSON.stringify(user));
                if (user.emailVerified) {
                    toast("Signed in successfully", "#006400", "#fff")
                    user ? setTimeout(() => {
                        window.location.href = 'dashboard.html'
                    }, 1000) : window.location.href = 'index.html'
                    localStorage.setItem("userCredential", JSON.stringify(user))
                } else {
                    toast("Please verify your email before signing in.", "#f00", "#fff");
                    // Optionally, resend verification email
                    sendEmailVerification(user);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                if (errorCode === 'auth/wrong-password') {
                    toast('Wrong password.', "#f00", "#fff");
                }
                if (errorCode === 'auth/user-not-found') {
                    toast('User not found.', "#f00", "#fff");
                }
                if (errorCode === 'auth/invalid-email') {
                    toast('Invalid email.', "#f00", "#fff");
                }
                if (errorCode === 'auth/invalid-recipient-email') {
                    toast('Invalid recipient email address.', "#f00", "#fff");
                }
                if (errorCode === 'auth/too-many-requests') {
                    toast('Too many requests. Try again later.', "#f00", "#fff");
                }
                if (errorCode === 'auth/operation-not-allowed') {
                    toast('Operation not allowed.', "#f00", "#fff");
                }
                if (errorCode === 'auth/weak-password') {
                    toast('Weak password.', "#f00", "#fff");
                }
                if (errorCode === 'auth/invalid-credential') {
                    toast('Invalid credential.', "#f00", "#fff");
                }
                if (errorCode === 'auth/network-request-failed') {
                    toast('Invalid credential.', "#f00", "#fff");
                }
            });
    }
}

// GOOGLE SIGN UP
const signInGoogle = () => {
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
const signInGithub = () => {
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


window.signInUser = signInUser
window.signInGoogle = signInGoogle
window.signInGithub = signInGithub

// KEYDOWN 'ENTER'
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter')
        signInUser()

})

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
