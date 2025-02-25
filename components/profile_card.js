import Image from "next/image";
import EmojiRain from './emoji_rain';

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
  profiles
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
        <EmojiRain emoji="🚀" side={isRightAligned ? 'right' : 'left'} />
      )}
      {isSelected && !isWinner && (
        <EmojiRain emoji="😢" side={isRightAligned ? 'right' : 'left'} />
      )}
      <div 
        className={`
          bg-white transition-all duration-500 p-4 sm:p-8 lg:p-16 flex group
          ${isRightAligned ? 'origin-right' : 'origin-left'}
          ${isSelected 
            ? (isWinner 
                ? 'w-[50%] opacity-100' 
                : 'w-[50%] opacity-50'
              ) 
            : 'w-[50%] hover:bg-yellow-50 cursor-pointer'
          }
        `}
        onClick={isSelected ? undefined : onClick}
      >
        <div className="p-1 sm:p-4 lg:p-8 transition-all duration-300 w-full relative flex flex-col px-4 sm:px-0">
          {/* Profile Picture Section */}
          <div className={`flex flex-col sm:flex-row ${isRightAligned ? 'items-end sm:justify-end' : 'items-start sm:justify-start'} mb-4 sm:mb-4 lg:mb-8 gap-2 sm:gap-4`}>
            <div className={`w-32 h-32 sm:w-24 sm:h-24 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-md bg-gray-300 overflow-visible transition-all duration-300 
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
                  {eloChange && (
                    <span className={eloChange > 0 ? 'text-green-500' : 'text-red-500'}>
                      {' '}({eloChange > 0 
                        ? (rank > calculateNewRank() ? `↑${rank - calculateNewRank()}` : '-')
                        : (rank < calculateNewRank() ? `↓${calculateNewRank() - rank}` : '-')
                      })
                    </span>
                  )}
                </div>
                <div>
                  ELO: {Math.round(currentElo + eloChange)} 
                  {eloChange && <span className={eloChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    {' '}({eloChange > 0 ? '+' : ''}{eloChange})
                  </span>}
                </div>
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
            <h3 className={`text-base sm:text-xl lg:text-2xl font-bold font-mono mb-2 sm:mb-4 lg:mb-6 mx-1 sm:mx-4 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>
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
                              <div key={posIndex} className="relative pl-6 sm:pl-8">
                                <svg 
                                  className={`absolute ${isRightAligned ? 'right-0 rotate-180' : 'left-0'} top-0 h-full w-8`} 
                                  viewBox="0 0 32 60"
                                >
                                  <path
                                    d="M16 0 L 16 30 L 32 30"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="2"
                                  />
                                </svg>
                                <div className="text-gray-600">
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
