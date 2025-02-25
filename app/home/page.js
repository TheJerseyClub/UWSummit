import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="h-screen flex flex-col relative bg-[#F7F7F7] overflow-hidden">
      {/* Mountain Silhouettes with Snow */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full opacity-90 transform scale-150"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back mountain range */}
          <path
            d="M-200 750L320 200L520 400L920 100L1200 500L1520 250L1650 600L2000 400V900H-200V750Z"
            fill="#000000"
            className="opacity-90"
          />
          {/* Snow caps for back range */}
          <path
            d="M320 200L420 300L520 400L720 250L920 100L1020 200L1200 500L1320 375L1520 250L1585 425L1650 600L1750 500L2000 400L1900 450L1700 650L1600 625L1450 300L1300 525L1150 475L1000 150L850 125L700 275L600 425L450 225L320 200Z"
            fill="#FFFFFF"
            className="opacity-20"
          />
          {/* Additional snow detail for back range */}
          <path
            d="M920 100L970 150L1020 200L1070 175L1120 225L1200 500L1250 450L1300 525L1350 500L1400 550L1450 300L1500 350L1520 250L1540 300L1585 425L1600 400L1650 600L1700 550L1750 500L1800 525L1850 475L1900 450L1950 475L2000 400L1900 450L1700 650L1600 625L1450 300L1300 525L1150 475L1000 150L920 100Z"
            fill="#FFFFFF"
            className="opacity-30"
          />
          
          {/* Middle mountain range */}
          <path
            d="M-200 800L320 400L520 550L920 300L1200 650L1520 450L1650 700L2000 550V900H-200V800Z"
            fill="#000000"
            className="opacity-80"
          />
          {/* Snow caps for middle range */}
          <path
            d="M320 400L420 500L520 550L720 450L920 300L1020 400L1200 650L1320 550L1520 450L1585 525L1650 700L1750 600L1850 525L1750 575L1600 725L1500 625L1350 475L1200 675L1050 575L900 350L750 425L600 575L450 425L320 400Z"
            fill="#FFFFFF"
            className="opacity-15"
          />
          {/* Additional snow detail for middle range */}
          <path
            d="M920 300L970 350L1020 400L1070 375L1120 425L1200 650L1250 600L1300 625L1350 600L1400 650L1450 500L1500 550L1520 450L1540 500L1585 525L1600 500L1650 700L1700 650L1750 600L1800 625L1850 525L1750 575L1600 725L1500 625L1350 475L1200 675L1050 575L920 300Z"
            fill="#FFFFFF"
            className="opacity-25"
          />

          {/* Front mountain range */}
          <path
            d="M-200 850L320 600L520 700L920 500L1200 800L1520 650L1650 800L2000 700V900H-200V850Z"
            fill="#000000"
            className="opacity-70"
          />
          {/* Snow caps for front range */}
          <path
            d="M320 600L420 650L520 700L720 600L920 500L1020 600L1200 800L1320 700L1520 650L1585 725L1650 800L1750 750L1850 700L1750 725L1600 825L1500 775L1350 675L1200 825L1050 725L900 550L750 625L600 725L450 625L320 600Z"
            fill="#FFFFFF"
            className="opacity-10"
          />
          {/* Additional snow detail for front range */}
          <path
            d="M920 500L970 550L1020 600L1070 575L1120 625L1200 800L1250 750L1300 775L1350 750L1400 800L1450 700L1500 750L1520 650L1540 700L1585 725L1600 700L1650 800L1700 750L1750 725L1800 750L1850 700L1750 725L1600 825L1500 775L1350 675L1200 825L1050 725L920 500Z"
            fill="#FFFFFF"
            className="opacity-20"
          />
        </svg>
      </div>
      
      <Navbar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-end relative z-10">
        
        {/* Mission statement */}
        <div className="max-w-4xl self-end p-8 md:p-16">
          <div className="flex flex-col items-end gap-2">
            <div className="bg-black px-4 py-1">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter text-right">
                <span className="text-yellow-400">UW</span><span className="text-white">aterloo&apos;s</span>
              </span>
            </div>
            <div className="bg-black px-4 py-1">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter text-right text-white">
                Secondary Job
              </span>
            </div>
            <div className="bg-black px-4 py-1">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter text-right text-white">
                Board
              </span>
            </div>
          </div>
        </div>

      </div>
      <div className="20vh sm:30vh flex flex-col justify-end relative z-10 bg-white border-t border-black">
        <Footer />
      </div>
    </main>
  );
}
