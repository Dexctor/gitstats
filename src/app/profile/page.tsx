'use client'

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { searchGithubUser } from "@/lib/github";
import UserProfile from "@/components/UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GitHubStats from "@/components/GitHubStats";
import TrendAnalysis from "@/components/TrendAnalysis";
import UserComparison from "@/components/UserComparison";

interface UserData {
  // Add appropriate types based on your GitHub API response
  login: string;
  name: string;
  // ... other fields
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.name) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Assuming searchGithubUser only needs the username
        const data = await searchGithubUser(session.user.name);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      loadUserData();
    }
  }, [session]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Show login message if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen pt-24 sm:pt-28 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner message="Loading profile data..." />;
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className="min-h-screen pt-24 sm:pt-28 px-4 flex items-center justify-center">
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {userData && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UserProfile userData={userData} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Separate loading spinner component
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="min-h-screen pt-24 sm:pt-28 px-4 flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="mt-4 text-gray-500 text-center">{message}</div>
    </div>
  </div>
); 