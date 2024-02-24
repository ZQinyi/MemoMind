document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/notes')
        .then(response => response.json())
        .then(response => { // Make sure to process the `data` attribute of the response
            const notes = response.data; // Access the data array
            const container = document.getElementById('notesContainer');
            notes.forEach(note => {
                const card = document.createElement('div');
                card.className = 'note-card';
                const title = document.createElement('div');
                title.className = 'note-title';
                title.textContent = note.title;
                const content = document.createElement('div');
                content.className = 'note-content';
                content.textContent = note.content;
                card.appendChild(title);
                card.appendChild(content);
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
});

