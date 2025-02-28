'use client'

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile_card";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeProgram } from '@/utils/programNormalizer';
import { groupExperiences } from '@/utils/experienceGrouper';
import Image from "next/image";
import Head from 'next/head';

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
  const [showVotePopup, setShowVotePopup] = useState(false);
  const [currentVotePopup, setCurrentVotePopup] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('initializing');
  const popupRef = useRef(null);
  const [timeSinceVote, setTimeSinceVote] = useState('just now');

  const DEFAULT_DAILY_VOTE_LIMIT = 20;

  // At the top of your component, add this effect to prevent auto-hiding
  useEffect(() => {
    // This effect ensures the popup stays visible once shown
    if (currentVotePopup && !showVotePopup) {
      setShowVotePopup(true);
    }
  }, [currentVotePopup, showVotePopup]);

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
        
        // Show the most recent vote
        if (enhancedVotes.length > 0 && !showVotePopup && !currentVotePopup) {
          showNextVotePopup(enhancedVotes[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching recent votes:', error);
    }
  };

  // Function to display vote popup
  const showNextVotePopup = (vote) => {
    if (!vote) {
      console.log('No vote provided to showNextVotePopup');
      return;
    }
    
    console.log('Showing vote popup for:', vote);
    
    // Use the time_since property from the vote object
    setTimeSinceVote(vote.time_since || 'just now');
    
    // Simple approach: wait 3 seconds if there's already a popup showing
    if (showVotePopup && currentVotePopup) {
      setTimeout(() => {
        // Update the content
        setCurrentVotePopup(vote);
      }, 3000); // Wait 3 seconds before doing anything
    } else {
      // First time showing
      setCurrentVotePopup(vote);
      setShowVotePopup(true);
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
      
      // Check if we need to reset votes (new day in EST)
      const now = new Date();
      const estOffset = -4; // EST is UTC-4 (or UTC-5 during standard time)
      const utcDate = now.getTime() + (now.getTimezoneOffset() * 60000);
      const estDate = new Date(utcDate + (3600000 * estOffset));
      
      // Get the last reset time (midnight EST today)
      const resetTime = new Date(estDate);
      resetTime.setHours(0, 0, 0, 0);
      
      // Get the last vote time from the votes table
      const { data: lastVoteData, error: lastVoteError } = await supabase
        .from('votes')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (lastVoteError) throw lastVoteError;
      
      // If there's a last vote and it's before today's reset time, reset the counter
      const lastVoteTime = lastVoteData?.[0]?.created_at ? new Date(lastVoteData[0].created_at) : null;
      const needsReset = !lastVoteTime || lastVoteTime < resetTime;
      
      if (needsReset && data.votes_used_today > 0) {
        const { error: resetError } = await supabase
          .from('profiles')
          .update({ votes_used_today: 0 })
          .eq('id', user.id);
        
        if (resetError) throw resetError;
        
        // Update local state
        data.votes_used_today = 0;
      }
      
      // Calculate votes remaining
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
              winner_profile: winnerData,
              loser_profile: loserData,
              time_since: 'just now' // New votes are always "just now"
            };
            // Update recent votes list
            setRecentVotes(prev => [newVote, ...prev.slice(0, 9)]);
            
            // Show popup for the new vote
            showNextVotePopup(newVote);
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
        showNextVotePopup(newVote);
        
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
      
      {/* Vote Popup */}
      {showVotePopup && currentVotePopup && (
        <div 
          ref={popupRef}
          className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg p-3 sm:p-4 z-50 max-w-[85vw] sm:max-w-sm animate-slide-in-right"
        >
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <div className="text-xs sm:text-sm font-semibold">Recent Vote</div>
            <div className="text-xs text-gray-500">{timeSinceVote}</div>
          </div>
          
          {/* Winner */}
          <div className="flex items-center mb-2 sm:mb-3 p-2 bg-green-50 rounded-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 border-2 border-green-500">
              {currentVotePopup.winner_profile?.profile_pic_url ? (
                <Image 
                  src={currentVotePopup.winner_profile.profile_pic_url} 
                  alt={currentVotePopup.winner_profile.full_name || "Winner"}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs sm:text-sm">?</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm sm:text-base font-medium">{currentVotePopup.winner_profile?.full_name || "Unknown"}</div>
              <div className="text-xs sm:text-sm text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Winner
              </div>
            </div>
          </div>
          
          {/* Loser */}
          <div className="flex items-center p-2 bg-red-50 rounded-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 border-2 border-red-500">
              {currentVotePopup.loser_profile?.profile_pic_url ? (
                <Image 
                  src={currentVotePopup.loser_profile.profile_pic_url} 
                  alt={currentVotePopup.loser_profile.full_name || "Loser"}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs sm:text-sm">?</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm sm:text-base font-medium">{currentVotePopup.loser_profile?.full_name || "Unknown"}</div>
              <div className="text-xs sm:text-sm text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Lost
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile bar under navbar */}
      <div className="sm:hidden fixed top-12 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4 z-20 text-center font-mono tracking-wider shadow-sm">
        <span className="text-yellow-500 font-bold uppercase">Who&apos;s More</span>
        <span className="ml-1 font-black uppercase"> Cracked?</span>
        {user && votesRemaining !== null ? (
          <div className="text-xs mt-1 text-gray-600">
            {votesRemaining > 0 
              ? `${votesRemaining} vote${votesRemaining === 1 ? '' : 's'} remaining today` 
              : "Daily vote limit reached, come back tomorrow!"}
          </div>
        ) : (
          <div className="text-xs mt-1 text-gray-600">
            Anonymous votes don't count, sign in first!
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
                  ? `${votesRemaining} vote${votesRemaining === 1 ? '' : 's'} remaining today` 
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
