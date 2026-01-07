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
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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
const provider2 = new GithubAuthProvider();

// Loading overlay helpers (used on signin.js as well)
const createLoadingElements = () => {
    if (document.getElementById('loading-overlay')) return;
    const style = document.createElement('style');
    style.innerHTML = `
    #loading-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:none;align-items:center;justify-content:center;z-index:9999}
    #loading-overlay .box{background:#fff;padding:20px 28px;border-radius:8px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 18px rgba(0,0,0,0.2)}
    #loading-overlay .spinner{width:30px;height:30px;border:4px solid #e6e6e6;border-top-color:#1689d3;border-radius:50%;animation:spin 1s linear infinite}
    #loading-overlay .msg{font-family:inherit;color:#222;font-size:14px}
    @keyframes spin{to{transform:rotate(360deg)}}
    `;
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
        <div class="box">
            <div class="spinner" aria-hidden="true"></div>
            <div class="msg">Loading...</div>
        </div>
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);
}

const showLoading = (message = 'Loading...') => {
    createLoadingElements();
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    const msg = overlay.querySelector('.msg');
    if (msg) msg.textContent = message;
    overlay.style.display = 'flex';
}

const hideLoading = () => {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    overlay.style.display = 'none';
}

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
        setSignUpButtonLoading(true);
        showLoading('Creating account...');
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                // EMAIL VERIFICATION
                sendEmailVerification(user)
                    .then(() => {
                        // Email sent!
                        toast("Verification email sent. Please check your inbox.", "#1689d3", "#fff");
                        hideLoading();
                        setSignUpButtonLoading(false);
                        setTimeout(() => {
                            window.location.href = 'signin.html'
                        }, 1000)
                    });
            })
            .catch((error) => {
                hideLoading();
                setSignUpButtonLoading(false);
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

// Button loading helper for the sign-up submit button
const setSignUpButtonLoading = (isLoading, loadingText = 'Loading...') => {
    const btn = document.querySelector('.login-button[type="submit"]');
    if (!btn) return;
    if (isLoading) {
        if (!btn.dataset.originalValue) btn.dataset.originalValue = btn.value;
        btn.value = loadingText;
        btn.disabled = true;
        btn.classList.add('disabled');
    } else {
        btn.value = btn.dataset.originalValue || 'Sign Up';
        btn.disabled = false;
        btn.classList.remove('disabled');
        delete btn.dataset.originalValue;
    }
}

// GOOGLE SIGN UP
const signUpGoogle = () => {
    showLoading('Signing in with Google...');
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
            hideLoading();
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        })
        .catch((error) => {
            hideLoading();
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
    showLoading('Signing in with GitHub...');
    signInWithPopup(auth, provider2)
        .then((result) => {
            const user = result.user;
            console.log(user);
            hideLoading();
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        })
        .catch((error) => {
            hideLoading();
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