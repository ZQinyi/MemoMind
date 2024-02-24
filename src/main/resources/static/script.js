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
            sidebar.innerHTML = `
                <div class="sidebar-header">
                    MemoMind
                    <button id="pendingListsBtn">Inv</button>
                    <button id="addNoteBtn">+</button>
                </div>
            `;
            result.data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.innerHTML = `
                    <button class="delete-note-btn" onclick="deleteNote(${note.id}, '${userId}')">-</button>
                    <span class="note-title" data-id="${note.id}">${note.title}</span>
                `;
                sidebar.appendChild(noteElement);

                // 应用防抖动功能以自动保存
                noteElement.querySelector('.note-title').addEventListener('click', function() {
                    const contentArea = document.getElementById('content');
                    contentArea.innerHTML = `
                        <input id="editTitle" class="editTitle" value="${note.title}" />
                        <textarea id="editContent" class="editable">${note.content}</textarea>
                        <div>
                            <input type="text" id="inviteeId" placeholder="Enter the inviteeId" />
                            <button id="sendInvitationBtn">SEND</button>
                        </div>
                    `;
                    document.getElementById('editTitle').addEventListener('input', debounce(() => autoSave(note.id, userId), 2000));
                    document.getElementById('editContent').addEventListener('input', debounce(() => autoSave(note.id, userId), 2000));
                    document.getElementById('sendInvitationBtn').addEventListener('click', () => {
                        const inviteeId = document.getElementById('inviteeId').value;
                        sendInvitation(note.id, userId, inviteeId);
                    });
                });
            });

            const addNoteBtn = document.getElementById('addNoteBtn');
            addNoteBtn.addEventListener('click', () => addNote(userId));


            const pendingListsBtn = document.getElementById('pendingListsBtn');
            pendingListsBtn.addEventListener('click', function() {
                window.location.href = `/${userId}/pending`; //
            });


        });
}

function sendInvitation(noteId, userId, inviteeId) {
    if (!inviteeId) {
        alert('Please enter the invitee ID!!!');
        return;
    }

    // Assuming the API requires noteId and inviteeId to send an invitation
    fetch(`/api/${userId}/send`, {
        method: 'PUT', // Ensure the HTTP method matches your backend requirements
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            noteId: noteId, // Include the noteId in the request
            inviteeId: inviteeId,
            inviterId: userId
        })
    })
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Invitation sent successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send the invitation.');
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
    const version = document.getElementById('editVersion') ? parseInt(document.getElementById('editVersion').value) : 1;
    const isPublic = document.getElementById('editIsPublic') ? document.getElementById('editIsPublic').checked : true;

    fetch(`/api/${userId}/notes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: noteId, userId: userId, title: title, content: content, version: version, isPublic: isPublic })
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
