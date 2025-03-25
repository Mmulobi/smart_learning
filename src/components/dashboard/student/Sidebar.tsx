import { useState } from 'react';
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  MessageSquare, 
  HelpCircle,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
}

export function Sidebar({ activeTab, onChangeTab, onSignOut, onEditProfile }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sessions', label: 'Live Sessions', icon: Video },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];
  
  const handleTabClick = (tabId: string) => {
    onChangeTab(tabId);
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
      
      {/* Mobile menu */}
      <div className={`lg:hidden fixed inset-0 z-10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex flex-col w-80 h-full max-w-xs bg-indigo-700 pt-16 pb-4 overflow-y-auto">
          <div className="px-4 pb-6 border-b border-indigo-600">
            <button
              onClick={onEditProfile}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-indigo-600 rounded-md"
            >
              <User className="h-5 w-5 mr-3" />
              Edit Profile
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm text-white hover:bg-indigo-600 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md ${
                    activeTab === tab.id
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          
          <div className="px-4 mt-6">
            <button
              onClick={() => handleTabClick('help')}
              className="flex items-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-600 rounded-md"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </button>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 z-10 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-indigo-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-white">Smart Learning</h1>
              </div>
              
              <div className="px-4 mt-6 pb-6 border-b border-indigo-600">
                <button
                  onClick={onEditProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-indigo-600 rounded-md"
                >
                  <User className="h-5 w-5 mr-3" />
                  Edit Profile
                </button>
                <button
                  onClick={onSignOut}
                  className="flex items-center w-full px-4 py-2 mt-2 text-sm text-white hover:bg-indigo-600 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
              
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center w-full px-4 py-3 text-sm rounded-md ${
                        activeTab === tab.id
                          ? 'bg-indigo-800 text-white'
                          : 'text-indigo-100 hover:bg-indigo-600'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              
              <div className="px-4 mt-6">
                <button
                  onClick={() => handleTabClick('help')}
                  className="flex items-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-600 rounded-md"
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help & Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
