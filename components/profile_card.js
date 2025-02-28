import Image from "next/image";
import EmojiRain from './emoji_rain';
import Link from 'next/link';

export default function ProfileCard({ 
  title, 
  items, 
  experiences, 
  isRightAligned, 
  profilePicture, 
  onClick, 
  isSelected,
  isWinner,
  eloChange,
  rank,
  currentElo,
  totalProfiles,
  profiles,
  isAuthenticated,
  profileId
}) {
  const calculateNewRank = () => {
    if (!isSelected || !eloChange) return rank;
    
    const newElo = currentElo + eloChange;
    const sortedProfiles = [...profiles].sort((a, b) => {
      // If this is the current profile, use the new ELO
      const eloA = a.elo === currentElo ? newElo : a.elo;
      const eloB = b.elo === currentElo ? newElo : b.elo;
      return eloB - eloA;
    });
    
    return sortedProfiles.findIndex(p => p.elo === currentElo) + 1;
  };

  return (
    <>
      {isSelected && isWinner && (
        <EmojiRain emoji="😭" side={isRightAligned ? 'right' : 'left'} />
      )}
      {isSelected && !isWinner && (
        <EmojiRain emoji="🚀" side={isRightAligned ? 'right' : 'left'} />
      )}
      <div 
        className={`
          bg-white transition-all duration-500 p-4 sm:p-8 lg:p-12 flex group
          ${isRightAligned ? 'origin-right' : 'origin-left'}
          ${isSelected 
            ? (isWinner 
                ? 'w-[50%] opacity-100' 
                : 'w-[50%] opacity-50'
              ) 
            : 'w-[50%] hover:bg-yellow-50 cursor-pointer'
          }
          mt-8 sm:mt-12 lg:mt-16
        `}
        onClick={isSelected ? undefined : onClick}
      >
        <div className={`p-1 sm:p-4 lg:p-6 transition-all duration-300 w-full relative flex flex-col px-4 sm:px-0 lg:-mt-8 
          ${isRightAligned ? 'sm:pr-8 md:pr-12' : 'sm:pl-8 md:pl-12'}`}>
          {/* Profile Picture Section */}
          <div className={`flex flex-col sm:flex-row ${isRightAligned ? 'items-end sm:justify-end' : 'items-start sm:justify-start'} mb-4 sm:mb-4 lg:mb-8 gap-2 sm:gap-4`}>
            <div className={`w-32 h-32 sm:w-40 sm:h-40 xl:w-48 xl:h-48 rounded-md bg-gray-300 overflow-visible transition-all duration-300 
              ${isSelected ? '' : 'blur-md [-webkit-filter:blur(12px)] p-4'}`}>
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={title}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full rounded-md flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            {isSelected && (
              <div className={`font-mono text-xs sm:text-sm lg:text-lg flex flex-col self-center ${isRightAligned ? 'text-right' : 'text-left'} ${isRightAligned ? 'sm:order-first' : 'sm:order-last'}`}>
                <div>
                  Rank: #{calculateNewRank()}
                  {isAuthenticated ? (
                    eloChange && (
                      <span className={eloChange > 0 ? 'text-green-500' : 'text-red-500'}>
                        {' '}({eloChange > 0 
                          ? (rank > calculateNewRank() ? `↑${rank - calculateNewRank()}` : '-')
                          : (rank < calculateNewRank() ? `↓${calculateNewRank() - rank}` : '-')
                        })
                      </span>
                    )
                  ) : (
                    <span className={isWinner ? 'text-green-500' : 'text-red-500'}>
                      {' '}(-)
                    </span>
                  )}
                </div>
                <div>
                  ELO: {Math.round(currentElo)} 
                  {isAuthenticated ? (
                    eloChange && <span className={eloChange > 0 ? 'text-green-500' : 'text-red-500'}>
                      {' '}({eloChange > 0 ? '+' : ''}{eloChange})
                    </span>
                  ) : (
                    <span className={isWinner ? 'text-green-500' : 'text-red-500'}>
                      {' '}({isWinner ? '+0' : '-0'})
                    </span>
                  )}
                </div>
                              
              {/* View Profile button */}
              {isSelected && profileId && (
                <Link 
                  href={`/profile/${profileId}`}
                  className={`mt-2 px-3 py-1 bg-yellow-500 text-white text-xs sm:text-sm rounded-md hover:bg-yellow-600 transition-colors ${isRightAligned ? 'self-end' : 'self-start'}`}
                >
                  View Profile
                </Link>
              )}
              </div>
            )}
          </div>

          <h2 className={`text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 font-mono uppercase tracking-tight mx-1 sm:mx-4 transition-all duration-300 
            ${isSelected ? '' : 'blur-md [-webkit-filter:blur(12px)]'} ${isRightAligned ? 'text-right' : 'text-left'}`}>
            {title}
          </h2>
          
          <div className="space-y-2 sm:space-y-4 lg:space-y-6">
            {items.map((item, index) => (
              <div key={index} className={`mx-1 sm:mx-4 my-1 sm:my-2 lg:my-4 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold font-mono">{item.label}</h3>
                <p className={`text-sm sm:text-lg lg:text-2xl inline-block ${
                  item.value.toLowerCase().includes('engineering') ? "bg-purple-100" :
                  ['computer science', 'mathematics', 'stats', 'statistics', 'applied mathematics', 'computational mathematics', 'combinatorics', 'optimization'].includes(item.value.toLowerCase()) ? "bg-pink-100" :
                  "bg-yellow-100"
                } px-1 sm:px-2 py-0.5 sm:py-1 rounded-md`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="mt-4 sm:mt-8 lg:mt-12">
            <h3 className={`text-base sm:text-xl lg:text-3xl font-bold font-mono mb-2 sm:mb-4 lg:mb-6 mx-1 sm:mx-4 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>
              EXPERIENCE
            </h3>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {experiences?.map((experience, index) => (
                <div key={index} className="mb-3 sm:mb-4 lg:mb-6 last:mb-0">
                  <div className={`flex items-start gap-2 sm:gap-4 mb-1 sm:mb-2 ${isRightAligned ? 'flex-row-reverse' : 'flex-row'} transition-transform duration-300 hover:scale-105`}>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 relative flex-shrink-0 mt-1">
                      {experience.companyLogo ? (
                        <Image 
                          src={experience.companyLogo}
                          alt={`${experience.company} logo`}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={`text-${isRightAligned ? 'right' : 'left'}`}>
                      {experience.positions.length > 1 ? (
                        <>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{experience.company}</h3>
                          <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2">
                            {experience.positions.map((position, posIndex) => (
                              <div key={posIndex} className={`flex items-center ${isRightAligned ? 'flex-row-reverse text-right' : 'flex-row'}`}>
                                <span className="mx-2 text-base sm:text-lg leading-none relative font-bold">•</span>
                                <div className="text-gray-800">
                                  <p className="font-medium text-xs sm:text-sm">{position.title}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="transition-transform duration-300">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{experience.positions[0].title}</h3>
                          <p className="text-gray-600 font-medium text-xs sm:text-sm">{experience.company}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
