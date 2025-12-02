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
      <form onSubmit={handleSubmit} className="mb-4 bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row sm:items-end">
          <div className="flex-1 min-w-0 sm:min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stream Type
            </label>
            <select
              value={streamType}
              onChange={(e) => setStreamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder={streamType === 'youtube' ? 'Enter YouTube URL' : 'Enter Discord URL'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Load Stream
          </button>
        </div>
      </form>
    </div>
  );
}
