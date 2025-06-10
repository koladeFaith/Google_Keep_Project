import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

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

const archiveList = document.getElementById("archive-grid");
const notesRef = ref(database, "notes");

onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    archiveList.innerHTML = "";
    let hasArchive = false;
    if (data) {
        Object.keys(data).forEach((key) => {
            const info = data[key];
            if (info.archived) {
                hasArchive = true;
                archiveList.innerHTML += `
                    <div class="note-card">
                        <h4>${info.noteTitle}</h4>
                        <p>${info.note}</p>
                        ${info.image ? `<img src="${info.image}" alt="Note Image" style="max-width:100%;margin-top:10px;border-radius:8px;">` : ""}
                    </div>
                `;
            }
        });
    }
    if (!hasArchive) {
        archiveList.innerHTML = `<div class="empty-message">Archive note will show here</div>`;
    }
});