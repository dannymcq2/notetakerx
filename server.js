const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const dbPath = path.join(__dirname, 'db.json');

app.use(express.json()); 
app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => res.status(204).end());


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      try {
        const notes = JSON.parse(data);
        res.json(notes);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Failed to parse notes' });
      }
    }
  });
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const newNote = { id: Date.now().toString(), ...req.body };
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      try {
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            res.status(500).json({ error: 'Failed to save note' });
          } else {
            res.status(201).json(newNote);
          }
        });
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Failed to parse notes' });
      }
    }
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      try {
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== id);
        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            res.status(500).json({ error: 'Failed to delete note' });
          } else {
            res.status(204).end();
          }
        });
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Failed to parse notes' });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
