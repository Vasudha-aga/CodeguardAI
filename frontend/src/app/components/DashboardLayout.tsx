import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Code, 
  Bug, 
  Sparkles, 
  Lightbulb, 
  History, 
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
  localStorage.removeItem('codeguard_current_user');
  navigate('/signin');
};

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
    <div className="min-h-screen animated-bg">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 glass-card border-b border-blue-500/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-300 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/dashboard" className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="text-xl gradient-text hidden sm:inline">CodeGuard AI</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 glass-card px-4 py-2 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 text-sm">Developer</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 glass-card border-r border-blue-500/20
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <nav className="p-4 space-y-2 flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${active 
                      ? 'nav-active text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-blue-500/10'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button - Bottom of Sidebar */}
          <div className="pt-4 border-t border-blue-500/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
