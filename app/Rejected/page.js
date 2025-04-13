import JobList from '@/components/JobList';
import Navbar from '@/components/Navbar';

export default function Rejected() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-accent">Rejected Jobs</h1>
        <JobList 
          initialJobs={[]} 
          initialRejected={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('jobRejected') || []) : []}
        />
      </main>
    </div>
  );
}