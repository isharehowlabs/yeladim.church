import { useState, useEffect } from 'react';

export default function Quiz() {
  const [mode, setMode] = useState('teacher'); // 'teacher' or 'student'
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  
  // Teacher form state
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    // Load questions from localStorage
    const saved = localStorage.getItem('quiz-questions');
    if (saved) {
      setQuestions(JSON.parse(saved));
    }
  }, []);

  const saveQuestions = (newQuestions) => {
    localStorage.setItem('quiz-questions', JSON.stringify(newQuestions));
    setQuestions(newQuestions);
  };

  const addQuestion = (e) => {
    e.preventDefault();
    const newQuestion = {
      id: Date.now(),
      text: questionText,
      type: questionType,
      options: questionType === 'multiple-choice' ? options.filter(o => o.trim()) : ['True', 'False'],
      correctAnswer,
    };
    saveQuestions([...questions, newQuestion]);
    
    // Reset form
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  const deleteQuestion = (id) => {
    saveQuestions(questions.filter(q => q.id !== id));
  };

  const askQuestion = (question) => {
    setCurrentQuestion(question);
    setStudentAnswer('');
  };

  const submitAnswer = () => {
    if (studentAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setAnsweredCount(answeredCount + 1);
    setCurrentQuestion(null);
    setStudentAnswer('');
  };

  return (
    <div className="w-full h-full">
      {/* Mode Toggle */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('teacher')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'teacher' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Teacher Mode
          </button>
          <button
            onClick={() => setMode('student')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Student Mode
          </button>
        </div>
      </div>

      {/* Teacher Mode */}
      {mode === 'teacher' && (
        <div className="space-y-4">
          {/* Add Question Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Create New Question</h3>
            <form onSubmit={addQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your question here..."
                />
              </div>

              {questionType === 'multiple-choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  {options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                {questionType === 'multiple-choice' ? (
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select correct answer</option>
                    {options.filter(o => o.trim()).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select correct answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Question
              </button>
            </form>
          </div>

          {/* Question List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Questions ({questions.length})</h3>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{q.text}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: {q.type} | Answer: {q.correctAnswer}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => askQuestion(q)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        Ask
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <p className="text-gray-500 text-center py-8">No questions yet. Create one above!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Mode */}
      {mode === 'student' && (
        <div className="space-y-4">
          {/* Score Display */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Your Score</h3>
            <p className="text-3xl font-bold text-blue-600">
              {score} / {answeredCount}
            </p>
          </div>

          {/* Current Question */}
          {currentQuestion ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Question</h3>
              <p className="text-xl mb-6">{currentQuestion.text}</p>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setStudentAnswer(option)}
                    className={`w-full px-4 py-3 text-left rounded-md border-2 transition-colors ${
                      studentAnswer === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={submitAnswer}
                disabled={!studentAnswer}
                className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Waiting for teacher to ask a question...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
