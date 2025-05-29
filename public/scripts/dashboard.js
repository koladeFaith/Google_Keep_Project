const addBtn = document.getElementById('addNote');
const notesContainer = document.getElementById('notesContainer');
const noteText = document.getElementById('noteText');
const noteImage = document.getElementById('noteImage');

let notes = JSON.parse(localStorage.getItem('keepNotes')) || [];

function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'note-card';

        const text = document.createElement('p');
        text.textContent = note.text;
        card.appendChild(text);

        if (note.image) {
            const img = document.createElement('img');
            img.src = note.image;
            card.appendChild(img);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => {
            notes.splice(index, 1);
            updateLocalStorage();
            renderNotes();
        };

        card.appendChild(deleteBtn);
        notesContainer.appendChild(card);
    });
}

function updateLocalStorage() {
    localStorage.setItem('keepNotes', JSON.stringify(notes));
}

addBtn.addEventListener('click', () => {
    const text = noteText.value.trim();
    const file = noteImage.files[0];

    if (!text && !file) return;

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            notes.unshift({
                text,
                image: e.target.result
            });
            updateLocalStorage();
            renderNotes();
            noteText.value = '';
            noteImage.value = '';
        };
        reader.readAsDataURL(file);
    } else {
        notes.unshift({
            text,
            image: null
        });
        updateLocalStorage();
        renderNotes();
        noteText.value = '';
        noteImage.value = '';
    }
});

renderNotes();
