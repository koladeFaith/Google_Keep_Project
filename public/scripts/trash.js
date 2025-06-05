import { ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { database } from "./firebase-config.js"; // adjust path if needed

const noteList = document.getElementById("note-grid");
const notesRef = ref(database, "notes");

onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    noteList.innerHTML = "";
    if (data) {
        Object.keys(data).forEach((key) => {
            const info = data[key];
            if (info.trashed) { // Only show trashed notes
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
});

// Restore note from trash
window.restoreNote = function (key) {
    const noteRef = ref(database, "notes/" + key);
    onValue(noteRef, (snapshot) => {
        const note = snapshot.val();
        if (note) {
            set(noteRef, { ...note, trashed: false });
        }
    }, { onlyOnce: true });
}

// Permanently delete note
window.deleteNoteForever = function (key) {
    const noteRef = ref(database, "notes/" + key);
    remove(noteRef);
}