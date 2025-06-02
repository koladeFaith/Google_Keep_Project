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

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    onValue, remove
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfh8yKY_gXwzAbQ4HDt4uyKLAkNBkzhXI",
    authDomain: "keep-e986b.firebaseapp.com",
    databaseURL: "https://keep-e986b-default-rtdb.firebaseio.com",
    projectId: "keep-e986b",
    storageBucket: "keep-e986b.firebasestorage.app",
    messagingSenderId: "746391927158",
    appId: "1:746391927158:web:739393ce1bdbc3b945a257",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// SIDE BAR
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});
document.addEventListener("click", function (e) {
    if (window.innerWidth < 768 && sidebar.classList.contains("active")) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove("active");
        }
    }
});
// NOTE FOCUS
document.getElementById("noteTitle").addEventListener("focus", function () {
    document.getElementById("noteDetails").style.display = "flex";
});
// INPUT COLLAPSE
document.addEventListener("click", function (e) {
    const container = document.getElementById("noteInputCollapsible");
    if (!container.contains(e.target)) {
        document.getElementById("noteDetails").style.display = "none";
    }
});
// RELOAD ICON
document.querySelector(".bi-arrow-repeat").addEventListener("click", () => {
    window.location.reload();
});
// PROFILE MODAL
const profileIcon = document.querySelector(".profileImg");
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
profileIcon.addEventListener("click", () => {
    profileModal.classList.add("active");
    document.body.classList.add("profile-modal-active");
});

closeProfileModal.addEventListener("click", () => {
    profileModal.classList.remove("active");
    document.body.classList.remove("profile-modal-active");
});

profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
        profileModal.classList.remove("active");
        document.body.classList.remove("profile-modal-active");
    }
});
// LOG OUT
logOut.addEventListener("click", () => {
    setTimeout(() => {
        window.location = "signin.html";
    }, 1000);
});
// ONAUTHSTATECHANGED I.E USER INFO
onAuthStateChanged(auth, (user) => {
    if (user) {
        const profilePicPreview = document.getElementById("profilePicPreview");
        const profilePicPreview1 = document.getElementById("profilePicPreview1");
        const userEmail = document.getElementById("userEmail");
        const userUname = document.getElementById("userUname");
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
            window.location.href = "signin.html";
        }, 1000);
    }
});
// ADDNOTE FUNCTION
const addNote = () => {
    const note = document.getElementById("text").value;
    const noteTitle = document.getElementById("noteTitle").value;
    if (noteTitle === "" || note === "") {
        alert("Please fill in both the title and the note.");
        return;
    } else {
        // Get the current notes from the database
        let data;
        onValue(ref(database, "notes"), (snapshot) => {
            data = snapshot.val();
        });

        // DYNAMICALLY ADDING NOTE ID
        let noteId;
        if (data !== null) {
            noteId = data.length;
        } else {
            noteId = 0;
        }

        // Create a new note object and set it in the database
        const userObj = { noteTitle, note };
        console.log(userObj);
        const noteRef = ref(database, `notes/${noteId}`);
        set(noteRef, userObj);
        document.getElementById("text").value = ""
        document.getElementById("noteTitle").value = ""
    }
};
// DELETE NOTE
// const deleteNote = (index) => {
//     const deleteRef = ref(database, `notes/${index}`); // Replace with your path

//     remove(deleteRef)
//         .then(() => {
//             console.log("Data deleted successfully.");
//         })
//         .catch((error) => {
//             console.error("Error deleting data:", error);
//         });
// }

// DISPLAY NOTE ON UI
let newRef = ref(database, "notes");
const noteList = document.getElementById("note-grid")
onValue(newRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data, "NOTES");
    data
        // .filter((item) => item !== null)
        .map((info, i) => {
            noteList.innerHTML += `
                <div class="note-card">
            <h4>${info.noteTitle}</h4>
            <p>
              ${info.note}
            </p>
            <button>Delete</button>
          </div>
            `;
        });

});

window.addNote = addNote;
window.searchBar = searchBar;
window.deleteNote = deleteNote;

// const database = getDatabase(app);

// UPLOAD IMAGE PROFILE
const fileInput = document.getElementById("profilePicInput");
fileInput.addEventListener("change", function (e) {
    console.log(e.target.files[0]);
    const profilePicPreview1 = document.getElementById("profilePicPreview1");

    const url = URL.createObjectURL(e.target.files[0]);
    profilePicPreview1.src = url;
});
