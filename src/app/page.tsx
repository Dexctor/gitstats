'use client'

import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { GithubIcon, BarChart2, GitBranch, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSearch from '@/components/UserSearch';
import UserProfile from '@/components/UserProfile';
import UserComparison from "@/components/UserComparison";
import { useState, useEffect } from 'react';
import { searchGithubUser } from "@/lib/github";


// Définition des interfaces
interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  repoCount: number;
  topLanguages: Array<{ name: string; count: number }>;
  contributionsLastYear: Array<{
    date: string;
    commits: number;
    pullRequests: number;
    issues: number;
  }>;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  followers: number;
  following: number;
  publicGists: number;
  createdAt: string;
  bio: string;
  location: string;
  blog: string;
  company: string;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  email: string;
  created_at: string;
}

interface UserData {
  user: GitHubUser;
  stats: GitHubStats;
  repos: any[]; // Vous pouvez définir une interface plus précise pour les repos si nécessaire
}

const features = [
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Detailed Statistics",
    description: "Visualize your contributions and repository activity"
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Repository Management",
    description: "Access all your repositories at a glance"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaboration",
    description: "Track your community interactions"
  }
];

export default function Home() {
  const { data: session } = useSession() as { data: Session | null };
  const [searchedUser, setSearchedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user?.name) {
        try {
          setLoading(true);
          const userData = await searchGithubUser(session.user.name);
          setSearchedUser(userData as unknown as UserData);
        } catch (error) {
          console.error('Error loading user data:', error);
          // Ajouter une gestion d'erreur UI ici
        } finally {
          setLoading(false);
        }
      }
    };

    if (session) {
      loadUserData();
    } else {
      setLoading(false);  // Important: arrêter le loading s'il n'y a pas de session
    }
  }, [session]);

  const handleUserFound = (userData: UserData) => {
    setSearchedUser(userData);
  };

  if (session) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
              Welcome, {session.user?.name}!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Explore your GitHub statistics or search for other users
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UserSearch onUserFound={handleUserFound} />
          </motion.div>
          
          {loading ? (
            <motion.div 
              className="flex justify-center items-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="mt-4 text-gray-500 text-center">Loading...</div>
              </div>
            </motion.div>
          ) : (
            searchedUser && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <UserProfile userData={searchedUser} />
                <UserComparison />
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-16 sm:pt-20 lg:pt-24 px-3 sm:px-6 lg:px-8 dark:bg-gray-900"
    >
      <div className="container mx-auto max-w-7xl mt-4 sm:mt-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Explore GitHub Differently
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            A new way to visualize and manage your GitHub projects
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn("github")}
            className="bg-black text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 mx-auto hover:bg-gray-800 transition-colors"
          >
            <GithubIcon className="w-5 h-5" />
            <span>Connect with GitHub</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-blue-50 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

    
      </div>
    </motion.div>
  );
}