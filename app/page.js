import Image from "next/image";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile_card";

export default function Home() {
  const studentProfile = {
    title: "Student Profile",
    items: [
      { label: "PROGRAM", value: "Computer Science" },
    ],
    experiences: [
      {
        title: "Software Engineer Intern",
        company: "Company Name",
        period: "Summer 2023",
        companyLogo: "/path/to/company1-logo.png"
      },
      {
        title: "Full Stack Developer",
        company: "Company Name",
        period: "Winter 2023",
        companyLogo: "/path/to/company2-logo.png"
      }
    ]
  };

  return (
    <main className="min-h-screen flex flex-col relative">
      <Navbar /> 

      <div className="flex flex-row relative h-screen overflow-hidden">
        <ProfileCard {...studentProfile} isRightAligned={true} />
        
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200"></div>
        {/* <div className="absolute left-1/2 top-[30%] -translate-x-1/2 text-center">
          <p className="font-mono text-gray-600 mb-4 animate-bounce">
            Click a side to choose
          </p>
        </div> */}

        <button className="absolute left-1/2 top-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-y-[4px] transition-all z-10 rounded-md">
          Equal =
        </button>

        <ProfileCard {...studentProfile} isRightAligned={false} />
      </div>
    </main>
  );
}
