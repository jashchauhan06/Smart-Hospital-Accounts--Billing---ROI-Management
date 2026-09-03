import React, { useRef, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Financial', path: '/financial' },
  { label: 'Operations', path: '/operations' },
  { label: 'Clinical', path: '/clinical' },
  { label: 'Departments', path: '/departments' },
  { label: 'Investments', path: '/investments' },
  { label: 'ROI Analysis', path: '/roi' },
  { label: 'Predictions', path: '/predictions' },
  { label: 'Alerts', path: '/alerts' },
  { label: 'Insights', path: '/insights' },
];

function NavSidebar({ setSidebarOpen }) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative flex w-full flex-col gap-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {NAV_ITEMS.map((item) => (
        <Tab key={item.path} setPosition={setPosition} path={item.path} setSidebarOpen={setSidebarOpen}>
          {item.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({ children, setPosition, path, setSidebarOpen }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        setPosition({
          height: ref.current.offsetHeight,
          width: ref.current.offsetWidth,
          top: ref.current.offsetTop,
          left: ref.current.offsetLeft,
          opacity: 1,
        });
      }}
      onClick={handleClick}
      className={`relative z-10 block cursor-pointer px-4 py-3 text-xs uppercase tracking-wider transition-colors md:text-sm
        text-white ${isActive ? 'font-bold' : 'font-semibold'} mix-blend-difference`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 rounded-xl bg-black"
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    />
  );
};

const ProfileDropup = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropupRef.current && !dropupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropupRef}>
      {/* Dropup Menu */}
      {isOpen && (
        <ul
          className="absolute bottom-full left-0 mb-2 p-2 w-full text-surface-200 text-sm font-medium bg-surface-950 border border-surface-700 rounded-md shadow-lg z-50 overflow-hidden animate-slide-up"
        >
          <li>
             <a href="#" className="dropdown-item w-full p-2 flex items-center gap-2 rounded-md cursor-pointer transition-colors hover:text-surface-100 hover:bg-surface-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-current overflow-visible" viewBox="0 0 512 512">
                   <path d="M426 495.983H86c-25.364 0-46-20.635-46-46v-242.02c0-8.836 7.163-16 16-16s16 7.164 16 16v242.02c0 7.72 6.28 14 14 14h340c7.72 0 14-6.28 14-14v-242.02c0-8.836 7.163-16 16-16s16 7.164 16 16v242.02c0 25.364-20.635 46-46 46"/>
                   <path d="M496 263.958a15.95 15.95 0 0 1-11.313-4.687L285.698 60.284c-16.375-16.376-43.02-16.376-59.396 0L27.314 259.272c-6.248 6.249-16.379 6.249-22.627 0-6.249-6.248-6.249-16.379 0-22.627L203.675 37.656c28.852-28.852 75.799-28.852 104.65 0l198.988 198.988c6.249 6.249 6.249 16.379 0 22.627A15.94 15.94 0 0 1 496 263.958M320 495.983H192c-8.837 0-16-7.164-16-16v-142c0-27.57 22.43-50 50-50h60c27.57 0 50 22.43 50 50v142c0 8.836-7.163 16-16 16m-112-32h96v-126c0-9.925-8.075-18-18-18h-60c-9.925 0-18 8.075-18 18z"/>
                </svg>
                Dashboard
             </a>
          </li>
          <li>
             <a href="#" className="dropdown-item w-full p-2 flex items-center gap-2 rounded-md cursor-pointer transition-colors hover:text-surface-100 hover:bg-surface-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-current overflow-visible" viewBox="0 0 512 512">
                   <path d="M253.414 103.434c48.556 0 87.919 40.52 87.919 90.505s-39.363 90.505-87.919 90.505-87.919-40.521-87.919-90.505 39.363-90.505 87.919-90.505m0 36.202c-28.324 0-51.717 24.081-51.717 54.303s23.393 54.303 51.717 54.303 51.717-24.081 51.717-54.303-23.393-54.303-51.717-54.303"/>
                   <path d="M253.414 0c139.957 0 253.414 113.457 253.414 253.414 0 94.285-51.491 176.544-127.886 220.19-35.728 20.575-77.036 32.582-121.104 33.199l-4.423.025C113.457 506.828 0 393.371 0 253.414S113.457 0 253.414 0m-23.676 346.505c-46.331 0-87.479 29.378-102.607 73.008l-2.339 7.571c35.919 27.232 80.165 42.893 126.504 43.522l5.709-.009c38.24-.62 74.079-11.122 105.072-29.064l19.977-13.243-2.237-6.866c-14.371-44.046-55.062-74.052-101.239-74.901zm23.676-310.303c-119.963 0-217.212 97.249-217.212 217.212 0 57.493 22.337 109.77 58.807 148.624 21.668-55.072 74.965-91.735 134.73-91.735h46.831c59.905 0 113.311 36.835 134.885 92.121 36.686-38.892 59.172-91.325 59.172-149.01-.001-119.963-97.25-217.212-217.213-217.212"/>
                </svg>
                My Profile
             </a>
          </li>
          <li>
             <a href="#" className="dropdown-item w-full p-2 flex items-center gap-2 rounded-md cursor-pointer transition-colors hover:text-surface-100 hover:bg-surface-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-current overflow-visible" viewBox="0 0 32 32">
                   <g data-name="Layer 2">
                      <path d="M24.915 3.663a3.15 3.15 0 0 0-2.688-1.554H9.774a3.15 3.15 0 0 0-2.688 1.554L.859 14.446a3.15 3.15 0 0 0 0 3.15l6.227 10.742a3.15 3.15 0 0 0 2.688 1.554h12.453a3.15 3.15 0 0 0 2.688-1.554l6.226-10.784a3.15 3.15 0 0 0 0-3.15zm4.41 12.841-6.227 10.784a1.05 1.05 0 0 1-.871.504H9.774a1.05 1.05 0 0 1-.872-.504L2.676 16.504a1.05 1.05 0 0 1 0-1.05L8.902 4.713a1.05 1.05 0 0 1 .872-.504h12.453a1.05 1.05 0 0 1 .871.504l6.227 10.783a1.05 1.05 0 0 1 0 1.008"/>
                      <path d="M16 9.7a6.3 6.3 0 1 0 6.3 6.3A6.3 6.3 0 0 0 16 9.7m0 10.5a4.2 4.2 0 1 1 4.2-4.2 4.2 4.2 0 0 1-4.2 4.2"/>
                   </g>
                </svg>
                Account Settings
             </a>
          </li>
          <li className="mt-1 pt-1 border-t border-surface-700">
             <button onClick={onLogout} className="dropdown-item w-full p-2 flex items-center gap-2 rounded-md cursor-pointer transition-colors text-red-500 hover:bg-red-500/10 focus:outline-none">
                <LogOut className="size-[18px]" />
                Sign Out
             </button>
          </li>
        </ul>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 w-full text-surface-100 text-sm font-semibold rounded-md flex items-center gap-2 cursor-pointer bg-surface-950 border border-surface-700 transition-colors hover:bg-surface-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-surface-100 truncate">{user?.name || 'User'}</p>
          <p className="text-[11px] text-surface-500 truncate capitalize font-normal">{user?.role?.replace('_', ' ') || 'Admin'}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`size-3 fill-surface-500 overflow-visible transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 512 512">
           <path d="M511 138.2c-3-13.8-11.2-23.1-25.2-27-15.3-4.3-28 .4-38.8 11.3-41.9 42-83.7 84.1-125.5 126.2-21 21-42.2 41.9-65.4 65L64.7 122.3c-16-16-38.8-16.9-53.6-2.8s-15 38 .6 53.7C83.9 245.8 156.4 318.3 229 390.5c15.8 15.7 38 16.1 53.5.6 73-72.5 145.7-145.2 218.2-218.1 9.5-9.6 13.3-21.4 10.3-34.8" />
        </svg>
      </button>
    </div>
  );
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 -ml-64'} lg:w-64 lg:ml-0 
        flex-shrink-0 bg-surface-900 border-r border-surface-700/50 
        flex flex-col transition-all duration-300 fixed lg:relative z-30 h-full`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-surface-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-primary-700">HospIntel</h1>
              <p className="text-[10px] text-surface-500 leading-none">Healthcare Intelligence</p>
            </div>
          </div>
        </div>

        {/* Animated Nav Sidebar */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <NavSidebar setSidebarOpen={setSidebarOpen} />
        </nav>

        {/* User */}
        <div className="p-3 border-t border-surface-700/50 flex-shrink-0">
          <ProfileDropup user={user} onLogout={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (Mobile toggle only now) */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-surface-700/50 
          bg-surface-900/50 backdrop-blur-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-surface-400 hover:text-surface-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs text-surface-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
