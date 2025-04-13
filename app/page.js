'use client';
import { useState } from 'react';
import JobFilter from '@/components/JobFilter';
import JobList from '@/components/JobList';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (position, location, radius) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (position) params.set('position', position);
      if (location) params.set('location', location);
      if (radius) params.set('radius', radius);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await res.json();
      setJobs(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-accent">JobScraper</h1>
        <JobFilter 
          onSearch={handleSearch} 
          loading={loading}  // Pass loading prop
        />
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded mb-4">
            Error: {error}
          </div>
        )}

        {!loading && <JobList initialJobs={jobs} />}
      </main>
    </div>
  );
}