'use client'

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { searchGithubUser } from '@/lib/github';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';

interface UserSearchProps {
  onUserFound: (userData: any) => void;
}

type ErrorType = {
  message: string;
  type: 'error' | 'warning' | 'info';
}

export default function UserSearch({ onUserFound }: UserSearchProps) {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  const debouncedSearch = useMemo(
    () => debounce(async (searchTerm: string) => {
      setIsLoading(true);
      try {
        const data = await searchGithubUser(searchTerm);
        if (data) onUserFound(data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [onUserFound]
  );

  const handleError = (error: any) => {
    if (error.status === 404) {
      setError({
        message: 'User not found. Please check the username and try again.',
        type: 'warning'
      });
    } else if (error.status === 403) {
      setError({
        message: 'API rate limit exceeded. Please try again later.',
        type: 'error'
      });
    } else if (error.status === 401) {
      setError({
        message: 'Authentication error. Please sign in again.',
        type: 'error'
      });
    } else {
      setError({
        message: 'An unexpected error occurred. Please try again later.',
        type: 'error'
      });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError({
        message: 'Please enter a GitHub username',
        type: 'info'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchGithubUser(username);
      if (!data) {
        setError({
          message: 'No user data found',
          type: 'warning'
        });
        return;
      }
      onUserFound(data);
      setUsername('');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorStyles = (type: ErrorType['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10';
      case 'warning':
        return 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10';
      case 'info':
        return 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search for a GitHub user..."
            aria-label="GitHub username"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
        </div>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-2 p-3 rounded-lg flex items-center gap-2 ${getErrorStyles(error.type)}`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 