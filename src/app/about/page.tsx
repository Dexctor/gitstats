/* eslint-disable react/no-unescaped-entities */
'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Github as GithubIcon, 
  Code, 
  Cpu,
  Terminal
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image'

export default function About() {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
            About GitStats
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            A modern GitHub analytics platform built with the latest web technologies
          </p>
        </div>

        <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            Developer Profile
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Image 
              src="https://avatars.githubusercontent.com/u/120388125?s=400&u=00fe4517dfc10f1d77ceddac318e40976aad0112&v=4" 
              alt="Developer"
              width={80}
              height={80}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Antoine Dewas</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                I'm Antoine, a passionate Web Developer focused on creating innovative and high-performance digital experiences.
                Specialized in modern web application development with React and Next.js, I strive to create elegant and efficient solutions.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-lg sm:text-xl font-bold text-blue-500 dark:text-blue-400">5+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Projects</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-lg sm:text-xl font-bold text-green-500 dark:text-green-400">2+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Years Experience</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-lg sm:text-xl font-bold text-purple-500 dark:text-purple-400">1</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Year Professional</div>
                </div>
              </div>
              <div className="flex justify-center sm:justify-start">
                <Link 
                  href="https://github.com/dexctor" 
                  target="_blank"
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">GitHub Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            Technical Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">Core Skills</h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-1">
                <li>• React & Next.js Development</li>
                <li>• TypeScript</li>
                <li>• WordPress & PayloadCMS</li>
                <li>• OpenAI API Integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">Additional Technologies</h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-1">
                <li>• Modern Frontend Frameworks</li>
                <li>• API Integration</li>
                <li>• Full Stack Development</li>
                <li>• UI/UX Implementation</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            About Me
          </h2>
          <div className="space-y-4 text-sm sm:text-base">
            <p className="text-gray-600">
              I'm Antoine, a full-stack web developer passionate about modern technologies and innovation.
              My expertise spans from front-end development with React and Next.js to managing CMS like WordPress
              and PayloadCMS, including integration of advanced APIs like OpenAI.
            </p>
            <p className="text-gray-600">
              Through GitStats and other projects, I demonstrate my commitment to creating efficient,
              user-friendly applications that leverage the latest web technologies while maintaining
              high standards of code quality and performance.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}