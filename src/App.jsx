import { useState } from 'react';
import VideoStream from './components/VideoStream';
import DrawingPad from './components/DrawingPad';
import Quiz from './components/Quiz';
import ScriptureNotebook from './components/ScriptureNotebook';

function App() {
  const [activeTab, setActiveTab] = useState('drawing');

  const tabs = [
    { id: 'drawing', name: '🎨 Drawing Pad', component: DrawingPad },
    { id: 'quiz', name: '❓ Quiz', component: Quiz },
    { id: 'notebook', name: '📖 Scripture Notes', component: ScriptureNotebook },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-900 mb-2">
            Children's Church 🙏
          </h1>
          <p className="text-sm sm:text-base text-center text-gray-600">Watch, Learn, and Have Fun!</p>
        </header>

        {/* Video Stream Section */}
        <div className="mb-4 sm:mb-6">
          <VideoStream />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-6" style={{ minHeight: '400px' }}>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm">
          <p>Made with ❤️ for Yeladim Church</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
