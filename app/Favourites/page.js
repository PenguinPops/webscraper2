import JobList from '@/components/JobList';
import Navbar from '@/components/Navbar';

export default function Favourites() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-accent">Favourite Jobs</h1>
        <JobList 
          initialJobs={[]} 
          initialFavourites={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('jobFavourites') || []) : []}
        />
      </main>
    </div>
  );
}