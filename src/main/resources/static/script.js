// Debounce function to prevent excessive executions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// Fetch user ID from the data attribute
function getUserIdFromPath() {
    const userId = document.getElementById('memoApp').getAttribute('data-userid');
    console.log("Fetched userId:", userId); // Debug output
    return userId;
}

// Fetch and display notes for the user
function fetchNotes(userId) {
    fetch(`/api/${userId}/notes`)
        .then(response => response.json())
        .then(result => {
            const sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = '<div class="sidebar-header">MemoMind<button id="addNoteBtn">+</button></div>';
            result.data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.innerHTML = `
                    <button class="delete-note-btn" onclick="deleteNote(${note.id}, '${userId}')">-</button>
                    <span class="note-title" data-id="${note.id}">${note.title}</span>
                `;
                sidebar.appendChild(noteElement);

                // Apply debounce to auto-save functionality
                noteElement.querySelector('.note-title').addEventListener('click', function() {
                    const contentArea = document.getElementById('content');
                    contentArea.innerHTML = `
                        <input id="editTitle" class="editTitle" value="${note.title}" />
                        <textarea id="editContent" class="editable">${note.content}</textarea>
                    `;
                    document.getElementById('editTitle').addEventListener('input', debounce(() => autoSave(note.id, userId), 2000));
                    document.getElementById('editContent').addEventListener('input', debounce(() => autoSave(note.id, userId), 2000));
                });
            });

            // Event listener for adding a new note
            const addNoteBtn = document.getElementById('addNoteBtn');
            addNoteBtn.addEventListener('click', () => addNote(userId));
        });
}

// Add a new note
function addNote(userId) {
    const defaultNote = {
        title: "New Note",
        content: "Note content here..."
    };

    fetch(`/api/${userId}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultNote)
    }).then(() => {
        fetchNotes(userId); // Reload notes after adding
    });
}

// Delete a note
function deleteNote(noteId, userId) {
    fetch(`/api/${userId}/notes/${noteId}`, {
        method: 'DELETE'
    }).then(() => {
        fetchNotes(userId); // Reload notes after deleting
    });
}

// Auto-save note changes
function autoSave(noteId, userId) {
    const title = document.getElementById('editTitle') ? document.getElementById('editTitle').value : '';
    const content = document.getElementById('editContent') ? document.getElementById('editContent').value : '';
    saveNoteChanges(noteId, userId, title, content);
}

// Save changes to a note
function saveNoteChanges(noteId, userId, title, content) {
    fetch(`/api/${userId}/notes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: noteId, user_id: userId, title: title, content: content })
    }).then(() => {
        fetchNotes(userId); // Refresh notes to reflect the updated content
    });
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const userId = getUserIdFromPath();
    if (userId) {
        fetchNotes(userId);
    } else {
        console.error('No userId found in URL path');
    }
});



