'use client'

import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Github as GithubIcon, 
  LogOut as LogOutIcon, 
  Menu as MenuIcon, 
  User as UserIcon,
  Moon,
  Sun,
  Coffee
} from "lucide-react";
import Image from 'next/image'
import { useTheme } from "@/components/ThemeProvider";

// Composant du logo mémorisé
const Logo = memo(() => (
  <Link href="/">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 cursor-pointer"
    >
      <GithubIcon className="w-6 h-6" />
      <span className="font-bold text-xl hidden sm:inline dark:text-gray-100">GitStats</span>
    </motion.div>
  </Link>
));
Logo.displayName = 'Logo';

// Composant du profil utilisateur mémorisé
const UserProfile = memo(({ user, onSignOut }: { 
  user: { image?: string | null; name?: string | null }, 
  onSignOut: () => void 
}) => (
  <div className="flex items-center gap-2 sm:gap-4">
    <Link href="/profile">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2 sm:px-4 py-2"
      >
        {user.image && (
          <Image 
            src={user.image}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
            priority
          />
        )}
        <span className="text-sm font-medium hidden sm:inline dark:text-gray-100">{user.name}</span>
      </motion.div>
    </Link>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSignOut}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
    >
      <LogOutIcon className="w-5 h-5 dark:text-gray-400" />
    </motion.button>
  </div>
));
UserProfile.displayName = 'UserProfile';

function ClientHeader() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 fixed w-full z-50"
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2 sm:gap-4">
            <motion.a
              href="https://www.buymeacoffee.com/antoinedewas"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 bg-[#FFDD00] text-black px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#FFDD00]/90 transition-colors"
            >
              <Coffee className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Buy me a coffee</span>
            </motion.a>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.button>

              <AnimatePresence mode="wait">
                {session ? (
                  <UserProfile 
                    user={session.user} 
                    onSignOut={handleSignOut}
                  />
                ) : (
                  <motion.button
                    key="login-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signIn("github")}
                    className="flex items-center gap-1.5 sm:gap-2 bg-black dark:bg-gray-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Login with GitHub</span>
                    <span className="sm:hidden">Login</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default memo(ClientHeader);