'use client'

import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "@/components/icons/github";

// Composant de bienvenue mémorisé
const WelcomeMessage = memo(({ name }: { name: string }) => (
  <>
    <h1 className="text-2xl sm:text-3xl font-bold mb-4">
      Welcome, {name}!
    </h1>
    <p className="text-gray-600 text-base sm:text-lg mb-4">
      You are now connected. You can start exploring your repositories.
    </p>
  </>
));
WelcomeMessage.displayName = 'WelcomeMessage';

// Composant de page de connexion mémorisé
const LoginView = memo(() => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500"
      >
        Welcome to GitStats
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg sm:text-xl text-gray-600 mb-8"
      >
        Connect with your GitHub account to explore your repositories and gain valuable insights.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          onClick={() => signIn("github")}
          className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 mx-auto transition-colors"
        >
          <GithubIcon className="w-5 h-5" />
          <span>Connect with GitHub</span>
        </Button>
      </motion.div>
    </div>
  </div>
));
LoginView.displayName = 'LoginView';

function ClientPage() {
  const { data: session } = useSession();

  return (
    <AnimatePresence mode="wait">
      {session ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        >
          <WelcomeMessage name={session.user?.name || ''} />
        </motion.div>
      ) : (
        <LoginView />
      )}
    </AnimatePresence>
  );
}

export default memo(ClientPage);