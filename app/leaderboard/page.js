'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import Navbar from '@/components/navbar'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const PROFILES_PER_PAGE = 15
  const router = useRouter()
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Join elo table with profiles to get the most up-to-date ELO scores
        const { data, error } = await supabase
          .from('elo')
          .select(`
            score,
            user_id,
            profiles:user_id (
              id, 
              full_name, 
              profile_pic_url, 
              linkedin_url
            )
          `)
          .not('profiles.linkedin_url', 'is', null)
          .order('score', { ascending: false })
          .range(0, PROFILES_PER_PAGE - 1);

        if (error) throw error;
        
        // Transform the data to match the expected format
        const transformedData = data.map(item => ({
          id: item.profiles.id,
          full_name: item.profiles.full_name,
          elo: item.score, // Use score from elo table
          profile_pic_url: item.profiles.profile_pic_url,
          linkedin_url: item.profiles.linkedin_url
        }));
        
        setProfiles(transformedData);
        setHasMore(data.length === PROFILES_PER_PAGE);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 100);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (profile) => {
    if (profile && profile.id) {
      router.push(`/profile/${profile.id}`);
    } else if (profile && profile.linkedin_url) {
      window.open(profile.linkedin_url, '_blank');
    }
  }

  const loadMoreProfiles = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      
      const startIndex = page * PROFILES_PER_PAGE;
      const endIndex = startIndex + PROFILES_PER_PAGE - 1;
      
      const { data, error } = await supabase
        .from('elo')
        .select(`
          score,
          user_id,
          profiles:user_id (
            id, 
            full_name, 
            profile_pic_url, 
            linkedin_url
          )
        `)
        .not('profiles.linkedin_url', 'is', null)
        .order('score', { ascending: false })
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      if (data.length > 0) {
        // Transform the data to match the expected format
        const transformedData = data.map(item => ({
          id: item.profiles.id,
          full_name: item.profiles.full_name,
          elo: item.score, // Use score from elo table
          profile_pic_url: item.profiles.profile_pic_url,
          linkedin_url: item.profiles.linkedin_url
        }));
        
        setProfiles(prev => [...prev, ...transformedData]);
        setPage(prev => prev + 1);
        setHasMore(data.length === PROFILES_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more profiles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderPodium = () => {
    const topThree = profiles.slice(0, 3)
    const positions = [1, 0, 2]

    const mountainColors = {
      0: {
        main: 'fill-yellow-500 group-hover:fill-yellow-400',
        shadow: 'fill-yellow-600 group-hover:fill-yellow-500',
      },
      1: {
        main: 'fill-gray-400 group-hover:fill-gray-300',
        shadow: 'fill-gray-500 group-hover:fill-gray-400',
      },
      2: {
        main: 'fill-amber-800 group-hover:fill-amber-700',
        shadow: 'fill-amber-700 group-hover:fill-amber-600',
      }
    }

    const mountainHeights = {
      0: 'h-40 md:h-48',
      1: 'h-32 md:h-40',
      2: 'h-24 md:h-32'
    }

    const getMountainPath = (position) => {
      // Different path patterns for each position
      const patterns = {
        0: {
          main: 'M0 100 L15 70 L25 80 L40 45 L50 20 L60 45 L75 60 L85 50 L100 100',
          shadow: 'M40 45 L50 20 L60 45 L75 60 L85 50 L100 100 L65 100 L55 85 L45 95 Z',
          snow: 'M38 47 L50 20 L62 47 L58 48 L54 45 L50 47 L46 45 L42 48 Z M73 62 L85 50 L88 55 L83 58 L78 56 Z'
        },
        1: {
          main: 'M0 100 L20 60 L30 70 L45 35 L50 25 L55 35 L70 55 L80 45 L100 100',
          shadow: 'M45 35 L50 25 L55 35 L70 55 L80 45 L100 100 L60 100 L50 80 Z',
          snow: 'M43 37 L50 25 L57 37 L53 38 L50 35 L47 38 Z M68 57 L80 45 L83 50 L77 53 Z'
        },
        2: {
          main: 'M100 100 L75 50 L65 60 L55 40 L50 30 L45 40 L35 50 L25 40 L0 100',
          shadow: 'M35 50 L25 40 L0 100 L35 100 L45 85 L55 40 L50 30 L45 40 Z',
          snow: 'M57 42 L50 30 L43 42 L47 43 L50 40 L53 43 Z M37 52 L25 40 L22 45 L28 48 Z'
        }
      }
      return patterns[position]
    }

    return (
      <div className="flex flex-col items-center mb-16 mt-10 px-4">
        <div className="flex justify-center items-end max-w-[300px] md:max-w-[380px] w-full">
          {positions.map((position) => {
            const profile = topThree[position]
            if (!profile) return null

            const placement = position === 0 ? '1st' : position === 1 ? '2nd' : '3rd'
            const paths = getMountainPath(position)
            
            return (
              <div 
                key={position} 
                className={`flex flex-col items-center -mx-4 md:-mx-2 translate-y-8 opacity-0 ${
                  mounted ? 'animate-slide-up' : ''
                } ${
                  position === 1 ? 'z-30' : position === 0 ? 'z-20' : 'z-10'
                }`}
                style={{ animationDelay: `${position * 200}ms` }}
              >
                <div 
                  onClick={() => handleProfileClick(profile)}
                  className="flex flex-col items-center mb-1 md:mb-2 cursor-pointer group p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-md bg-gray-200 overflow-hidden mb-2 md:mb-3 border border-gray-300 group-hover:border-yellow-500 transition-colors shadow-sm">
                    {profile.profile_pic_url ? (
                      <Image 
                        src={profile.profile_pic_url} 
                        alt={profile.full_name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-sm md:text-base font-bold">{profile.full_name}</span>
                  <span className="font-mono text-xs md:text-sm text-gray-500">{profile.elo} ELO</span>
                </div>
                <div className={`w-32 md:w-40 ${mountainHeights[position]} relative transition-colors -mt-1`}>
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Base mountain shape */}
                    <path
                      d={paths.main}
                      className={`${mountainColors[position].main} transition-colors`}
                    />
                    
                    {/* Shadow details */}
                    <path
                      d={paths.shadow}
                      className={`${mountainColors[position].shadow} transition-colors opacity-40`}
                    />
                    
                    {/* Snow caps with multiple peaks */}
                    <path
                      d={paths.snow}
                      className="fill-white opacity-30"
                    />
                    
                    {/* Additional snow detail */}
                    <path
                      d={paths.snow}
                      className="fill-white opacity-20"
                      transform="translate(2, 2)"
                    />
                  </svg>
                  <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-mono font-bold text-white text-lg md:text-xl drop-shadow-md">
                    {placement}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        
        <div 
          className={`h-1 bg-gray-300 w-full max-w-[400px] md:max-w-[480px] mt-0 rounded-full shadow-sm translate-y-8 opacity-0 ${
            mounted ? 'animate-slide-up' : ''
          }`}
          style={{ animationDelay: '600ms' }}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <p className="font-mono">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
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
      
      <div className="max-w-4xl mx-auto w-full px-4 py-16 md:pl-32">
        <h1 className="text-4xl font-mono font-bold mb-12 tracking-tight text-center mt-12">Leaderboard 🏆</h1>
        
        {/* Add podium section */}
        {renderPodium()}
        
        {/* List remaining players with delayed animation */}
        <div className="space-y-3 md:space-y-4">
          {profiles.slice(3).map((profile, index) => (
            <div 
              key={index + 3}
              onClick={() => handleProfileClick(profile)}
              className={`flex items-center justify-between p-4 md:p-6 bg-white border border-gray-200 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer translate-y-8 opacity-0 ${mounted ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: '600ms' }}
            >
              <div className="flex items-center gap-3 md:gap-6">
                <span className="font-mono text-xl md:text-2xl font-bold text-gray-400 w-8 md:w-12">
                  #{index + 4}
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {profile.profile_pic_url ? (
                    <Image 
                      src={profile.profile_pic_url} 
                      alt={profile.full_name}
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
                <span className="font-mono text-base md:text-xl">
                  {profile.full_name}
                </span>
              </div>
              <span className="font-mono text-base md:text-xl font-bold">
                {Math.round(profile.elo)} ELO
              </span>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8 mb-16">
            {loadingMore ? (
              <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
            ) : (
              <button
                onClick={loadMoreProfiles}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-mono text-base hover:bg-yellow-50 transition-colors cursor-pointer translate-y-8 opacity-0 animate-slide-up"
                style={{ animationDelay: '800ms' }}
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
