import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-white">
      <Navbar />
      
      {/* Main content area */}
      <div className="flex-1 p-8 md:p-16 flex flex-col">
        
        {/* Mission statement */}
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter mb-8">
          <span className="text-yellow-400">UW</span>aterloo&apos;s Secondary Job Board
          </h1>
        </div>

        {/* Brutalist decorative line */}
        <div className="w-full h-[2px] bg-black my-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

      </div>
    </main>
  );
}
