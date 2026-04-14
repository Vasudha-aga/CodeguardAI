import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code, 
  Bug, 
  Sparkles, 
  Lightbulb, 
  History,
  ChevronLeft,
  ChevronRight,
  User,
  Shield
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('codeguard_current_user');
    if (!userData) {
      navigate('/signin');
      return;
    }
    setCurrentUser(JSON.parse(userData));
  }, [navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Code, label: 'Code Analyzer', path: '/analyzer' },
    { icon: Bug, label: 'Bug Detection', path: '/bugs' },
    { icon: Sparkles, label: 'AI Code Review', path: '/ai-review' },
    { icon: Lightbulb, label: 'Recommendations', path: '/recommendations' },
    { icon: History, label: 'History', path: '/history' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Fixed Sidebar */}
      <aside 
        className={`
          ${isCollapsed ? 'w-20' : 'w-64'} 
          fixed left-0 top-0 h-screen
          bg-gradient-to-b from-[#0B0F1A] to-[#1a1f2e] 
          border-r border-blue-500/20 
          transition-all duration-300 ease-in-out
          flex flex-col
          z-40
        `}
      >
        {/* Logo & Header - Fixed at top */}
        <div className="p-6 flex items-center justify-between border-b border-blue-500/20 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">CodeGuard AI</span>
            </div>
          )}
          {isCollapsed && (
            <Shield className="w-8 h-8 text-blue-400 mx-auto" />
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 shadow-lg transition-colors z-50"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Scrollable Navigation - Middle section */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${active 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-300'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile - Fixed at bottom */}
        <div className="p-4 border-t border-blue-500/20 flex-shrink-0">
          <Link
            to="/profile"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive('/profile')
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-300'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? currentUser?.name || 'Profile' : ''}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.name || 'Developer'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentUser?.email || ''}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content - with margin for sidebar */}
      <main 
        className={`
          ${isCollapsed ? 'ml-20' : 'ml-64'} 
          transition-all duration-300 ease-in-out
          min-h-screen
        `}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}