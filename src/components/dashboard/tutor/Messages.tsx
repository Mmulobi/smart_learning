import { useState, useEffect } from 'react';
import { TutorProfile } from '../../../types/database';
import { MessageSquare, Send, Search, User } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  sender_name: string;
  sender_avatar?: string;
}

interface Student {
  id: string;
  name: string;
  avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface MessagesProps {
  profile: TutorProfile;
  students?: Student[];
}

export function Messages({ profile, students = [] }: MessagesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock data for conversations (in a real app, this would come from the database)
  useEffect(() => {
    // Simulating API call to get conversations
    const mockConversations: Student[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        last_message: 'When is our next session?',
        last_message_time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        unread_count: 2
      },
      {
        id: '2',
        name: 'Samantha Lee',
        avatar: 'https://i.pravatar.cc/150?img=5',
        last_message: 'Thanks for the help with calculus!',
        last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        unread_count: 0
      },
      {
        id: '3',
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=3',
        last_message: 'Can we reschedule tomorrow\'s session?',
        last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        unread_count: 0
      }
    ];
    
    setConversations(mockConversations);
  }, []);

  // Load messages when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      // Simulating API call to get messages
      const mockMessages: Message[] = [
        {
          id: '1',
          sender_id: profile.id,
          receiver_id: selectedStudent.id,
          content: 'Hello, how can I help you with your studies today?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: true,
          sender_name: profile.full_name || profile.name,
          sender_avatar: profile.image_url || ''
        },
        {
          id: '2',
          sender_id: selectedStudent.id,
          receiver_id: profile.id,
          content: 'Hi! I need some help with calculus.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString(), // 1.9 hours ago
          read: true,
          sender_name: selectedStudent.name,
          sender_avatar: selectedStudent.avatar
        },
        {
          id: '3',
          sender_id: selectedStudent.id,
          receiver_id: profile.id,
          content: 'I\'m stuck on problem 3, the one about derivatives.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(), // 1.8 hours ago
          read: true,
          sender_name: selectedStudent.name,
          sender_avatar: selectedStudent.avatar
        },
        {
          id: '4',
          sender_id: profile.id,
          receiver_id: selectedStudent.id,
          content: 'Let me explain how to approach that. First, you need to identify the function and what you\'re differentiating with respect to.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7).toISOString(), // 1.7 hours ago
          read: true,
          sender_name: profile.full_name || profile.name,
          sender_avatar: profile.image_url || ''
        },
        {
          id: '5',
          sender_id: selectedStudent.id,
          receiver_id: profile.id,
          content: 'That makes sense. Can we go over it in our next session?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          sender_name: selectedStudent.name,
          sender_avatar: selectedStudent.avatar
        }
      ];
      
      setMessages(mockMessages);
      
      // Mark conversation as read
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedStudent.id 
            ? { ...conv, unread_count: 0 } 
            : conv
        )
      );
    }
  }, [selectedStudent, profile.id, profile.full_name, profile.name, profile.image_url]);

  const filteredConversations = conversations.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim() && selectedStudent) {
      const newMessage: Message = {
        id: `new-${Date.now()}`,
        sender_id: profile.id,
        receiver_id: selectedStudent.id,
        content: messageText,
        timestamp: new Date().toISOString(),
        read: true,
        sender_name: profile.full_name || profile.name,
        sender_avatar: profile.image_url || ''
      };
      
      setMessages([...messages, newMessage]);
      
      // Update the conversation with the new last message
      setConversations(
        conversations.map(conv => 
          conv.id === selectedStudent.id 
            ? { 
                ...conv, 
                last_message: messageText,
                last_message_time: new Date().toISOString()
              } 
            : conv
        )
      );
      
      setMessageText('');
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // If this week, show day
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(date, 'EEEE');
    }
    
    // Otherwise show date
    return format(date, 'MMM d');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-[calc(100vh-180px)] flex flex-col">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Messages
        </h2>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredConversations.map((student) => (
                  <li 
                    key={student.id}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedStudent?.id === student.id ? 'bg-indigo-50' : ''}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="px-4 py-3 flex items-center">
                      <div className="flex-shrink-0 relative">
                        {student.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={student.avatar} 
                            alt={student.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                        {student.unread_count && student.unread_count > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {student.unread_count}
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${student.unread_count && student.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {student.name}
                          </p>
                          {student.last_message_time && (
                            <p className="text-xs text-gray-500">
                              {formatMessageTime(student.last_message_time)}
                            </p>
                          )}
                        </div>
                        {student.last_message && (
                          <p className={`text-sm truncate ${student.unread_count && student.unread_count > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            {student.last_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No conversations found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Message content */}
        <div className="w-2/3 flex flex-col">
          {selectedStudent ? (
            <>
              <div className="px-6 py-3 border-b border-gray-200 flex items-center">
                {selectedStudent.avatar ? (
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src={selectedStudent.avatar} 
                    alt={selectedStudent.name} 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.name}</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender_id === profile.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end ${message.sender_id === profile.id ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.sender_id !== profile.id && (
                        <div className="flex-shrink-0 mr-2">
                          {message.sender_avatar ? (
                            <img 
                              className="h-8 w-8 rounded-full" 
                              src={message.sender_avatar} 
                              alt={message.sender_name} 
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                      )}
                      <div 
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender_id === profile.id 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.sender_id === profile.id && (
                        <div className="flex-shrink-0 ml-2">
                          {message.sender_avatar ? (
                            <img 
                              className="h-8 w-8 rounded-full" 
                              src={message.sender_avatar} 
                              alt={message.sender_name} 
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Your Messages</h3>
              <p className="text-gray-500 mt-1">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
