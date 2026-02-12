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

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHuPoJHhLK2ilNWZVL6hWgFpp66-PY8nI",
    authDomain: "keep-5faf9.firebaseapp.com",
    databaseURL: "https://keep-5faf9-default-rtdb.firebaseio.com",
    projectId: "keep-5faf9",
    storageBucket: "keep-5faf9.firebasestorage.app",
    messagingSenderId: "438049806599",
    appId: "1:438049806599:web:220c1b6b558def152a0da2"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ...existing Firebase imports and config...

// === SIDEBAR TOGGLE ===
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}
document.addEventListener("click", function (e) {
    if (window.innerWidth < 768 && sidebar && sidebar.classList.contains("active")) {
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
const _reloadBtn = document.querySelector(".bi-arrow-repeat");
if (_reloadBtn) _reloadBtn.addEventListener("click", () => { window.location.reload(); });

// === PROFILE MODAL ===
const profileIcon = document.querySelector(".profileImg");
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
if (profileIcon && profileModal) {
    profileIcon.addEventListener("click", () => {
        profileModal.classList.add("active");
        document.body.classList.add("profile-modal-active");
    });
}
if (closeProfileModal && profileModal) {
    closeProfileModal.addEventListener("click", () => {
        profileModal.classList.remove("active");
        document.body.classList.remove("profile-modal-active");
    });
}
if (profileModal) {
    profileModal.addEventListener("click", (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove("active");
            document.body.classList.remove("profile-modal-active");
        }
    });
}

// === PROFILE IMAGE UPLOAD ===
const profilePicInput = document.getElementById('profilePicInput');
const profilePicPreview1 = document.getElementById('profilePicPreview1');
const profileUploadBtn = document.getElementById('profileUploadBtn');
const profileSubmitBtn = document.getElementById('profileSubmitBtn');
const profilePicForm = document.getElementById('profilePicForm');

if (profileUploadBtn && profilePicInput) {
    profileUploadBtn.addEventListener('click', function (e) {
        e.preventDefault();
        profilePicInput.click();
    });
}
if (profilePicInput) {
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
}
if (profilePicForm && profilePicInput) {
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
}

// === LOGOUT ===
const _logOut = document.getElementById("logOut");
if (_logOut) {
    _logOut.addEventListener("click", () => {
        setTimeout(() => { window.location = "signin.html"; }, 1000);
    });
}

// === USER INFO ===
onAuthStateChanged(auth, (user) => {
    if (user) {
        const profilePicPreview = document.getElementById("profilePicPreview");
        const profilePicPreview1 = document.getElementById("profilePicPreview1");
        const userEmail = document.getElementById("userEmail");
        const userUname = document.getElementById("userUname");
        if (userEmail) userEmail.textContent = user.email;
        if (userUname) userUname.textContent = user.displayName;

        // Always load the profile picture from the database
        const userPicRef = ref(database, 'users/' + user.uid + '/profilePic');
        onValue(userPicRef, (snapshot) => {
            const pic = snapshot.val();
            if (pic) {
                if (profilePicPreview) profilePicPreview.src = pic;
                if (profilePicPreview1) profilePicPreview1.src = pic;
            }
        });

        const reminderList = document.getElementById("archive-grid");
        const notesRef = ref(database, "notes/" + user.uid);
        let searchQuery = "";

        function highlightMatch(text, query) {
            if (!query) return text;
            const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return text.replace(new RegExp(safeQuery, "gi"), (match) => `<span class="search-highlight">${match}</span>`);
        }

        function renderReminderNotes() {
            onValue(notesRef, (snapshot) => {
                const data = snapshot.val();
                reminderList.innerHTML = "";
                let hasReminder = false;
                if (data) {
                    Object.keys(data).forEach((key) => {
                        const info = data[key];
                        if (info.reminder) {
                            if (
                                !searchQuery ||
                                (info.noteTitle && info.noteTitle.toLowerCase().includes(searchQuery)) ||
                                (info.note && info.note.toLowerCase().includes(searchQuery))
                            ) {
                                hasReminder = true;
                                const highlightedTitle = info.noteTitle ? highlightMatch(info.noteTitle, searchQuery) : "";
                                const highlightedNote = info.note ? highlightMatch(info.note, searchQuery) : "";
                                reminderList.innerHTML += `
                                    <div class="note-card">
                                        <div id='note-card2'>
                                            <h4>${highlightedTitle}</h4>
                                            <p style='padding-bottom: 30px'>${highlightedNote}</p>
                                            ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                                        </div>
                                        <div id='hoverIcons'>
                                            <i onclick='removeReminder("${key}")' class="bi bi-alarm icons" title="Remove Reminder"></i>
                                            <i onclick='deleteNoteForever("${key}")' class="bi bi-trash3 icons" title="Delete Forever"></i>
                                        </div>
                                    </div>
                                `;
                            }
                        }
                    });
                }
                if (!hasReminder) {
                    reminderList.innerHTML = `<div class="empty-message">Reminders will show here</div>`;
                }
            });
        }

        // Search input
        const noteSearch = document.getElementById('noteSearch');
        if (noteSearch) {
            noteSearch.addEventListener('input', function () {
                searchQuery = this.value.toLowerCase();
                renderReminderNotes();
            });
        }

        // Remove reminder note
        window.removeReminder = (key) => {
            const noteRef = ref(database, "notes/" + user.uid + "/" + key);
            onValue(noteRef, (snapshot) => {
                const note = snapshot.val();
                if (note) {
                    set(noteRef, { ...note, reminder: false }).then(() => {
                        toast("Reminder removed!", '#42A5F5', '#fff');
                        renderReminderNotes();
                    });
                }
            }, { onlyOnce: true });
        };

        // Permanently delete note from reminders
        window.deleteNoteForever = (key) => {
            const noteRef = ref(database, "notes/" + user.uid + "/" + key);
            remove(noteRef).then(() => {
                toast("Note deleted permanently", '#42A5F5', '#fff');
                renderReminderNotes();
            }).catch(() => {
                toast("Error deleting note", '#f00', '#fff');
            });
        };

        // Initial render
        renderReminderNotes();
    } else {
        setTimeout(() => {
            window.location.href = "signin.html";
        }, 1000);
    }
});

window.searchBar = searchBar;

