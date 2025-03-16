import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Navigation items
  const navItems = [
    {
      name: 'Tasks',
      path: '/tasks',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'AI Chat',
      path: '/ai-chat',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: 'AI Workflow',
      path: '/ai-workflow',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  // Admin navigation items
  const adminNavItems = [
    {
      name: 'Prompt Templates',
      path: '/admin/prompt-templates',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Allinol</h1>
        <button 
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
                )}
              >
                <span className={cn(
                  "mr-3",
                  location.pathname === item.path
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300"
                )}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <li className="pt-5 pb-2">
                <div className="px-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                    Admin
                  </h3>
                </div>
              </li>
              {adminNavItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
                    )}
                  >
                    <span className={cn(
                      "mr-3",
                      location.pathname === item.path
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300"
                    )}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>
      
      {/* Pro upgrade banner */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Upgrade to Pro</h3>
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">Get access to advanced features and priority support.</p>
          <button className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
