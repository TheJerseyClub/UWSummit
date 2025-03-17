'use client'

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile_card";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeProgram } from '@/utils/programNormalizer';
import { groupExperiences } from '@/utils/experienceGrouper';

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [eloChanges, setEloChanges] = useState({ winner: null, loser: null });
  const { user } = useAuth();
  const [allProfiles, setAllProfiles] = useState([]);
  const [votesRemaining, setVotesRemaining] = useState(null);
  const [voteLimitReached, setVoteLimitReached] = useState(false);

  const DEFAULT_DAILY_VOTE_LIMIT = 20;

  const fetchUserProfile = async () => {
    if (!user) {
      setVotesRemaining(null);
      setVoteLimitReached(false);
      return;
    }

    try {
      // Query the user_votes table instead of elo table
      const { data: votesData, error } = await supabase
        .from('user_votes')
        .select('id, number_of_votes, last_reset_date')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      // Calculate votes remaining
      const voteLimit = DEFAULT_DAILY_VOTE_LIMIT;
      const votesUsed = votesData.number_of_votes || 0;
      const remaining = voteLimit - votesUsed;
      
      setVotesRemaining(remaining);
      setVoteLimitReached(remaining <= 0);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      // First get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, profile_pic_url, education, experiences ')
        .not('linkedin_url', 'is', null);
      
      if (profilesError) throw profilesError;
      
      // Then get ELO scores from elo table
      const { data: eloData, error: eloError } = await supabase
        .from('elo')
        .select('user_id, score');
      
      if (eloError) throw eloError;
      
      // Create a map of user_id to elo score for quick lookup
      const eloMap = {};
      eloData.forEach(item => {
        eloMap[item.user_id] = item.score;
      });
      
      // Combine the data
      const combinedData = profilesData.map(profile => ({
        ...profile,
        elo: eloMap[profile.id] || 1000 // Default to 1000 if no ELO found
      }));
      
      const otherProfiles = user?.id 
        ? combinedData.filter(profile => profile.id !== user.id)
        : combinedData;

      setAllProfiles(combinedData); // Store all profiles for ranking
      
      const shuffled = [...otherProfiles].sort(() => 0.5 - Math.random());
      const selectedProfiles = shuffled.slice(0, 2);
      
      setSelectedIndex(null);
      setProfiles(selectedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const createProfileData = (profile, allProfiles) => {
    const waterlooEducation = profile.education?.find(edu => 
      edu.school?.toLowerCase().includes('waterloo')
    );
    
    const studyField = waterlooEducation?.field_of_study || waterlooEducation?.degree_name || "Unknown Program";
    const programInfo = normalizeProgram(studyField);

    const groupedExperiences = groupExperiences(profile.experiences);
    
    // Calculate rank
    const rank = allProfiles
      .sort((a, b) => b.elo - a.elo)
      .findIndex(p => p.id === profile.id) + 1;
    
    return {
      title: profile.full_name || "Anonymous",
      profilePicture: profile.profile_pic_url,
      currentElo: profile.elo || 1000,
      rank,
      items: [
        {
          value: `${programInfo.name} ${programInfo.emoji}`
        }
      ],
      experiences: groupedExperiences.map(group => ({
        title: group.company,
        company: group.company,
        companyLogo: group.companyLogo,
        positions: group.positions
      }))
    };
  };

  const handleProfileVote = async (winnerIndex) => {
    // Check if vote limit reached for logged-in users
    if (user && voteLimitReached) {
      return;
    }
    
    setSelectedIndex(winnerIndex);
    const winner = profiles[winnerIndex];
    const loser = profiles[winnerIndex === 0 ? 1 : 0];
    
    try {
      if (user) {
        // Call the RPC endpoint to cast vote and update ELOs
        const { data, error } = await supabase.rpc('cast_vote', {
          winner: winner.id,
          loser: loser.id,
          voter: user.id
        });

        if (error) throw error;

        // Update ELO changes display from the response
        setEloChanges({
          winner: data.winner_score,
          loser: data.loser_score
        });

        // Update the ELO scores in the profiles array
        const updatedProfiles = [...allProfiles];
        const winnerIndex = updatedProfiles.findIndex(p => p.id === winner.id);
        const loserIndex = updatedProfiles.findIndex(p => p.id === loser.id);
        
        if (winnerIndex !== -1) {
          updatedProfiles[winnerIndex] = {
            ...updatedProfiles[winnerIndex],
            elo: updatedProfiles[winnerIndex].elo + data.winner_score
          };
        }
        
        if (loserIndex !== -1) {
          updatedProfiles[loserIndex] = {
            ...updatedProfiles[loserIndex],
            elo: updatedProfiles[loserIndex].elo + data.loser_score
          };
        }
        
        setAllProfiles(updatedProfiles);

        // Update user profile and votes remaining
        await fetchUserProfile();
      } else {
        // For anonymous users, don't show ELO changes
        setEloChanges({
          winner: null,
          loser: null
        });
      }

    } catch (error) {
      console.error('Error casting vote:', error.message);
      console.error('Full error:', error);
    }
  };

  const renderVoteCountMessage = () => {
    if (!user) {
      return (
        <div className="text-center text-red-400 mt-4 font-mono">
          Sign in for votes to count
        </div>
      );
    }
    
    return (
      <div className="text-center mt-4 font-mono">
        {voteLimitReached ? (
          <span className="text-red-500">No votes remaining today</span>
        ) : (
          <span>{votesRemaining} votes remaining today</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col relative">
        <Navbar />
        <div className="flex items-center justify-center h-screen pt-16">
          <p className="font-mono">Loading profiles...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col relative">
      <Navbar />
      
      {/* Mobile bar under navbar */}
      <div className="sm:hidden fixed top-16 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 py-2 z-20 text-center font-mono tracking-wider shadow-sm">
        <span className="text-yellow-500 font-bold uppercase">Who&apos;s More</span>
        <span className="ml-1 font-black uppercase"> Cracked?</span>
        {renderVoteCountMessage()}
      </div>
      
      {/* Desktop centered text (only visible when no selection and only on desktop) */}
      {selectedIndex === null && (
        <div className="hidden sm:block absolute left-1/2 top-[30vh] -translate-x-1/2 -translate-y-1/2 font-mono uppercase tracking-wider text-center z-20">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-lg shadow-sm">
            <span className="block mb-1 text-yellow-500 font-bold">Who&apos;s More</span>
            <span className="block text-2xl font-black">Cracked?</span>
            {renderVoteCountMessage()}
          </div>
        </div>
      )}
      
      <div className="flex flex-row relative flex-1 pt-24 sm:pt-0">
        {profiles.length >= 2 ? (
          <>
            <ProfileCard 
              {...createProfileData(profiles[0], allProfiles)} 
              isRightAligned={true} 
              onClick={() => handleProfileVote(0)} 
              isSelected={selectedIndex !== null}
              isWinner={selectedIndex === 0}
              eloChange={selectedIndex === 0 ? eloChanges.winner : eloChanges.loser}
              totalProfiles={allProfiles.length}
              profiles={allProfiles}
              isAuthenticated={!!user}
              profileId={profiles[0]?.id}
            />
            <div className={`absolute left-1/2 top-0 h-full w-[1px] bg-gray-200 z-10`} />
            
            <ProfileCard 
              {...createProfileData(profiles[1], allProfiles)} 
              isRightAligned={false} 
              onClick={() => handleProfileVote(1)} 
              isSelected={selectedIndex !== null}
              isWinner={selectedIndex === 1}
              eloChange={selectedIndex === 1 ? eloChanges.winner : eloChanges.loser}
              totalProfiles={allProfiles.length}
              profiles={allProfiles}
              isAuthenticated={!!user}
              profileId={profiles[1]?.id}
            />
            {selectedIndex !== null && (
              <>
                {/* Desktop centered button (hidden on mobile) */}
                <button
                  onClick={() => {
                    setSelectedIndex(null);
                    setEloChanges({ winner: null, loser: null });
                    fetchProfiles();
                  }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-y-[calc(-50%+4px)] transition-all z-30 rounded-md hidden sm:block"
                >
                  Next Match <span className="inline-block animate-bounce-horizontal">→</span>
                </button>
                
                {/* Mobile bottom bar (hidden on desktop) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-30 translate-y-full animate-slide-up">
                  <button
                    onClick={() => {
                      setSelectedIndex(null);
                      setEloChanges({ winner: null, loser: null });
                      fetchProfiles();
                    }}
                    className="w-full py-16 bg-black text-white border-2 border-black font-mono uppercase tracking-wider text-lg"
                  >
                    Next Match <span className="inline-block animate-bounce-horizontal">→</span>
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="font-mono text-gray-600">No profiles available</p>
          </div>
        )}
      </div>
    </main>
  );
}