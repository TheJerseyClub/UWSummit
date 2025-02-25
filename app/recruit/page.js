import Navbar from '@/components/navbar'

export default function RecruitmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <main className="flex flex-col mt-[64px]">
        {/* Scrolling banner */}
        <div className="relative border-b border-black overflow-hidden">
          <div className="py-12 whitespace-nowrap bg-white">
            <div className="animate-marquee inline-block">
              {Array(10).fill("RECRUIT   ").map((text, i) => (
                <span key={i} className="font-mono font-black text-[10rem] md:text-[15rem] lg:text-[20rem] mx-8 leading-none">{text}</span>
              ))}
            </div>
            <div className="animate-marquee2 inline-block absolute top-12">
              {Array(10).fill("RECRUIT   ").map((text, i) => (
                <span key={i} className="font-mono font-black text-[10rem] md:text-[15rem] lg:text-[20rem] mx-8 leading-none">{text}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 py-16 max-w-7xl mx-auto">
          {/* Hero section */}
          <section className="mb-32 relative">
            <div className="absolute -right-4 top-0 w-64 h-64 bg-yellow-50 rounded-full opacity-50 blur-3xl"></div>
            <h1 className="font-mono text-6xl font-black mb-6 tracking-tight">
              Find your next
              <br />
              <span className="text-yellow-500">superstar intern</span>
            </h1>
            <p className="font-mono text-xl text-gray-600 max-w-2xl leading-relaxed">
              UWSummit uses advanced AI to match you with top University of Waterloo talent, analyzing skills, experience, and culture fit to find your perfect candidates.
            </p>
          </section>

          {/* Features grid */}
          <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-yellow-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-mono text-2xl font-bold mb-4">AI-Powered Matching</h3>
              <p className="font-mono text-gray-600">Our algorithms analyze thousands of profiles to find students whose skills and experience align perfectly with your needs.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-mono text-2xl font-bold mb-4">Curated Talent Pool</h3>
              <p className="font-mono text-gray-600">Access a pre-vetted pool of Waterloo's brightest students, all eager to bring fresh perspectives to your team.</p>
            </div>
          </section>

          {/* Stats section */}
          <section className="mb-32 bg-black text-white p-12 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="font-mono text-5xl font-black text-yellow-500 mb-2">94%</div>
                <div className="font-mono text-sm tracking-wider">PLACEMENT RATE</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-5xl font-black text-yellow-500 mb-2">48h</div>
                <div className="font-mono text-sm tracking-wider">AVERAGE MATCH TIME</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-5xl font-black text-yellow-500 mb-2">1000+</div>
                <div className="font-mono text-sm tracking-wider">ACTIVE STUDENTS</div>
              </div>
            </div>
          </section>

          {/* CTA section */}
          <section>
            <h2 className="font-mono text-4xl font-bold mb-8 tracking-wider">
              GET STARTED
            </h2>
            <div className="font-mono tracking-wide flex items-center gap-4">
              <a 
                href="mailto:nwjeremysu@gmail.com" 
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Contact Us
              </a>
              <span className="text-gray-500">or</span>
              <a 
                href="/recruit/signin" 
                className="text-yellow-500 hover:underline"
              >
                Sign in to scout superstars →
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
