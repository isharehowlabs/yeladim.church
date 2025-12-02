import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

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

  // Load questions from API
  const loadQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  // Load current question from API (for students)
  const loadCurrentQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/current`);
      if (response.ok) {
        const data = await response.json();
        setCurrentQuestion(data);
      }
    } catch (error) {
      console.error('Error loading current question:', error);
    }
  };

  useEffect(() => {
    loadQuestions();
    
    // Poll for current question in student mode
    if (mode === 'student') {
      loadCurrentQuestion();
      const interval = setInterval(loadCurrentQuestion, 2000); // Poll every 2 seconds
      return () => clearInterval(interval);
    }
  }, [mode]);

  const addQuestion = async (e) => {
    e.preventDefault();
    const newQuestion = {
      text: questionText,
      type: questionType,
      options: questionType === 'multiple-choice' ? options.filter(o => o.trim()) : ['True', 'False'],
      correctAnswer,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        await loadQuestions();
        // Reset form
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadQuestions();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const askQuestion = async (question) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/current`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });

      if (response.ok) {
        setCurrentQuestion(question);
      }
    } catch (error) {
      console.error('Error setting current question:', error);
    }
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
      <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow mb-4">
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setMode('teacher')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-md transition-colors text-sm md:text-base font-semibold ${
              mode === 'teacher' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Teacher Mode
          </button>
          <button
            onClick={() => setMode('student')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-md transition-colors text-sm md:text-base font-semibold ${
              mode === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Student Mode
          </button>
        </div>
      </div>

      {/* Teacher Mode */}
      {mode === 'teacher' && (
        <div className="space-y-4 md:space-y-6">
          {/* Add Question Form */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 md:mb-6">Create New Question</h3>
            <form onSubmit={addQuestion} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Question</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  rows="3"
                  className="w-full px-3 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your question here..."
                />
              </div>

              {questionType === 'multiple-choice' && (
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Options</label>
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
                      className="w-full px-3 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Correct Answer</label>
                {questionType === 'multiple-choice' ? (
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                    className="w-full px-3 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select correct answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Add Question
              </button>
            </form>
          </div>

          {/* Question List */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 md:mb-6">Questions ({questions.length})</h3>
            <div className="space-y-3 md:space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="border border-gray-200 rounded-md p-3 sm:p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base md:text-lg">{q.text}</p>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                        Type: {q.type} | Answer: {q.correctAnswer}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => askQuestion(q)}
                        className="flex-1 md:flex-none px-3 md:px-4 py-1 md:py-2 bg-green-600 text-white text-sm md:text-base rounded-md hover:bg-green-700 transition-colors font-semibold"
                      >
                        Ask
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="flex-1 md:flex-none px-3 md:px-4 py-1 md:py-2 bg-red-600 text-white text-sm md:text-base rounded-md hover:bg-red-700 transition-colors font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm md:text-base">No questions yet. Create one above!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Mode */}
      {mode === 'student' && (
        <div className="space-y-4 md:space-y-6">
          {/* Score Display */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Your Score</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
              {score} / {answeredCount}
            </p>
          </div>

          {/* Current Question */}
          {currentQuestion ? (
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 md:mb-6">Question</h3>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8">{currentQuestion.text}</p>
              
              <div className="space-y-3 md:space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setStudentAnswer(option)}
                    className={`w-full px-4 md:px-6 py-3 md:py-4 text-left text-sm sm:text-base md:text-lg rounded-md border-2 transition-colors ${
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
                className="w-full mt-6 md:mt-8 px-4 py-2 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow">
              <div className="text-center text-gray-500 py-8 md:py-12">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-400 mb-3 md:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm sm:text-base md:text-lg">Waiting for teacher to ask a question...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
