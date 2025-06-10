import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
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
const database = getDatabase(app);


const noteList = document.getElementById("note-grid");
const notesRef = ref(database, "notes");

onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    noteList.innerHTML = "";
    let hasTrash = false; // Add this flag
    if (data) {
        Object.keys(data).forEach((key) => {
            const info = data[key];
            if (info.trashed) { // Only show trashed notes
                hasTrash = true; // Set flag if at least one trashed note exists
                noteList.innerHTML += `
                    <div class="note-card">
                        <div id='note-card2'>
                            <h4>${info.noteTitle}</h4>
                            <p style='padding-bottom: 30px'>${info.note}</p>
                            ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                        </div>
                        <div id='hoverIcons'>
                            <i onclick='restoreNote("${key}")' class="bi bi-arrow-counterclockwise icons" title="Restore"></i>
                            <i onclick='deleteNoteForever("${key}")' class="bi bi-trash3 icons" title="Delete Forever"></i>
                        </div>
                    </div>
                `;
            }
        });
    }
    if (!hasTrash) {
        noteList.innerHTML = `<div class="empty-message">Trash is empty</div>`;
    }
});

// Restore note from trash
const restoreNote = (key) => {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            set(noteRef, { ...note, trashed: false });
        }
    }, { onlyOnce: true });
}

// Permanently delete note
const deleteNoteForever = (key) => {
    const noteRef = ref(database, "notes/" + key);
    remove(noteRef);
}
window.restoreNote = restoreNote
window.deleteNoteForever = deleteNoteForever