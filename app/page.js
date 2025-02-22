'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile_card";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .not('linkedin_url', 'is', null);
        if (error) throw error;

        // Only filter out current user if we have a user ID
        const otherProfiles = user?.id 
          ? data.filter(profile => profile.id !== user.id)
          : data;

        const shuffled = otherProfiles.sort(() => 0.5 - Math.random());
        const selectedProfiles = shuffled.slice(0, 2);

        setProfiles(selectedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const createProfileData = (profile) => ({
    title: profile.full_name || "Anonymous",
    profilePicture: profile.profile_pic_url,
    items: [
      {
        label: "PROGRAM",
        value: profile.education?.find(edu => 
          edu.school?.toLowerCase().includes('waterloo')
        )?.field_of_study || "Not specified"
      }
    ],
    experiences: profile.experiences?.map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      period: `${exp.starts_at?.year || ''} - ${exp.ends_at?.year || 'Present'}`,
      companyLogo: exp.company_logo_url
    })) || []
  });

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col relative">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="font-mono">Loading profiles...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col relative">
      <Navbar profilePicture={user ? profiles.find(p => p.id === user.id)?.profile_pic_url : null} />
      <div className="flex flex-row relative h-screen">
        {profiles.length >= 2 ? (
          <>
            <ProfileCard {...createProfileData(profiles[0])} isRightAligned={true} />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200"></div>
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-y-[4px] transition-all z-10 rounded-md">
              Equal =
            </button>
            <ProfileCard {...createProfileData(profiles[1])} isRightAligned={false} />
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="font-mono text-gray-600">No profiles available</p>
          </div>
        )}
      </div>
    </main>
  );
}
