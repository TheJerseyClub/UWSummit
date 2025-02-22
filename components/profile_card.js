import Image from "next/image";

export default function ProfileCard({ title, items, experiences, isRightAligned }) {
  return (
    <div className="w-1/2 h-full bg-white hover:bg-yellow-50 transition-all duration-300 cursor-pointer p-16 group">
      <div className="p-8 pt-16 transition-all duration-300 group-hover:scale-[1.02]">
        {/* Profile Picture Section */}
        <div className={`flex ${isRightAligned ? 'justify-end' : 'justify-start'} mb-8`}>
          <div className="w-32 h-32 rounded-3xl bg-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105">
            {/* Placeholder for profile picture */}
            <div className="w-full h-full rounded-md
            flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className={`text-4xl font-bold mb-8 font-mono uppercase tracking-tight mx-4 my-16 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>{title}</h2>
        
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className={`mx-4 my-4 transition-transform duration-300 hover:scale-105 ${isRightAligned ? 'text-right' : 'text-left'}`}>
              <h3 className="text-lg font-bold font-mono">{item.label}</h3>
              <p className={`text-2xl inline-block ${
                item.value === "Engineering" ? "bg-purple-100" :
                item.value === "Computer Science" ? "bg-pink-100" :
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
                <div className={`flex items-center gap-4 mb-2 ${isRightAligned ? 'flex-row-reverse' : 'flex-row'} transition-transform duration-300 hover:scale-105`}>
                  {experience.companyLogo && (
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image 
                        src={experience.companyLogo}
                        alt={`${experience.company} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className={`text-${isRightAligned ? 'right' : 'left'}`}>
                    <h3 className="font-bold text-gray-900">{experience.title}</h3>
                    <p className="text-gray-600">{experience.company}</p>
                    <p className="text-sm text-gray-500">{experience.period}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
