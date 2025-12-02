import { useState } from 'react';

export default function VideoStream() {
  const [streamType, setStreamType] = useState('youtube');
  const [streamUrl, setStreamUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission handled here if needed
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg shadow-lg border-2 border-purple-200">
        <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row sm:items-end">
          <div className="flex-1 min-w-0 sm:min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stream Type
            </label>
            <select
              value={streamType}
              onChange={(e) => setStreamType(e.target.value)}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="youtube">YouTube</option>
              <option value="discord">Discord</option>
            </select>
          </div>
          <div className="flex-[2] min-w-0 sm:min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {streamType === 'youtube' ? 'YouTube URL or Video ID' : 'Discord Channel URL'}
            </label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder={streamType === 'youtube' ? 'Enter YouTube URL here to stream' : 'Enter Discord URL here to stream'}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            Load Stream
          </button>
        </div>
      </form>
    </div>
  );
}
