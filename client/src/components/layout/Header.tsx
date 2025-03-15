import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export function Header({ toggleSidebar, theme, setTheme }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="ml-4 text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* User profile */}
        <div className="flex items-center">
          <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">
            {user?.username || 'User'}
          </span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span className="text-sm font-medium">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
              </span>
            </button>
            
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={cn(
            "p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            theme === 'dark' 
              ? "text-yellow-300 hover:text-yellow-200" 
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          {theme === 'dark' ? (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
