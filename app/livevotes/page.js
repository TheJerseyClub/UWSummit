'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LiveVotes() {
  const [recentVotes, setRecentVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState('initializing');
  const router = useRouter();

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

  // Navigate to profile page
  const navigateToProfile = (profileId) => {
    if (profileId) {
      router.push(`/profile/${profileId}`);
    }
  };

  // Fetch recent votes
  const fetchRecentVotes = async () => {
    try {
      setLoading(true);
      
      // Get the 20 most recent votes
      const { data: votes, error } = await supabase
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        throw error;
      }
      
      if (votes) {
        // Enhance votes with profile information
        const enhancedVotes = await Promise.all(votes.map(async (vote) => {
          // Get winner profile
          const { data: winnerData, error: winnerError } = await supabase
            .from('profiles')
            .select('id, full_name, profile_pic_url')
            .eq('id', vote.winner_id)
            .single();
            
          if (winnerError) {
            console.error('Error fetching winner profile:', winnerError);
          }
          
          // Get loser profile
          const { data: loserData, error: loserError } = await supabase
            .from('profiles')
            .select('id, full_name, profile_pic_url')
            .eq('id', vote.loser_id)
            .single();
            
          if (loserError) {
            console.error('Error fetching loser profile:', loserError);
          }
          
          return {
            ...vote,
            winner_profile: winnerData || { id: null, full_name: 'Unknown', profile_pic_url: null },
            loser_profile: loserData || { id: null, full_name: 'Unknown', profile_pic_url: null },
            time_since: formatTimeSince(vote.created_at)
          };
        }));
        
        setRecentVotes(enhancedVotes);
      }
    } catch (error) {
      console.error('Error fetching recent votes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for votes
  useEffect(() => {
    // First fetch existing votes
    fetchRecentVotes();
    
    // Then set up subscription for new votes
    try {
      const channel = supabase.channel('schema-db-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        }, async (payload) => {
          try {
            // Get winner profile
            const { data: winnerData, error: winnerError } = await supabase
              .from('profiles')
              .select('id, full_name, profile_pic_url')
              .eq('id', payload.new.winner_id)
              .single();
              
            if (winnerError) {
              console.error('Error fetching winner profile:', winnerError);
              return;
            }
            
            // Get loser profile
            const { data: loserData, error: loserError } = await supabase
              .from('profiles')
              .select('id, full_name, profile_pic_url')
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
              setRecentVotes(prev => [newVote, ...prev.slice(0, 19)]);
            }, 100);
            
          } catch (error) {
            console.error('Error processing new vote:', error);
          }
        })
        .subscribe((status) => {
          setSubscriptionStatus(status);
        });
      
      // Cleanup function
      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up subscription:', error);
      setSubscriptionStatus('error: ' + error.message);
    }
  }, []);

  // Update time_since every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentVotes(prev => 
        prev.map(vote => ({
          ...vote,
          time_since: formatTimeSince(vote.created_at)
        }))
      );
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Sticky Left Panel - Hidden on mobile */}
      <button
        onClick={() => window.history.back()}
        className="hidden md:flex w-32 fixed left-0 top-0 h-screen bg-white border-r border-gray-300 items-center justify-center hover:bg-yellow-50 transition-colors group active:bg-yellow-100"
      >
        <div className="flex flex-col items-center gap-2 text-gray-800">
          <span className="text-4xl font-bold transition-transform group-hover:translate-x-[-4px] group-active:translate-x-[-8px]">←</span>
          <span className="font-mono text-sm">Back</span>
        </div>
      </button>
      
      
      <div className="max-w-4xl mx-auto w-full px-4 py-16 md:pl-32 pt-24 md:pt-16">
        <h1 className="text-3xl md:text-4xl font-mono font-bold mb-6 tracking-tight text-center mt-4 md:mt-12"><span className="text-yellow-500 font-bold uppercase">Live</span> <span className="ml-1 font-black uppercase">Votes</span></h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <p className="text-center font-mono text-sm text-gray-600 mb-2">
            Watch votes happen in real-time
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${subscriptionStatus === 'SUBSCRIBED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-mono text-xs">
              {subscriptionStatus === 'SUBSCRIBED' ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentVotes.length > 0 ? (
              recentVotes.map((vote, index) => (
                <div 
                  key={vote.id} 
                  className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm opacity-0 animate-fade-in-down"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-gray-500">{vote.time_since}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1 flex items-center">
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-gray-200 overflow-hidden mr-2 md:mr-3 cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all"
                        onClick={() => navigateToProfile(vote.winner_profile?.id)}
                      >
                        {vote.winner_profile?.profile_pic_url ? (
                          <Image
                            src={vote.winner_profile.profile_pic_url}
                            alt={vote.winner_profile.full_name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[100px]">
                          {vote.winner_profile?.full_name || 'Unknown'}
                        </p>
                        <span className="inline-block px-1 py-0.5 md:px-2 md:py-1 bg-green-100 text-green-800 text-xs font-mono rounded">
                          Winner
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-2 md:px-4">
                      <span className="font-mono text-sm md:text-lg">vs</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-end text-right">
                      <div>
                        <p className="font-mono text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[100px]">
                          {vote.loser_profile?.full_name || 'Unknown'}
                        </p>
                        <span className="inline-block px-1 py-0.5 md:px-2 md:py-1 bg-red-100 text-red-800 text-xs font-mono rounded">
                          Lost
                        </span>
                      </div>
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-gray-200 overflow-hidden ml-2 md:ml-3 cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all"
                        onClick={() => navigateToProfile(vote.loser_profile?.id)}
                      >
                        {vote.loser_profile?.profile_pic_url ? (
                          <Image
                            src={vote.loser_profile.profile_pic_url}
                            alt={vote.loser_profile.full_name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="font-mono text-gray-500">No votes recorded yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
