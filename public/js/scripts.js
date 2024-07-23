document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Document loaded'); 

    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn'); 

    saveBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        const noteTitle = document.getElementById('note-title').value;
        const noteText = document.getElementById('note-text').value;

        if (!noteTitle || !noteText) {
            alert('Please enter both a title and text for the note.');
            return;
        }

        const newNote = {
            title: noteTitle,
            text: noteText,
        };

        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Note saved:', data);
            fetchNotes(); 
            alert("Note saved successfully!");
        })
        .catch((error) => {
            console.error('Error saving note:', error);
        });
    });

    clearBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        document.getElementById('note-title').value = '';
        document.getElementById('note-text').value = ''; 
    });

    function fetchNotes() {
        fetch('/api/notes')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched notes:', data); 
                const notesList = document.getElementById('notes-list');
                notesList.innerHTML = ''; 

                data.forEach(note => {
                    const li = document.createElement('li');
                    li.textContent = `${note.title}: ${note.text}`;
                    notesList.appendChild(li);
                });
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    }

    
    fetchNotes();
});
