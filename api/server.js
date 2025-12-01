require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { readDB, writeDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*'
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Children\'s Church API is running' });
});

// ============ QUIZ ENDPOINTS ============

// Get all quiz questions
app.get('/api/quiz/questions', (req, res) => {
  try {
    const db = readDB();
    res.json(db.quiz_questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a quiz question
app.post('/api/quiz/questions', (req, res) => {
  try {
    const { text, type, options, correctAnswer } = req.body;
    
    if (!text || !type || !options || !correctAnswer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDB();
    const newQuestion = {
      id: Date.now(),
      text,
      type,
      options,
      correctAnswer,
      createdAt: new Date().toISOString()
    };
    
    db.quiz_questions.unshift(newQuestion);
    writeDB(db);
    
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a quiz question
app.delete('/api/quiz/questions/:id', (req, res) => {
  try {
    const db = readDB();
    const id = parseInt(req.params.id);
    const index = db.quiz_questions.findIndex(q => q.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    db.quiz_questions.splice(index, 1);
    
    // Clear current question if it was deleted
    if (db.current_question?.id === id) {
      db.current_question = null;
    }
    
    writeDB(db);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set current question for students
app.post('/api/quiz/current', (req, res) => {
  try {
    const { questionId } = req.body;
    const db = readDB();
    
    if (questionId) {
      const question = db.quiz_questions.find(q => q.id === questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      db.current_question = question;
    } else {
      db.current_question = null;
    }
    
    writeDB(db);
    res.json({ message: 'Current question set successfully', questionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current question for students
app.get('/api/quiz/current', (req, res) => {
  try {
    const db = readDB();
    res.json(db.current_question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SCRIPTURE NOTES ENDPOINTS ============

// Get all scripture notes
app.get('/api/notes', (req, res) => {
  try {
    const db = readDB();
    res.json(db.scripture_notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific note
app.get('/api/notes/:id', (req, res) => {
  try {
    const db = readDB();
    const id = parseInt(req.params.id);
    const note = db.scripture_notes.find(n => n.id === id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a scripture note
app.post('/api/notes', (req, res) => {
  try {
    const { title, verse, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = readDB();
    const newNote = {
      id: Date.now(),
      title,
      verse: verse || '',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.scripture_notes.unshift(newNote);
    writeDB(db);
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a scripture note
app.put('/api/notes/:id', (req, res) => {
  try {
    const { title, verse, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = readDB();
    const id = parseInt(req.params.id);
    const index = db.scripture_notes.findIndex(n => n.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    db.scripture_notes[index] = {
      ...db.scripture_notes[index],
      title,
      verse: verse || '',
      content,
      updatedAt: new Date().toISOString()
    };
    
    writeDB(db);
    res.json({ message: 'Note updated successfully', note: db.scripture_notes[index] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a scripture note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const db = readDB();
    const id = parseInt(req.params.id);
    const index = db.scripture_notes.findIndex(n => n.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    db.scripture_notes.splice(index, 1);
    writeDB(db);
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🙏 Children's Church API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
