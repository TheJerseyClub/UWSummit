'use client'

import { useState, useEffect } from "react";
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

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, elo, profile_pic_url, education, experiences')
        .not('linkedin_url', 'is', null);
      
      if (error) throw error;
      
      const otherProfiles = user?.id 
        ? data.filter(profile => profile.id !== user.id)
        : data;

      setAllProfiles(data); // Store all profiles for ranking
      
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
  }, [user]);

  const createProfileData = (profile, allProfiles) => {
    const programInfo = normalizeProgram(
      profile.education?.find(edu => 
        edu.school?.toLowerCase().includes('waterloo')
      )?.field_of_study
    );

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
          label: "PROGRAM",
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

  const getExpectedScore = (ratingA, ratingB) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  };

  const calculateNewRating = (currentRating, expectedScore, actualScore, kFactor = 32) => {
    return Math.round(currentRating + kFactor * (actualScore - expectedScore));
  };

  const handleProfileVote = async (winnerIndex) => {
    setSelectedIndex(winnerIndex);
    const winner = profiles[winnerIndex];
    const loser = profiles[winnerIndex === 0 ? 1 : 0];
    
    try {
      const winnerElo = winner.elo || 1000;
      const loserElo = loser.elo || 1000;
      
      const winnerExpectedScore = getExpectedScore(winnerElo, loserElo);
      const loserExpectedScore = getExpectedScore(loserElo, winnerElo);
      
      const newWinnerElo = calculateNewRating(winnerElo, winnerExpectedScore, 1);
      const newLoserElo = calculateNewRating(loserElo, loserExpectedScore, 0);

      setEloChanges({
        winner: newWinnerElo - winnerElo,
        loser: newLoserElo - loserElo
      });

      // Update winner's ELO
      const { error: winnerError } = await supabase
        .from('profiles')
        .update({ elo: newWinnerElo })
        .eq('id', winner.id);

      if (winnerError) throw winnerError;

      // Update loser's ELO
      const { error: loserError } = await supabase
        .from('profiles')
        .update({ elo: newLoserElo })
        .eq('id', loser.id);

      if (loserError) throw loserError;

    } catch (error) {
      console.error('Error updating profiles:', error.message);
      console.error('Full error:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col relative">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="font-mono">Loading profiles...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex flex-row relative flex-1">
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
            />
            <div className={`absolute left-1/2 top-0 h-full w-[1px] bg-gray-200 z-[100]`} />
            
            {selectedIndex === null && (
              <button 
                className={`absolute left-1/2 top-[50vh] -translate-x-1/2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-y-[4px] transition-all z-[200] rounded-md`}
              >
                Equal =
              </button>
            )}
            <ProfileCard 
              {...createProfileData(profiles[1], allProfiles)} 
              isRightAligned={false} 
              onClick={() => handleProfileVote(1)} 
              isSelected={selectedIndex !== null}
              isWinner={selectedIndex === 1}
              eloChange={selectedIndex === 1 ? eloChanges.winner : eloChanges.loser}
              totalProfiles={allProfiles.length}
              profiles={allProfiles}
            />
            {selectedIndex !== null && (
              <button
                onClick={() => {
                  setSelectedIndex(null);
                  setEloChanges({ winner: null, loser: null });
                  fetchProfiles();
                }}
                className="absolute left-1/2 top-[50vh] -translate-x-1/2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-y-[4px] transition-all z-[300] rounded-md"
              >
                Next Match →
              </button>
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
