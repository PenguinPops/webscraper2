'use client';
import { useState, useEffect } from 'react';
import JobCard from './JobCard';

export default function JobList({ initialJobs = [], initialFavourites = [], initialApplied = [], initialRejected = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [favourites, setFavourites] = useState(new Set(initialFavourites));
  const [applied, setApplied] = useState(new Set(initialApplied));
  const [rejected, setRejected] = useState(new Set(initialRejected));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Safely load saved data from localStorage
    const loadFromStorage = (key) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error(`Error parsing ${key} from localStorage:`, e);
        return [];
      }
    };

    const savedFavourites = loadFromStorage('jobFavourites');
    const savedApplied = loadFromStorage('jobApplied');
    const savedRejected = loadFromStorage('jobRejected');
    
    setFavourites(new Set(savedFavourites));
    setApplied(new Set(savedApplied));
    setRejected(new Set(savedRejected));
  }, []);

  const handleFavourite = (job) => {
    const newFavourites = new Set(favourites);
    if (newFavourites.has(job.hash)) {
      newFavourites.delete(job.hash);
    } else {
      newFavourites.add(job.hash);
    }
    setFavourites(newFavourites);
    localStorage.setItem('jobFavourites', JSON.stringify([...newFavourites]));
  };

  const handleApply = (job) => {
    const newApplied = new Set(applied);
    newApplied.add(job.hash);
    setApplied(newApplied);
    localStorage.setItem('jobApplied', JSON.stringify([...newApplied]));
  };

  const handleReject = (job) => {
    const newRejected = new Set(rejected);
    newRejected.add(job.hash);
    setRejected(newRejected);
    localStorage.setItem('jobRejected', JSON.stringify([...newRejected]));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400">No jobs found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.hash}
          job={job}
          onFavourite={handleFavourite}
          onApply={handleApply}
          onReject={handleReject}
          isFavourite={favourites.has(job.hash)}
          isApplied={applied.has(job.hash)}
          isRejected={rejected.has(job.hash)}
        />
      ))}
    </div>
  );
}