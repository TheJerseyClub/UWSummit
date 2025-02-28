import Image from "next/image";
import Marquee from 'react-fast-marquee';
import { useState, useEffect, useRef } from 'react';

export default function RecentMatchBar({ recentVotes }) {
  const [displayedVotes, setDisplayedVotes] = useState([]);
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!recentVotes?.length) return;

    // Identify new votes that are not yet displayed
    const newVotes = recentVotes.filter(
      vote => !displayedVotes.find(displayedVote => displayedVote.id === vote.id)
    );

    if (newVotes.length > 0) {
      setDisplayedVotes(prev => [...prev, ...newVotes]);
    }
  }, [recentVotes]);

  if (!displayedVotes?.length) return null;

  return (
    <div className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-300 z-40 overflow-hidden">
      <Marquee
        ref={marqueeRef}
        gradient={true}
        gradientColor={[255, 255, 255]}
        speed={40}
      >
        <div className="flex py-2">
          {displayedVotes.map((vote, index) => (
            <div 
              key={`${vote.id}-${index}`}
              className="flex items-center mx-4 space-x-2 transition-all duration-300" // Added transition class
            >
              {/* Winner */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-green-500">
                  {vote.winner_profile?.profile_pic_url ? (
                    <Image 
                      src={vote.winner_profile.profile_pic_url} 
                      alt={vote.winner_profile.full_name || "Winner"}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">?</span>
                    </div>
                  )}
                </div>
                <span className="text-sm ml-1 text-green-600 font-medium">
                  {vote.winner_profile?.full_name?.split(' ')[0] || "Unknown"}
                </span>
              </div>

              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>

              {/* Loser */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-red-500">
                  {vote.loser_profile?.profile_pic_url ? (
                    <Image 
                      src={vote.loser_profile.profile_pic_url} 
                      alt={vote.loser_profile.full_name || "Loser"}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">?</span>
                    </div>
                  )}
                </div>
                <span className="text-sm ml-1 text-red-600 font-medium">
                  {vote.loser_profile?.full_name?.split(' ')[0] || "Unknown"}
                </span>
              </div>

              <span className="text-xs text-gray-400 ml-2">
                {vote.time_since}
              </span>

              {/* Separator dot */}
              {index < displayedVotes.length - 1 && (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-4"></span>
              )}
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
