'use client'

import { motion } from "framer-motion";
import { 
  Github as GithubIcon, 
  Twitter, 
  Linkedin,
  Coffee
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 dark:bg-gray-900 border-t border:gray-200 dark:border-gray-800 mt-auto"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center md:text-left col-span-1 lg:col-span-2">
            <motion.div 
              className="flex items-center gap-2 mb-4 justify-center md:justify-start"
              whileHover={{ scale: 1.05 }}
            >
              <GithubIcon className="w-6 h-6 dark:text-gray-300" />
              <span className="font-bold text-xl dark:text-gray-100">GitStats</span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Explore and analyze your GitHub projects intuitively.
            </p>
            <motion.a
              href="https://www.buymeacoffee.com/antoinedewas"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#FFDD00]/90 transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </motion.a>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 dark:text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 dark:text-gray-100">Follow Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <motion.a
                href="https://x.com/antoinedewas1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/antoine-dewas-640a191a1/"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://github.com/Dexctor"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            &copy; {currentYear} {' '}
            <a 
              className="hover:text-gray-800 dark:hover:text-gray-200 underline transition-colors" 
              href="https://antoine-dewas.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Antoine Dewas
            </a>
            {' '}All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}