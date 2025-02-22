import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-white">
      <Navbar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-end">
        
        {/* Mission statement */}
        <div className="max-w-4xl self-end p-8 md:p-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter mb-8 text-right">
          <span className="text-yellow-400">UW</span>aterloo&apos;s Secondary Job Board
          </h1>
        </div>

        {/* Brutalist decorative line */}
        <div className="w-full h-[2px] bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

      </div>
      <Footer />
    </main>
  );
}
