import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { database } from "./firebase-config.js"; // adjust path if needed

const noteList = document.getElementById("note-grid");
const notesRef = ref(database, "notes");

onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    noteList.innerHTML = "";
    if (data) {
        data.forEach((info, i) => {
            if (info.trashed) { // Only show trashed notes
                noteList.innerHTML += `
                    <div class="note-card">
                        <div id='note-card2'>
                            <h4>${info.noteTitle}</h4>
                            <p style='padding-bottom: 30px'>${info.note}</p>
                            ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                        </div>
                        <div id='hoverIcons'>
                            <i onclick='restoreNote(${i})' class="bi bi-arrow-counterclockwise icons" title="Restore"></i>
                            <i onclick='deleteNoteForever(${i})' class="bi bi-trash3 icons" title="Delete Forever"></i>
                        </div>
                    </div>
                `;
            }
        });
    }
});

// Restore note from trash
window.restoreNote = function (index) {
    onValue(notesRef, (snapshot) => {
        let notesArr = snapshot.val() || [];
        if (!Array.isArray(notesArr)) notesArr = Object.values(notesArr);
        if (notesArr[index]) {
            notesArr[index].trashed = false;
            set(notesRef, notesArr);
        }
    }, { onlyOnce: true });
}

// Permanently delete note
window.deleteNoteForever = function (index) {
    onValue(notesRef, (snapshot) => {
        let notesArr = snapshot.val() || [];
        if (!Array.isArray(notesArr)) notesArr = Object.values(notesArr);
        notesArr.splice(index, 1);
        set(notesRef, notesArr);
    }, { onlyOnce: true });
}