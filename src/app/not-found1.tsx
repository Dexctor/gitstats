'use client'

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex items-center justify-center px-4 py-16"
    >
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl sm:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-4"
        >
          404
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold dark:text-gray-100"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-md mx-auto"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
        >
          <Button
            asChild
            variant="default"
            className="bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
} 