import { useState, useEffect } from 'react';

export default function ScriptureNotebook() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState('');
  const [verse, setVerse] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load notes from localStorage
    const saved = localStorage.getItem('scripture-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  const saveNotes = (newNotes) => {
    localStorage.setItem('scripture-notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: title || 'Untitled Lesson',
      verse,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveNotes([newNote, ...notes]);
    resetForm();
  };

  const updateNote = () => {
    const updatedNotes = notes.map(note =>
      note.id === currentNote.id
        ? { ...note, title, verse, content, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
    resetForm();
  };

  const deleteNote = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      saveNotes(notes.filter(note => note.id !== id));
      if (currentNote?.id === id) {
        resetForm();
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
    <div className="w-full h-full flex gap-4">
      {/* Note Editor */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
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
              rows="15"
              placeholder="Write your lesson notes here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {currentNote ? (
              <>
                <button
                  onClick={updateNote}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Lesson
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={createNote}
                disabled={!content.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save Lesson
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="w-80 bg-white p-6 rounded-lg shadow overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Saved Lessons ({notes.length})</h3>
        
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="border border-gray-200 rounded-md p-3 hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">{note.title}</h4>
              {note.verse && (
                <p className="text-sm text-blue-600 mb-2">{note.verse}</p>
              )}
              <p className="text-xs text-gray-500 mb-3">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => editNote(note)}
                  className="flex-1 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => exportNote(note)}
                  className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  title="Export"
                >
                  📥
                </button>
                <button
                  onClick={() => printNote(note)}
                  className="px-2 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                  title="Print"
                >
                  🖨️
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
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
