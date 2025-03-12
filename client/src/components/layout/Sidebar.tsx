import { Link } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:w-64 flex-shrink-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Allinol</h1>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="px-2 py-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/tasks" 
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tasks
            </Link>
          </li>
          {/* Add more navigation items here */}
        </ul>
      </nav>
    </aside>
  );
}
