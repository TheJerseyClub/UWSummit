import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function RecentMatchBar({ recentVotes }) {
  const [displayedVotes, setDisplayedVotes] = useState([]);
  const marqueeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!recentVotes?.length) return;

    // Filter out already displayed votes
    const newVotes = recentVotes.filter(
      (vote) => !displayedVotes.some((displayedVote) => displayedVote.id === vote.id)
    );

    if (newVotes.length) {
      setDisplayedVotes((prev) => [...prev, ...newVotes]);
    }
  }, [recentVotes]);

  const navigateToLiveVotes = () => router.push("/livevotes");

  if (!displayedVotes.length) return null;

  return (
    <div
      className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-300 z-40 cursor-pointer overflow-hidden"
      onClick={navigateToLiveVotes}
    >
      <Marquee ref={marqueeRef} gradient gradientColor={[255, 255, 255]} speed={40}>
        <div className="flex py-2">
          {displayedVotes.map((vote, index) => (
            <div
              key={vote.id}
              className="flex items-center mx-4 transition-all duration-300 overflow-hidden"
            >
              <MatchParticipant
                profile={vote.winner_profile}
                borderColor="border-green-500"
                textColor="text-green-600"
              />
              <span className="mx-2 text-gray-400">vs</span>
              <MatchParticipant
                profile={vote.loser_profile}
                borderColor="border-red-500"
                textColor="text-red-600"
              />
              <span className="text-xs text-gray-400 ml-3">{vote.time_since}</span>

              {index < displayedVotes.length - 1 && (
                <div className="h-4 lg:h-10 border-r border-gray-300 mx-6"></div>
              )}
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}

function MatchParticipant({ profile, borderColor, textColor }) {
  return (
    <div className="flex items-center">
      <div className={`w-6 h-6 rounded-full overflow-hidden border ${borderColor}`}>
        {profile?.profile_pic_url ? (
          <Image
            src={profile.profile_pic_url}
            alt={profile.full_name || "Participant"}
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
      <span className={`text-sm ml-1 font-medium ${textColor}`}>
        {profile?.full_name?.split(" ")[0] || "Unknown"}
      </span>
    </div>
  );
}