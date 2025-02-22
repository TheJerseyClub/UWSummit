'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/navbar";
import ProfileCard from "@/components/profile_card";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeProgram } from '@/utils/programNormalizer';
import { groupExperiences } from '@/utils/experienceGrouper';

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

  const createProfileData = (profile) => {
    const programInfo = normalizeProgram(
      profile.education?.find(edu => 
        edu.school?.toLowerCase().includes('waterloo')
      )?.field_of_study
    );

    const groupedExperiences = groupExperiences(profile.experiences);
    
    return {
      title: profile.full_name || "Anonymous",
      items: [
        {
          label: "PROGRAM",
          value: `${programInfo.name} ${programInfo.emoji}`
        }
      ],
      experiences: groupedExperiences.map(group => ({
        title: group.company,
        company: group.company,
        companyLogo: group.companyLogo,
        positions: group.positions.map(pos => ({
          title: pos.title,
          startMonth: pos.startMonth,
          startYear: pos.startYear,
          endMonth: pos.endMonth,
          endYear: pos.endYear
        }))
      }))
    };
  };

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
      <Navbar />
      <div className="flex flex-row relative flex-1 h-full">
        {profiles.length >= 2 ? (
          <>
            <ProfileCard {...createProfileData(profiles[0])} isRightAligned={true} />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gray-200"></div>
            <button className="absolute left-1/2 top-[50vh] -translate-x-1/2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono uppercase tracking-wider hover:shadow-none hover:translate-y-[4px] transition-all z-10 rounded-md">
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
