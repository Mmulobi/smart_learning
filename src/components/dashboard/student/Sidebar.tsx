import { useState, useEffect } from 'react';
import { VideoCall } from '../../VideoCall';
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  MessageSquare, 
  HelpCircle,
  Menu,
  X,
  User,
  LogOut,
  Search,
  Play,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
  onFindTutor?: () => void;
  onStartLesson?: () => void;
}

export function Sidebar({ activeTab, onChangeTab, onSignOut, onEditProfile, onFindTutor, onStartLesson }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVideoCall, setShowVideoCall] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
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
  
  const handleStartClassroomSession = () => {
    setShowVideoCall(true);
  };
  
  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-indigo-700 to-purple-700 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="ml-2 text-lg font-semibold text-white flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Smart Learning
          </span>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`lg:hidden fixed inset-0 z-10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex flex-col w-80 h-full max-w-xs bg-gradient-to-b from-indigo-800 to-indigo-900 pt-16 pb-4 overflow-y-auto shadow-xl">
          <div className="px-4 py-3 mb-6 border-b border-indigo-700">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <User className="h-8 w-8" />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={onEditProfile}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-indigo-700 rounded-md transition-colors duration-150"
              >
                <User className="h-4 w-4 mr-3" />
                Edit Profile
              </button>
              <button
                onClick={onSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-indigo-700 rounded-md transition-colors duration-150"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onFindTutor}
                className="flex flex-col items-center justify-center bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow"
              >
                <Search className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Find Tutor</span>
              </button>
              <button
                onClick={onStartLesson}
                className="flex flex-col items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow"
              >
                <Play className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Start Lesson</span>
              </button>
            </div>
          </div>
          
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Navigation</h3>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="px-4 mt-auto">
            <div className="bg-indigo-800 rounded-lg p-3 mb-4 shadow-inner">
              <div className="text-xs text-indigo-300 mb-1">{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
              <div className="text-sm font-medium text-white">{currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <button
              onClick={() => handleTabClick('help')}
              className="flex items-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-700 rounded-md transition-colors duration-150"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </button>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 z-10 bg-gray-900 bg-opacity-75 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-indigo-800 to-indigo-900 shadow-xl">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-800">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-7 w-7 text-indigo-300" />
                  <h1 className="text-xl font-bold text-white">Smart Learning</h1>
                </div>
              </div>
              
              <div className="px-4 mb-6">
                <div className="bg-indigo-700 rounded-xl p-4 shadow-inner">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-white p-0.5 shadow-md">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                        <User className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Student</p>
                      <p className="text-xs text-indigo-300 truncate">{currentTime.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onEditProfile}
                      className="flex items-center justify-center py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors duration-150"
                    >
                      <User className="h-3.5 w-3.5 mr-1.5" />
                      Profile
                    </button>
                    <button
                      onClick={onSignOut}
                      className="flex items-center justify-center py-2 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-md transition-colors duration-150"
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="px-4 mb-6">
                <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onFindTutor}
                    className="flex flex-col items-center justify-center bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow group"
                  >
                    <div className="p-2 rounded-full bg-indigo-600 group-hover:bg-indigo-500 transition-colors duration-150 mb-2">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Find Tutor</span>
                  </button>
                  <button
                    onClick={handleStartClassroomSession}
                    className="flex flex-col items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow group"
                  >
                    <div className="p-2 rounded-full bg-purple-600 group-hover:bg-purple-500 transition-colors duration-150 mb-2">
                      <Play className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Start Classroom Session</span>
                  </button>
                </div>
              </div>
              
              <div className="px-4 mb-6">
                <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Navigation</h3>
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-150 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'text-indigo-100 hover:bg-indigo-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              <div className="px-4 mt-auto mb-6">
                <div className="bg-indigo-800 rounded-lg p-3 mb-4 shadow-inner">
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                    <span className="text-xs font-medium text-indigo-300">Learning Streak</span>
                  </div>
                  <div className="mt-2 h-2 bg-indigo-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 w-3/4"></div>
                  </div>
                  <div className="mt-1 text-xs text-right text-indigo-300">3 days in a row</div>
                </div>
                <button
                  onClick={() => handleTabClick('help')}
                  className="flex items-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-700 rounded-md transition-colors duration-150"
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help & Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 z-50">
          <VideoCall
            sessionId="direct-session"
            roomName="smart-learning-direct-session"
            displayName="Student"
            onClose={handleCloseVideoCall}
          />
        </div>
      )}
    </>
  );
}
