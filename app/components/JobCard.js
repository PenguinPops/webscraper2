'use client';
import { useState } from 'react';
import { FaStar, FaRegStar, FaExternalLinkAlt, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function JobCard({ 
  job, 
  onFavourite, 
  onApply, 
  onReject,
  isFavourite = false,
  isApplied = false,
  isRejected = false
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAllRequirements, setShowAllRequirements] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);
  const toggleShowAllRequirements = () => setShowAllRequirements(!showAllRequirements);

  const displayedRequirements = showAllRequirements 
    ? job.requirements 
    : job.requirements.slice(0, 3);

  const cardClasses = `border rounded-lg p-4 mb-4 transition-all duration-300 ${
    isApplied 
      ? 'border-green-500 bg-gray-800' 
      : isRejected 
        ? 'border-red-500 bg-gray-800' 
        : 'border-gray-700 hover:border-accent bg-gray-800'
  }`;

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-accent">
              {job.link.includes('pracuj.pl') ? 'Pracuj.pl' : 'OLX'}
            </span>
            <h3 className="text-xl font-semibold">{job.title}</h3>
          </div>
          <p className="text-gray-400">{job.company}</p>
          <p className="text-gray-300">{job.location}</p>
        </div>
        <button 
          onClick={() => onFavourite(job)}
          className="text-yellow-400 hover:text-yellow-300 text-xl"
        >
          {isFavourite ? <FaStar /> : <FaRegStar />}
        </button>
      </div>

      <div className="mt-3">
        <p className="text-accent font-medium">{job.salary}</p>
        <p className="text-gray-400 text-sm">{job.addedDate}</p>
        
        {job.experienceRequired && (
          <p className="text-sm mt-2">
            <span className="text-gray-400">Experience: </span>
            <span className="text-gray-300">{job.experienceRequired}</span>
          </p>
        )}

        {job.requirements.length > 0 && (
          <div className="mt-3">
            <div 
              className="flex items-center cursor-pointer text-gray-400 hover:text-gray-300"
              onClick={toggleShowAllRequirements}
            >
              <span className="mr-1">Requirements:</span>
              {showAllRequirements ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            <ul className="list-disc list-inside mt-1 text-sm text-gray-300">
              {displayedRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onApply(job)}
            disabled={isApplied}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${
              isApplied 
                ? 'bg-green-700 text-green-200' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <FaCheck />
            <span>{isApplied ? 'Applied' : 'Apply'}</span>
          </button>
          <button
            onClick={() => onReject(job)}
            disabled={isRejected}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${
              isRejected 
                ? 'bg-red-700 text-red-200' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <FaTimes />
            <span>{isRejected ? 'Rejected' : 'Reject'}</span>
          </button>
        </div>
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
        >
          <FaExternalLinkAlt size={12} />
          <span>View</span>
        </a>
      </div>
    </div>
  );
}