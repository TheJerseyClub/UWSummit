'use client'

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

// Static leaderboard data - top 10 profiles
const TOP_LEADERBOARD = [
  {
    full_name: "George Shao",
    elo: 1372,
    profile_pic_url: "https://tjzsdlhdjnbjvhxgxrin.supabase.co/storage/v1/object/public/logos/profile-pics/george-shao-1741072340441.png",
    linkedin_url: "https://www.linkedin.com/in/georgeshao/",
    rank: 1
  },
  {
    id: "user-id-2",
    full_name: "Irene C.",
    elo: 1342,
    profile_pic_url: "https://tjzsdlhdjnbjvhxgxrin.supabase.co/storage/v1/object/public/logos/profile-pics/irene-c.-1741225281575.png",
    linkedin_url: "https://www.linkedin.com/in/irenechoii/",
    rank: 2
  },
  {
    id: "user-id-3",
    full_name: "Harry Jiang",
    elo: 1284,
    profile_pic_url: "https://tjzsdlhdjnbjvhxgxrin.supabase.co/storage/v1/object/public/logos/profile-pics/harry-jiang-1741219446004.png",
    linkedin_url: "https://www.linkedin.com/in/harryjiang7/",
    rank: 3
  },
  // Add the rest of your top 10 here
];

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Simple animation timing
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Render podium with mountains for top 3
  const renderPodium = () => {
    const topThree = TOP_LEADERBOARD.slice(0, 3);
    const positions = [1, 0, 2]; // Silver, Gold, Bronze order

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
    };

    const mountainHeights = {
      0: 'h-40 md:h-48',
      1: 'h-32 md:h-40',
      2: 'h-24 md:h-32'
    };

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
      };
      return patterns[position];
    };

    return (
      <div className="flex flex-col items-center mb-16 mt-10 px-4">
        <div className="flex justify-center items-end max-w-[300px] md:max-w-[380px] w-full">
          {positions.map((position) => {
            const profile = topThree[position];
            if (!profile) return null;

            const placement = position === 0 ? '1st' : position === 1 ? '2nd' : '3rd';
            const paths = getMountainPath(position);
            
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
                  onClick={() => window.open(profile.linkedin_url, '_blank')}
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
                  <span className="font-mono text-xs md:text-sm text-gray-500">{Math.round(profile.elo)} ELO</span>
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
            );
          })}
        </div>
        
        <div 
          className={`h-1 bg-gray-300 w-full max-w-[400px] md:max-w-[480px] mt-0 rounded-full shadow-sm translate-y-8 opacity-0 ${
            mounted ? 'animate-slide-up' : ''
          }`}
          style={{ animationDelay: '600ms' }}
        />
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-white">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Mountain silhouette background */}
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 320L320 220L520 280L920 180L1200 280L1440 220L1440 320L0 320Z"
              fill="#000000"
              className="opacity-70"
            />
            <path
              d="M320 220L420 250L520 280L720 200L920 180L1020 230L1200 280L1320 250L1440 220"
              fill="#FFFFFF"
              className="opacity-10"
            />
          </svg>
        </div>
        
        {/* Content */}
        <div className={`max-w-2xl w-full text-center z-10 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white border-2 border-black p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl md:text-5xl font-mono font-black mb-6 tracking-tight">
              <span className="text-yellow-500">Thanks</span> for Playing!
            </h1>
            
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            
            <p className="font-mono text-lg text-gray-700 mb-12">
              We've been acquired by <a href="https://linkd.inc/" className="text-yellow-500 hover:underline">Linkd (YC X25)</a> and will be relaunching soon!
            </p>
            
            <div className="space-y-4">
              <p className="font-mono text-gray-600">
                Thanks for being part of our community!
              </p>
              <div className="font-mono text-sm text-gray-500">
            <p>- A project by <a href="https://www.linkedin.com/in/jeffreyllin/" className="text-yellow-500 hover:underline">Jeffrey</a> And <a href="https://www.linkedin.com/in/jeremy-su-9a0057236/" className="text-yellow-500 hover:underline">Jeremy</a></p>
          </div>
            </div>
          </div>
          
          {/* Static Leaderboard */}
          <div className="bg-white border-2 border-black p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl md:text-3xl font-mono font-bold mb-6 tracking-tight">
              Congratulations to the finalists 🏆
            </h2>
            
            {/* Podium section for top 3 */}
            {renderPodium()}
          </div>

        </div>
      </div>
    </main>
  );
}
