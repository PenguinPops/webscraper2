import Link from 'next/link';
import { FaHeart, FaThumbsDown, FaHome } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 border-b border-purple-900">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-accent">
          JobScraper
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="flex items-center space-x-2 hover:text-accent">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link href="/Favourites" className="flex items-center space-x-2 hover:text-accent">
            <FaHeart />
            <span>Favourites</span>
          </Link>
          <Link href="/Rejected" className="flex items-center space-x-2 hover:text-accent">
            <FaThumbsDown />
            <span>Rejected</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}