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
          bg-white transition-all duration-500 p-16 flex group
          ${isRightAligned ? 'origin-right' : 'origin-left'}
          ${isSelected 
            ? (isWinner 
                ? 'w-[50%] scale-110' 
                : 'w-[50%] scale-90 opacity-50'
              ) 
            : 'w-1/2 hover:scale-[1.02] hover:bg-yellow-50 cursor-pointer'
          }
        `}
        onClick={isSelected ? undefined : onClick}
      >
        <div className="p-8 pt-16 transition-all duration-300 w-full relative">
          {/* Profile Picture Section */}
          <div className={`flex ${isRightAligned ? 'justify-end' : 'justify-start'} mb-8 items-center gap-6`}>
            <div className={`w-32 h-32 rounded-3xl bg-gray-200 overflow-hidden transition-all duration-300 
              ${isSelected ? '' : 'blur-md'}`}>
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={title}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
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
              <div className={`font-mono text-lg ${isRightAligned ? 'text-right' : 'text-left'}`}>
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

          <h2 className={`text-4xl font-bold mb-2 font-mono uppercase tracking-tight mx-4 transition-all duration-300 
            ${isSelected ? '' : 'blur-md'} ${isRightAligned ? 'text-right' : 'text-left'}`}>
            {title}
          </h2>
          
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className={`mx-4 my-4 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold font-mono">{item.label}</h3>
                <p className={`text-2xl inline-block ${
                  item.value.toLowerCase().includes('engineering') ? "bg-purple-100" :
                  ['computer science', 'mathematics', 'stats', 'statistics', 'applied mathematics', 'computational mathematics', 'combinatorics', 'optimization'].includes(item.value.toLowerCase()) ? "bg-pink-100" :
                  "bg-yellow-100"
                } px-2 py-1 rounded-md`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="mt-12">
            <h3 className={`text-2xl font-bold font-mono mb-6 mx-4 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>EXPERIENCE</h3>
            <div className="space-y-6">
              {experiences?.map((experience, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className={`flex items-start gap-4 mb-2 ${isRightAligned ? 'flex-row-reverse' : 'flex-row'} transition-transform duration-300 hover:scale-105`}>
                    {experience.companyLogo && (
                      <div className="w-8 h-8 relative flex-shrink-0 mt-1">
                        <Image 
                          src={experience.companyLogo}
                          alt={`${experience.company} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className={`text-${isRightAligned ? 'right' : 'left'}`}>
                      {experience.positions.length > 1 ? (
                        // Multiple positions: Show company as main heading
                        <>
                          <h3 className="font-bold text-gray-900">{experience.company}</h3>
                          <div className="space-y-2 mt-2">
                            {experience.positions.map((position, posIndex) => (
                              <div key={posIndex} className="relative pl-8">
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
                                  <p className="font-medium">{position.title}</p>
                                  <p className="text-sm text-gray-500">
                                    {`${position.startMonth} ${position.startYear} → ${position.endMonth} ${position.endYear}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        // Single position: Show position title as main heading
                        <div className="transition-transform duration-300">
                          <h3 className="font-bold text-gray-900">{experience.positions[0].title}</h3>
                          <p className="text-gray-600 font-medium">{experience.company}</p>
                          <p className="text-sm text-gray-500">
                            {`${experience.positions[0].startMonth} ${experience.positions[0].startYear} → ${experience.positions[0].endMonth} ${experience.positions[0].endYear}`}
                          </p>
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
