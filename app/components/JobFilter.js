'use client';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function JobFilter({ onSearch, loading }) {  // Add loading prop
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('chelm');
  const [radius, setRadius] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(position, location, radius);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-1">
              Job Position
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full bg-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Warsaw"
              className="w-full bg-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="radius" className="block text-sm font-medium mb-1">
              Radius (km)
            </label>
            <select
              id="radius"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full bg-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              <option value="10">10 km</option>
              <option value="30">30 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-accent hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md flex items-center space-x-2 transition-colors"
          disabled={loading} 
        >
          <FiSearch />
          <span>{loading ? 'Searching...' : 'Search Jobs'}</span>  
        </button>
      </form>
    </div>
  );
}