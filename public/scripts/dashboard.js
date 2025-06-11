// Toastify
const toast = (text, background, color) => {
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
import {
    getDatabase,
    ref,
    set,
    onValue,
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
// Path of page
const path = window.location.pathname;
document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.href.includes(path.split('/').pop())) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
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

// DOM elements for image preview
const imageInput = document.getElementById('noteImage');
const imagePreview = document.getElementById('noteImagePreview');
const imageIcon = document.querySelector('.image-upload span');

imageIcon.addEventListener('click', function () {
    imageInput.click(); // Open file dialog when icon is clicked
});
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

let editImageRemoved = false;

removeEditImageBtn.addEventListener('click', function () {
    editNoteImagePreview.src = "";
    editNoteImagePreview.style.display = "none";
    removeEditImageBtn.style.display = "none";
    editImageRemoved = true;
});
// UPLOAD IMAGE PROFILE OR CHANGE THE PROFILE IMAGE 
const profilePicInput = document.getElementById('profilePicInput');
const profilePicPreview1 = document.getElementById('profilePicPreview1');
const profileUploadBtn = document.getElementById('profileUploadBtn');
const profileSubmitBtn = document.getElementById('profileSubmitBtn');
const profilePicForm = document.getElementById('profilePicForm');

// Open file dialog when clicking "Upload Photo"
profileUploadBtn.addEventListener('click', function (e) {
    e.preventDefault();
    profilePicInput.click();
});

// Show preview and "Submit" button when an image is selected
profilePicInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            profilePicPreview1.src = event.target.result; // Show preview
            profileUploadBtn.style.display = "none";
            profileSubmitBtn.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
    }
});

// Handle submit: save image to Firebase and reset buttons
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
                    toast("Profile picture updated!", '#42A5F5', '#fff'); // <-- Place toast here
                });
        };
        reader.readAsDataURL(file);
    }
});
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
    } else {
        setTimeout(() => {
            window.location.href = "signin.html";
        }, 1000);
    }
});
// ADDNOTE FUNCTION
const notesRef = ref(database, "notes");

const addNote = () => {
    const note = document.getElementById("text").value;
    const noteTitle = document.getElementById("noteTitle").value;
    const imageInput = document.getElementById('noteImage');
    const imageFile = imageInput.files[0];
    if (noteTitle === "" || note === "") {
        toast("Please fill in both the title and the note.", '#f00', '#fff');
        return;
    }

    const saveNote = (imageBase64 = "") => {
        const newNote = { noteTitle, note, image: imageBase64 };
        push(notesRef, newNote).then(() => {
            toast("Note added successfully!", '#42A5F5', '#fff');
            // Clear inputs
            document.getElementById("text").value = "";
            document.getElementById("noteTitle").value = "";
            imagePreview.src = "";
            imagePreview.style.display = "none";
            imageInput.value = "";
            removeNoteImageBtn.style.display = "none";
        });
    };

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
    let hasNotes = false;
    if (data) {
        Object.keys(data).forEach((key) => {
            const info = data[key];
            if (!info.trashed) {
                hasNotes = true;
                noteList.innerHTML += `
                    <div class="note-card">
                      <div id='note-card2'>
                        <h4>${info.noteTitle}</h4>
                        <p style='padding-bottom: 30px'>${info.note}</p>
                        ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                      </div>
                      <div id='hoverIcons'>
                        <i onclick='deleteNote("${key}")' class="bi bi-trash3 icons" title="Delete"></i>
                        <i onclick='editNote("${key}")' class="bi bi-pencil icons" title="Edit"></i>
                        <i onclick='archiveNote("${key}")' class="bi bi-archive icons" title="Archive"></i>
                        <i onclick='setReminder("${key}")' class="bi bi-alarm icons" title="Reminder"></i> 
                      </div>
                    </div>
                `;
            }
        });
    }
    if (!hasNotes) {
        noteList.innerHTML = `<div class="empty-message">No notes yet. Your notes will appear here.</div>`;
    }
});

// DELETE NOTE FUNCTION
const deleteNote = (key) => {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            set(noteRef, { ...note, trashed: true }).then(() => {
                toast("Note moved to trash!", '#42A5F5', '#000');
            });
        }
    }, { onlyOnce: true });
}
// EDIT NOTE FUNCTION
const editNote = (key) => {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            editIndex = key; // Save the key for saving later
            document.getElementById('editNoteTitle').value = note.noteTitle;
            document.getElementById('editNoteText').value = note.note;

            const editNoteImagePreview = document.getElementById('editNoteImagePreview');
            const removeEditImageBtn = document.getElementById('removeEditImageBtn');

            if (note.image) {
                editNoteImagePreview.src = note.image;
                editNoteImagePreview.style.display = "block";
                removeEditImageBtn.style.display = "block";
            } else {
                editNoteImagePreview.src = "";
                editNoteImagePreview.style.display = "none";
                removeEditImageBtn.style.display = "none";
            }
            editImageRemoved = false;
            noteEditModal.classList.add('active');
            mainContent.classList.add('blur-bg');
        }
    }, { onlyOnce: true });
}
// Save edited note (you need to update your notes array/database here)
document.getElementById('saveEditBtn').addEventListener('click', () => {
    const newTitle = document.getElementById('editNoteTitle').value;
    const newText = document.getElementById('editNoteText').value;
    if (newTitle === "" || newText === "") {
        toast("Edited title and note cannot be empty.", '#f00', '#fff');
        return;
    }
    const noteRef = ref(database, "notes/" + editIndex);

    // Build the note object
    const updatedNote = {
        noteTitle: newTitle,
        note: newText
    };
    if (!editImageRemoved && editNoteImagePreview.src && editNoteImagePreview.style.display !== "none") {
        updatedNote.image = editNoteImagePreview.src;
    }
    // If image is removed or not present, don't set the image property at all

    set(noteRef, updatedNote).then(() => {
        noteEditModal.classList.remove('active');
        mainContent.classList.remove('blur-bg');
        toast("Note edited successfully", '#42A5F5', '#fff');
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
        editIndex = card.getAttribute('data-key'); // Use the Firebase key!
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

// REMOVE IMAGE
const noteImageInput = document.getElementById('noteImage');
const noteImagePreview = document.getElementById('noteImagePreview');
const noteImageIcon = document.querySelector('.image-upload span');
const removeNoteImageBtn = document.getElementById('removeNoteImageBtn');

noteImageIcon.addEventListener('click', function () {
    noteImageInput.click();
});

noteImageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            noteImagePreview.src = event.target.result;
            noteImagePreview.style.display = "block";
            removeNoteImageBtn.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        noteImagePreview.src = "";
        noteImagePreview.style.display = "none";
        removeNoteImageBtn.style.display = "none";
    }
});

removeNoteImageBtn.addEventListener('click', function () {
    noteImagePreview.src = "";
    noteImagePreview.style.display = "none";
    noteImageInput.value = "";
    removeNoteImageBtn.style.display = "none";
});
// ARCHIVE NOTE
const archiveNote = (key) => {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            set(noteRef, { ...note, archived: true }).then(() => {
                toast("Note archived!", '#42A5F5', '#fff');
            });
        }
    }, { onlyOnce: true });
}
// REMINDER NOTE
const setReminder = (key) => {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            set(noteRef, { ...note, reminder: true }).then(() => {
                toast("Reminder set!", '#42A5F5', '#fff');
            });
        }
    }, { onlyOnce: true });
};

// Search note
const noteSearch = document.getElementById('noteSearch');
const noteSearchMobile = document.getElementById('noteSearchMobile');
let searchQuery = "";

function handleSearchInput(e) {
    searchQuery = e.target.value.toLowerCase();
    renderNotes();
}

if (noteSearch) {
    noteSearch.addEventListener('input', handleSearchInput);
}
if (noteSearchMobile) {
    noteSearchMobile.addEventListener('input', handleSearchInput);
}

function highlightMatch(text, query) {
    if (!query) return text;
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(safeQuery, "gi"), (match) => `<span class="search-highlight">${match}</span>`);
}

function renderNotes() {
    onValue(newRef, (snapshot) => {
        const data = snapshot.val();
        noteList.innerHTML = "";
        let hasNotes = false;
        if (data) {
            Object.keys(data).forEach((key) => {
                const info = data[key];
                if (!info.trashed) {
                    if (
                        !searchQuery ||
                        (info.noteTitle && info.noteTitle.toLowerCase().includes(searchQuery)) ||
                        (info.note && info.note.toLowerCase().includes(searchQuery))
                    ) {
                        hasNotes = true;
                        const highlightedTitle = info.noteTitle ? highlightMatch(info.noteTitle, searchQuery) : "";
                        const highlightedNote = info.note ? highlightMatch(info.note, searchQuery) : "";
                        noteList.innerHTML += `
                            <div class="note-card">
                              <div id='note-card2'>
                                <h4>${highlightedTitle}</h4>
                                <p style='padding-bottom: 30px'>${highlightedNote}</p>
                                ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                              </div>
                              <div id='hoverIcons'>
                                <i onclick='deleteNote("${key}")' class="bi bi-trash3 icons" title="Delete"></i>
                                <i onclick='editNote("${key}")' class="bi bi-pencil icons" title="Edit"></i>
                                <i onclick='archiveNote("${key}")' class="bi bi-archive icons" title="Archive"></i>
                                <i onclick='setReminder("${key}")' class="bi bi-alarm icons" title="Reminder"></i> 
                              </div>
                            </div>
                        `;
                    }
                }
            });
        }
        if (!hasNotes) {
            noteList.innerHTML = `<div class="empty-message">No notes found.</div>`;
        }
    }, { onlyOnce: true });
}

// Initial render
renderNotes();



window.addNote = addNote;
window.searchBar = searchBar;
window.deleteNote = deleteNote;
window.editNote = editNote
window.archiveNote = archiveNote;
window.setReminder = setReminder;

