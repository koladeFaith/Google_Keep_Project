// Toastify
const toast = (text, background = '#42A5F5', color) => {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
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
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ...existing Firebase imports and config...

// === SIDEBAR TOGGLE ===
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

// === SIDEBAR ACTIVE LINK ===
const path = window.location.pathname;
document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.href.includes(path.split('/').pop())) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// === SEARCH BAR TOGGLE ===
function searchBar() {
    const searchBar2 = document.getElementById('searchBar2');
    if (searchBar2.style.display === "none" || searchBar2.style.display === "") {
        searchBar2.style.display = "block";
        const input = searchBar2.querySelector('input');
        if (input) input.focus();
    } else {
        searchBar2.style.display = "none";
    }
}
// RELOAD ICON
document.querySelector(".bi-arrow-repeat").addEventListener("click", () => {
    window.location.reload();
});

// === PROFILE MODAL ===
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

// === PROFILE IMAGE UPLOAD ===
const profilePicInput = document.getElementById('profilePicInput');
const profilePicPreview1 = document.getElementById('profilePicPreview1');
const profileUploadBtn = document.getElementById('profileUploadBtn');
const profileSubmitBtn = document.getElementById('profileSubmitBtn');
const profilePicForm = document.getElementById('profilePicForm');

profileUploadBtn.addEventListener('click', function (e) {
    e.preventDefault();
    profilePicInput.click();
});
profilePicInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            profilePicPreview1.src = event.target.result;
            profileUploadBtn.style.display = "none";
            profileSubmitBtn.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
    }
});
profilePicForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const file = profilePicInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64String = event.target.result;
            set(ref(database, 'users/' + auth.currentUser.uid + '/profilePic'), base64String)
                .then(() => {
                    profileUploadBtn.style.display = "inline-block";
                    profileSubmitBtn.style.display = "none";
                    toast("Profile picture updated!", '#42A5F5', '#fff');
                });
        };
        reader.readAsDataURL(file);
    }
});

// === LOGOUT ===
const logOut = document.getElementById("logOut");
logOut.addEventListener("click", () => {
    setTimeout(() => {
        window.location = "signin.html";
    }, 1000);
});

// === USER INFO ===
onAuthStateChanged(auth, (user) => {
    if (user) {
        const profilePicPreview = document.getElementById("profilePicPreview");
        const profilePicPreview1 = document.getElementById("profilePicPreview1");
        const userEmail = document.getElementById("userEmail");
        const userUname = document.getElementById("userUname");
        if (userEmail) userEmail.textContent = user.email;
        if (userUname) userUname.textContent = user.displayName;
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


const archiveList = document.getElementById("archive-grid");
const notesRef = ref(database, "notes");

onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data); 
    archiveList.innerHTML = "";
    let hasArchive = false;
    if (data) {
        Object.keys(data).forEach((key) => {
            const info = data[key];
            if (info.archived) {
                hasArchive = true;
                archiveList.innerHTML += `
               <div class="note-card">
                        <div id='note-card2'>
                            <h4>${info.noteTitle}</h4>
                            <p style='padding-bottom: 30px'>${info.note}</p>
                            ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                        </div>
                        <div id='hoverIcons'>
                            <i onclick='unarchiveNote("${key}")' class="bi bi-arrow-counterclockwise icons" title="Unarchive"></i>
                            <i onclick='deleteNoteForever("${key}")' class="bi bi-trash3 icons" title="Delete Forever"></i>
                        </div>
                    </div>
            `;
            }
        });
    }
    if (!hasArchive) {
        archiveList.innerHTML = `<div class="empty-message">Archive note will show here</div>`;
    }
});
// Unarchive note
const unarchiveNote = (key) => {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            set(noteRef, { ...note, archived: false }).then(() => {
                toast("Note unarchived!", '#42A5F5', '#fff');
            });
        }
    }, { onlyOnce: true });
}

// Permanently delete note from archive
const deleteNoteForever = (key) => {
    const noteRef = ref(database, "notes/" + key);
    remove(noteRef).then(() => {
        toast("Note deleted permanently", '#42A5F5', '#fff');
    }).catch(() => {
        toast("Error deleting note", '#f00', '#fff');
    });
}
// Search note
const noteSearch = document.getElementById('noteSearch');
let searchQuery = "";

if (noteSearch) {
    noteSearch.addEventListener('input', function () {
        searchQuery = this.value.toLowerCase();
        renderArchiveNotes();
    });
}

function highlightMatch(text, query) {
    if (!query) return text;
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(safeQuery, "gi"), (match) => `<span class="search-highlight">${match}</span>`);
}

function renderArchiveNotes() {
    onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        archiveList.innerHTML = "";
        let hasArchive = false;
        if (data) {
            Object.keys(data).forEach((key) => {
                const info = data[key];
                if (info.archived) {
                    if (
                        !searchQuery ||
                        (info.noteTitle && info.noteTitle.toLowerCase().includes(searchQuery)) ||
                        (info.note && info.note.toLowerCase().includes(searchQuery))
                    ) {
                        hasArchive = true;
                        const highlightedTitle = info.noteTitle ? highlightMatch(info.noteTitle, searchQuery) : "";
                        const highlightedNote = info.note ? highlightMatch(info.note, searchQuery) : "";
                        archiveList.innerHTML += `
                            <div class="note-card">
                                <div id='note-card2'>
                                    <h4>${highlightedTitle}</h4>
                                    <p style='padding-bottom: 30px'>${highlightedNote}</p>
                                    ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                                </div>
                                <div id='hoverIcons'>
                                    <i onclick='unarchiveNote("${key}")' class="bi bi-arrow-counterclockwise icons" title="Unarchive"></i>
                                    <i onclick='deleteNoteForever("${key}")' class="bi bi-trash3 icons" title="Delete Forever"></i>
                                </div>
                            </div>
                        `;
                    }
                }
            });
        }
        if (!hasArchive) {
            archiveList.innerHTML = `<div class="empty-message">Archive note will show here</div>`;
        }
    }, { onlyOnce: true });
}

// Initial render
renderArchiveNotes();

window.searchBar = searchBar;
window.unarchiveNote = unarchiveNote;
window.deleteNoteForever = deleteNoteForever;