import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

export default function ScriptureNotebook() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState('');
  const [verse, setVerse] = useState('');
  const [content, setContent] = useState('');

  // Load notes from API
  const loadNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const createNote = async () => {
    const newNote = {
      title: title || 'Untitled Lesson',
      verse,
      content,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        await loadNotes();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async () => {
    const updatedNote = {
      title,
      verse,
      content,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${currentNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
        await loadNotes();
        resetForm();
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadNotes();
          if (currentNote?.id === id) {
            resetForm();
          }
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const editNote = (note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setVerse(note.verse);
    setContent(note.content);
  };

  const resetForm = () => {
    setCurrentNote(null);
    setTitle('');
    setVerse('');
    setContent('');
  };

  const exportNote = (note) => {
    const text = `${note.title}\n\nScripture: ${note.verse}\n\n${note.content}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printNote = (note) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1e40af; }
            .verse { font-style: italic; color: #666; margin: 20px 0; }
            .content { line-height: 1.6; white-space: pre-wrap; }
            .date { color: #999; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="verse">Scripture: ${note.verse}</div>
          <div class="content">${note.content}</div>
          <div class="date">Created: ${new Date(note.createdAt).toLocaleDateString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      {/* Note Editor */}
      <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          {currentNote ? 'Edit Lesson' : 'New Lesson'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scripture Reference</label>
            <input
              type="text"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              placeholder="e.g., John 3:16"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Notes</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              placeholder="Write your lesson notes here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {currentNote ? (
              <>
                <button
                  onClick={updateNote}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Update Lesson
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={createNote}
                disabled={!content.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Save Lesson
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="lg:w-80 bg-white p-4 sm:p-6 rounded-lg shadow overflow-y-auto max-h-[600px]">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Saved Lessons ({notes.length})</h3>
        
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="border border-gray-200 rounded-md p-3 hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{note.title}</h4>
              {note.verse && (
                <p className="text-xs sm:text-sm text-blue-600 mb-2">{note.verse}</p>
              )}
              <p className="text-xs text-gray-500 mb-3">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => editNote(note)}
                  className="flex-1 min-w-[60px] px-2 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => exportNote(note)}
                  className="px-2 py-1 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 transition-colors"
                  title="Export"
                >
                  📥
                </button>
                <button
                  onClick={() => printNote(note)}
                  className="px-2 py-1 bg-purple-600 text-white text-xs sm:text-sm rounded hover:bg-purple-700 transition-colors"
                  title="Print"
                >
                  🖨️
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="px-2 py-1 bg-red-600 text-white text-xs sm:text-sm rounded hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          
          {notes.length === 0 && (
            <p className="text-gray-500 text-center py-8 text-sm">
              No lessons yet. Create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
