import { Link } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside>
      <div>
        <h1>Allinol</h1>
        <button 
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/tasks">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
