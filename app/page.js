'use client'

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile_card";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeProgram } from '@/utils/programNormalizer';
import { groupExperiences } from '@/utils/experienceGrouper';
import RecentMatchBar from "@/components/RecentMatchBar";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [eloChanges, setEloChanges] = useState({ winner: null, loser: null });
  const { user } = useAuth();
  const [allProfiles, setAllProfiles] = useState([]);
  const [votesRemaining, setVotesRemaining] = useState(null);
  const [voteLimitReached, setVoteLimitReached] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [recentVotes, setRecentVotes] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState('initializing');
  const [timeSinceVote, setTimeSinceVote] = useState('just now');

  const DEFAULT_DAILY_VOTE_LIMIT = 20;

  // Function to format time since a given date
  const formatTimeSince = (dateString) => {
    const voteDate = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - voteDate) / 1000);
    
    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffSeconds / 86400);
      return `${days}d ago`;
    }
  };

  // Function to fetch recent votes
  const fetchRecentVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error in initial votes query:', error);
        throw error;
      }
      
      
      // Now fetch the related profile data
      if (data.length > 0) {
        const enhancedVotes = await Promise.all(data.map(async (vote) => {
          // Get winner profile
          const { data: winnerData, error: winnerError } = await supabase
            .from('profiles')
            .select('full_name, profile_pic_url')
            .eq('id', vote.winner_id)
            .single();
            
          if (winnerError) {
            console.error('Error fetching winner profile:', winnerError);
          }
          
          // Get loser profile
          const { data: loserData, error: loserError } = await supabase
            .from('profiles')
            .select('full_name, profile_pic_url')
            .eq('id', vote.loser_id)
            .single();
            
          if (loserError) {
            console.error('Error fetching loser profile:', loserError);
          }
          
          return {
            ...vote,
            winner_profile: winnerData || { full_name: 'Unknown', profile_pic_url: null },
            loser_profile: loserData || { full_name: 'Unknown', profile_pic_url: null },
            time_since: formatTimeSince(vote.created_at)
          };
        }));
        
        setRecentVotes(enhancedVotes);
        
      }
    } catch (error) {
      console.error('Error fetching recent votes:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setVotesRemaining(null);
      setVoteLimitReached(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, daily_vote_limit, votes_used_today')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserProfile(data);
      
      // Calculate votes remaining (no reset logic needed here anymore)
      const voteLimit = data.daily_vote_limit || DEFAULT_DAILY_VOTE_LIMIT;
      const votesUsed = data.votes_used_today || 0;
      const remaining = voteLimit - votesUsed;
      
      setVotesRemaining(remaining);
      setVoteLimitReached(remaining <= 0);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Set up real-time subscription for votes
  useEffect(() => {
    
    // First fetch existing votes
    fetchRecentVotes();
    
    // Then set up subscription for new votes
    try {
      // Enable realtime for the votes table
      supabase.channel('schema-db-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        }, async (payload) => {
          try {
            // Get winner profile
            const { data: winnerData, error: winnerError } = await supabase
              .from('profiles')
              .select('full_name, profile_pic_url')
              .eq('id', payload.new.winner_id)
              .single();
              
            if (winnerError) {
              console.error('Error fetching winner profile:', winnerError);
              return;
            }
            
            // Get loser profile
            const { data: loserData, error: loserError } = await supabase
              .from('profiles')
              .select('full_name, profile_pic_url')
              .eq('id', payload.new.loser_id)
              .single();
              
            if (loserError) {
              console.error('Error fetching loser profile:', loserError);
              return;
            }
            
            const newVote = {
              ...payload.new,
              id: payload.new.id,
              winner_profile: winnerData,
              loser_profile: loserData,
              time_since: 'just now'
            };
            
            // Update recent votes list with a small delay to allow for transition
            setTimeout(() => {
              setRecentVotes(prev => [newVote, ...prev.slice(0, 9)]);
            }, 100);
            
          } catch (error) {
            console.error('Error processing new vote:', error);
          }
        })
        .subscribe((status) => {
          setSubscriptionStatus(status);
        });
      
      
    } catch (error) {
      console.error('Error setting up subscription:', error);
      setSubscriptionStatus('error: ' + error.message);
    }
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, elo, profile_pic_url, education, experiences, daily_vote_limit')
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

  const getExpectedScore = (ratingA, ratingB) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  };

  const calculateNewRating = (currentRating, expectedScore, actualScore, kFactor = 16) => {
    return Math.round(currentRating + kFactor * (actualScore - expectedScore));
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
      const winnerElo = winner.elo || 1000;
      const loserElo = loser.elo || 1000;
      
      const winnerExpectedScore = getExpectedScore(winnerElo, loserElo);
      const loserExpectedScore = getExpectedScore(loserElo, winnerElo);
      
      const newWinnerElo = calculateNewRating(winnerElo, winnerExpectedScore, 1);
      const newLoserElo = calculateNewRating(loserElo, loserExpectedScore, 0);

      // Only set ELO changes if user is logged in
      if (user) {
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
      } else {
        // For anonymous users, don't show ELO changes
        setEloChanges({
          winner: null,
          loser: null
        });
      }
      
      // Record the vote if user is logged in
      if (user && userProfile) {
        // Increment votes_used_today in the profile
        const newVotesUsed = (userProfile.votes_used_today || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ votes_used_today: newVotesUsed })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        // Also record in votes table for history
        const { error: voteHistoryError } = await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            winner_id: winner.id,
            loser_id: loser.id
          });
          
        if (voteHistoryError) throw voteHistoryError;
        
        // Manually trigger the popup for the current vote
        const newVote = {
          winner_profile: {
            full_name: winner.full_name,
            profile_pic_url: winner.profile_pic_url
          },
          loser_profile: {
            full_name: loser.full_name,
            profile_pic_url: loser.profile_pic_url
          }
        };
        
        // Update user profile and votes remaining
        await fetchUserProfile();
      }

    } catch (error) {
      console.error('Error updating profiles:', error.message);
      console.error('Full error:', error);
    }
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
      
      {/* Replace the old popup with the new marquee bar */}
      
      <div className="hidden sm:block">
        <RecentMatchBar recentVotes={recentVotes} />
      </div>
      {/* Mobile bar under navbar */}
      <div className="sm:hidden fixed top-16 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 py-2 z-20 text-center font-mono tracking-wider shadow-sm">
        <span className="text-yellow-500 font-bold uppercase">Who&apos;s More</span>
        <span className="ml-1 font-black uppercase"> Cracked?</span>
        {user && votesRemaining !== null ? (
          <div className="text-xs mt-1 text-gray-600">
            {votesRemaining > 0 
              ? <span><span className="font-bold px-2 py-1 text-yellow-500 rounded-md">{`${votesRemaining} vote${votesRemaining === 1 ? '' : 's'}`}</span>remaining today</span>
              : "Daily vote limit reached, come back tomorrow!"}
          </div>
        ) : (
          <div className="text-xs mt-1 text-gray-600">
            <span className="bg-red-300 text-black px-2 py-1 rounded-md">Anonymous votes don&apos;t count, sign in first!</span>
          </div>
        )}
      </div>
      
      {/* Desktop centered text (only visible when no selection and only on desktop) */}
      {selectedIndex === null && (
        <div className="hidden sm:block absolute left-1/2 top-[30vh] -translate-x-1/2 -translate-y-1/2 font-mono uppercase tracking-wider text-center z-20">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-lg shadow-sm">
            <span className="block mb-1 text-yellow-500 font-bold">Who&apos;s More</span>
            <span className="block text-2xl font-black">Cracked?</span>
            {user && votesRemaining !== null ? (
              <div className="text-xs mt-2 text-gray-600 normal-case">
                {votesRemaining > 0 
              ? <span><span className="font-bold px-2 py-1 text-yellow-500 rounded-md">{`${votesRemaining} vote${votesRemaining === 1 ? '' : 's'}`}</span>remaining today</span>
                  : "Daily vote limit reached, come back tomorrow!"}
              </div>
            ) : (
              <div className="text-xs mt-2 text-gray-600 normal-case">
                Anonymous votes don't count,<br></br> sign in first!
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-row relative flex-1 pt-24 sm:pt-8">
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
