import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

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
const database = getDatabase(app);




const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
document.addEventListener('click', function (e) {
    if (window.innerWidth < 768 && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('active');
        }
    }
});
document.getElementById('noteTitle').addEventListener('focus', function () {
    document.getElementById('noteDetails').style.display = 'flex';
});

document.getElementById('noteTitle').addEventListener('focus', function () {
    document.getElementById('noteDetails').style.display = 'flex';
});
document.addEventListener('click', function (e) {
    const container = document.getElementById('noteInputCollapsible');
    if (!container.contains(e.target)) {
        document.getElementById('noteDetails').style.display = 'none';
    }
});
const searchBar = () => {
    searchBar2.style.display = 'flex';
}
document.querySelector('.bi-arrow-repeat').addEventListener('click', () => {
    window.location.reload();
});
const profileIcon = document.querySelector('.profileImg');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const mainContent = document.getElementById('mainContent');

profileIcon.addEventListener('click', () => {
    profileModal.classList.add('active');
    document.body.classList.add('profile-modal-active');
});

closeProfileModal.addEventListener('click', () => {
    profileModal.classList.remove('active');
    document.body.classList.remove('profile-modal-active');
});

profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.remove('active');
        document.body.classList.remove('profile-modal-active');
    }
});
logOut.addEventListener('click', () => {
    setTimeout(() => {
        window.location = 'signin.html'
    }, 1000)
})
onAuthStateChanged(auth, (user) => {
    if (user) {
        const profilePicPreview = document.getElementById('profilePicPreview');
        const profilePicPreview1 = document.getElementById('profilePicPreview1');
        const userEmail = document.getElementById('userEmail');
        const userUname = document.getElementById('userUname');
        console.log(user);
        if (userEmail) {
            userEmail.textContent = user.email;
        }
        if (userUname) {
            userUname.textContent = user.displayName;
        }
        if (user.photoURL && profilePicPreview) {
            profilePicPreview.src = user.photoURL;
            profilePicPreview1.src = user.photoURL;
        }
    } else {
        setTimeout(() => {
            window.location.href = "signin.html"
        }, 1000)
    }
});








const addNote = () => {
    const note = document.getElementById('text').value
    const noteTitle = document.getElementById('noteTitle').value
    if (noteTitle === '' || note === '') {
        alert('working')
    } else {
        const userObj = { noteTitle, note }
        console.log(userObj);
        const noteRef = ref(database, 'notes/1');
        set(noteRef, userObj)
    }

}









window.addNote = addNote
window.searchBar = searchBar

// const database = getDatabase(app);


// UPLOAD IMAGE PROFILE
const fileInput = document.getElementById("profilePicInput")

fileInput.addEventListener("change", function (e) {
    console.log(e.target.files[0]);
    const profilePicPreview1 = document.getElementById('profilePicPreview1');

    const url = URL.createObjectURL(e.target.files[0]);
    profilePicPreview1.src = url

})