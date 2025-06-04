// Toastify
const toast = (text, background, color) => {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
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
    onValue, remove,
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
// SEARCH BAR
function searchBar() {
    const searchBar2 = document.getElementById('searchBar2');
    // Toggle visibility
    if (searchBar2.style.display === "none" || searchBar2.style.display === "") {
        searchBar2.style.display = "block";
        // Optionally focus the input
        const input = searchBar2.querySelector('input');
        if (input) input.focus();
    } else {
        searchBar2.style.display = "none";
    }
}
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
// INPUT IMAGE

// NOTE FOCUS
window.onload = function () {
    const notesLink = document.querySelector('a[href="#"] i.bi-journal-text').parentElement;
    if (notesLink) {
        notesLink.classList.add('active');
    }
};
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
    const imageInput = document.getElementById('noteImage')
    const imageFile = imageInput.files[0];
    if (noteTitle === "" || note === "") {
        toast("Please fill in both the title and the note.", '#f00', '#fff');
        return;
    }
    const imagePreview = document.getElementById('noteImagePreview');

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = "";
            imagePreview.style.display = "none";
        }
    });
    // Function to actually add the note (with or without image)
    const saveNote = (imageBase64 = "") => {
        const notesRef = ref(database, "notes");
        onValue(notesRef, (snapshot) => {
            let notesArr = snapshot.val() || [];
            if (!Array.isArray(notesArr)) {
                notesArr = Object.values(notesArr);
            }
            notesArr.push({ noteTitle, note, image: imageBase64 });
            set(notesRef, notesArr);
            // Clear inputs
            document.getElementById("text").value = "";
            document.getElementById("noteTitle").value = "";
            imagePreview.src = "";
            imagePreview.style.display = "none";
            imageInput.value = "";
        }, { onlyOnce: true });
    };
    // If image is selected, read as Base64, then save
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64String = event.target.result;
            saveNote(base64String);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveNote();
    }

};


// DISPLAY NOTE ON UI
let newRef = ref(database, "notes");
const noteList = document.getElementById("note-grid")
onValue(newRef, (snapshot) => {
    const data = snapshot.val();
    noteList.innerHTML = "";
    if (data) {
        data.map((info, i) => {
            noteList.innerHTML += `
                <div class="note-card">
                  <div id='note-card2'>
                    <h4>${info.noteTitle}</h4>
                    <p style='padding-bottom: 30px'>${info.note}</p>
                    ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                    </div>
                   <div id='hoverIcons'>
                    <i onclick='deleteNote(${i})' class="bi bi-trash3 icons"></i>
                    <i onclick='editNote(${i})' class="bi bi-pencil icons" ></i>
                    <i class="bi bi-archive icons"></i>
                    <i class="bi bi-alarm icons"></i> 
                  </div>
                </div>
            `;
        });
    }
});

// DELETE NOTE FUNCTION
const deleteNote = (index) => {
    const notesRef = ref(database, "notes");
    onValue(notesRef, (snapshot) => {
        let notesArr = snapshot.val() || [];
        if (!Array.isArray(notesArr)) {
            notesArr = Object.values(notesArr);
        }
        notesArr.splice(index, 1); // Remove the note at the given index
        set(notesRef, notesArr);   // Update the database
    }, { onlyOnce: true });
}
// EDIT NOTE FUNCTION
const editNote = (index) => {
    // Get notes from database
    const notesRef = ref(database, "notes");
    onValue(notesRef, (snapshot) => {
        let notesArr = snapshot.val() || [];
        if (!Array.isArray(notesArr)) {
            notesArr = Object.values(notesArr);
        }
        const note = notesArr[index];
        if (note) {
            editIndex = index;
            document.getElementById('editNoteTitle').value = note.noteTitle;
            document.getElementById('editNoteText').value = note.note;
            noteEditModal.classList.add('active');
            mainContent.classList.add('blur-bg');
        }
    }, { onlyOnce: true });
}
// UPLOAD IMAGE PROFILE
const fileInput = document.getElementById("profilePicInput");
fileInput.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const base64String = event.target.result;

        // Save to Firebase Realtime Database
        firebase.database().ref('users/faith/profilePic').set(base64String);
    };

    reader.readAsDataURL(file); // Converts to Base64
    firebase.database().ref('users/faith/profilePic').once('value')
        .then((snapshot) => {
            const base64Image = snapshot.val();
            if (base64Image) {
                document.getElementById('profile-pic').src = base64Image;
            }
        });
});
// EDIT NOTE AND FOCUS MODAL
const noteGrid = document.getElementById('note-grid');
const noteEditModal = document.getElementById('noteEditModal');
const closeEditModal = document.getElementById('closeEditModal');
const mainContent = document.querySelector('.body');
let editIndex = null;

// Show modal and blur background when a note is clicked
noteGrid.addEventListener('click', function (e) {
    // If the click is on an icon or inside #hoverIcons, do nothing
    if (
        e.target.classList.contains('icons') ||
        e.target.closest('#hoverIcons')
    ) {
        return; // Don't open the edit modal
    }

    // Find the note-card and its index
    const card = e.target.closest('.note-card');
    if (card) {
        editIndex = Array.from(noteGrid.children).indexOf(card);
        const title = card.querySelector('h4').textContent;
        const text = card.querySelector('p').textContent;
        document.getElementById('editNoteTitle').value = title;
        document.getElementById('editNoteText').value = text;
        noteEditModal.classList.add('active');
        mainContent.classList.add('blur-bg');
    }
});
// Close modal and remove blur
closeEditModal.addEventListener('click', () => {
    noteEditModal.classList.remove('active');
    mainContent.classList.remove('blur-bg');
});
// Close modal when clicking outside modal content
noteEditModal.addEventListener('click', (e) => {
    if (e.target === noteEditModal) {
        noteEditModal.classList.remove('active');
        mainContent.classList.remove('blur-bg');
    }
});
// Save edited note (you need to update your notes array/database here)
document.getElementById('saveEditBtn').addEventListener('click', () => {
    // Get new values
    const newTitle = document.getElementById('editNoteTitle').value;
    const newText = document.getElementById('editNoteText').value;
    if (newTitle === "" || newTitle === "") {
        toast("Edited title and note cannot be empty.", '#f00', '#fff');
        return;
    }
    // TODO: Update your notes array/database at editIndex
    // After saving:
    const notesRef = ref(database, "notes");
    onValue(notesRef, (snapshot) => {
        let notesArr = snapshot.val() || [];
        if (!Array.isArray(notesArr)) {
            notesArr = Object.values(notesArr);
        }
        // Update the note at editIndex
        notesArr[editIndex] = { noteTitle: newTitle, note: newText };
        set(notesRef, notesArr);

        noteEditModal.classList.remove('active');
        mainContent.classList.remove('blur-bg');
    }, { onlyOnce: true });
    toast("Note edited sucessfully", '#006400', '#fff');

});





window.addNote = addNote;
window.searchBar = searchBar;
window.deleteNote = deleteNote;
window.editNote = editNote