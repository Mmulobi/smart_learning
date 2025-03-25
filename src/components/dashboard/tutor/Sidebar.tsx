import { useState } from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  MessageSquare, 
  Settings, 
  Calendar,
  TrendingUp,
  FileText,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tutorName: string;
}

export function Sidebar({ activeTab, onTabChange, tutorName }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="ml-2 text-lg font-semibold text-gray-900">Smart Learning</span>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-10 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            <div className="px-4 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Tutor Dashboard</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    {tutorName ? tutorName.charAt(0) : 'T'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{tutorName}</p>
                    <p className="text-xs text-gray-500">Tutor</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex items-center flex-shrink-0 px-6">
          <h2 className="text-xl font-bold text-gray-900">Tutor Dashboard</h2>
        </div>
        
        <div className="mt-6 px-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {tutorName ? tutorName.charAt(0) : 'T'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{tutorName}</p>
              <p className="text-xs text-gray-500">Tutor</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="px-3 mt-6">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
      
      {/* Main content padding for desktop */}
      <div className="hidden lg:block lg:pl-64"></div>
    </>
  );
}
