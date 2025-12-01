import { useState } from 'react';

export default function VideoStream() {
  const [streamType, setStreamType] = useState('youtube');
  const [streamUrl, setStreamUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (streamType === 'youtube') {
      let videoId = '';
      if (streamUrl.includes('youtube.com/watch?v=')) {
        videoId = streamUrl.split('v=')[1]?.split('&')[0];
      } else if (streamUrl.includes('youtu.be/')) {
        videoId = streamUrl.split('youtu.be/')[1]?.split('?')[0];
      } else {
        videoId = streamUrl;
      }
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    } else {
      setEmbedUrl(streamUrl);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
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
          <div className="flex-[2] min-w-[300px]">
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Load Stream
          </button>
        </div>
      </form>

      {embedUrl && (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {!embedUrl && (
        <div className="w-full bg-gray-100 rounded-lg shadow-lg flex items-center justify-center" style={{ paddingBottom: '56.25%', position: 'relative' }}>
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">Enter a stream URL above to start</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
