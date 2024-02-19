// 解析URL路径以获取userId
function getUserIdFromPath() {
    const pathArray = window.location.pathname.split('/').filter(Boolean);
    const notesIndex = pathArray.indexOf('notes');
    if (notesIndex > 0) {
        return pathArray[notesIndex - 1]; // 假设userId位于'notes'之前
    } else {
        return null; // 如果没有找到符合条件的userId，返回null
    }
}

// 获取笔记
function fetchNotes(userId) {
    fetch(`http://localhost:8080/${userId}/notes`)
        .then(response => response.json())
        .then(result => {
            const sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = '<div class="sidebar-header">Notes List<button id="addNoteBtn">+</button></div>';
            result.data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.innerHTML = `
                    <button class="delete-note-btn" onclick="deleteNote(${note.id}, '${userId}')">-</button>
                    <span class="note-title" data-id="${note.id}">${note.title}</span>
                `;
                sidebar.appendChild(noteElement);

                // 添加点击事件监听器到笔记标题
                noteElement.querySelector('.note-title').addEventListener('click', function() {
                    const contentArea = document.getElementById('content');
                    contentArea.innerHTML = `<h2>${note.title}</h2><p>${note.content}</p>`;
                });
            });
        });
}

// 添加笔记
function addNote(userId) {
    const defaultNote = {
        title: "New Note",
        content: "Note content here..."
    };

    fetch(`http://localhost:8080/${userId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultNote)
    }).then(() => {
        fetchNotes(userId); // 重新加载笔记
    });
}

// 删除笔记
function deleteNote(noteId, userId) {
    fetch(`http://localhost:8080/${userId}/notes/${noteId}`, { method: 'DELETE' })
        .then(() => {
            fetchNotes(userId); // 重新加载笔记
        });
}

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const userId = getUserIdFromPath();
    if (userId) {
        fetchNotes(userId);
        document.getElementById('addNoteBtn').addEventListener('click', function() {
            addNote(userId);
        });
    } else {
        console.error('No userId found in URL path');
        // 可以在这里处理错误，如重定向到登录页面或显示错误信息
    }
});

