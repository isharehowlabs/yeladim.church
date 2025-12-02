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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
            Children's Church 🙏
          </h1>
          <p className="text-sm sm:text-base text-center text-purple-700 font-medium">Watch, Learn, and Have Fun!</p>
        </header>

        {/* Video Stream Section */}
        <div className="mb-4 sm:mb-6">
          <VideoStream />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-purple-200">
          <div className="border-b-2 border-purple-100">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const colors = {
                  drawing: { active: 'border-pink-500 text-pink-600 bg-pink-50', hover: 'hover:bg-pink-50 hover:text-pink-600' },
                  quiz: { active: 'border-orange-500 text-orange-600 bg-orange-50', hover: 'hover:bg-orange-50 hover:text-orange-600' },
                  notebook: { active: 'border-purple-500 text-purple-600 bg-purple-50', hover: 'hover:bg-purple-50 hover:text-purple-600' }
                };
                const tabColors = colors[tab.id] || colors.drawing;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? `border-b-4 ${tabColors.active}`
                        : `text-gray-500 ${tabColors.hover}`
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-6" style={{ minHeight: '400px' }}>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 text-center text-purple-600 text-xs sm:text-sm font-medium">
          <p>Made with ❤️ for Yeladim Church</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
