import { useState } from 'react';
import { TutorProfile } from '../../../types/database';
import { FileText, Upload, Download, Trash2, Search, Plus } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  created_at: string;
  subject: string;
}

interface ResourcesProps {
  profile: TutorProfile;
}

export function Resources({ profile }: ResourcesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Mock resources data (in a real app, this would come from the database)
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Calculus Fundamentals',
      description: 'A comprehensive guide to calculus basics',
      file_url: '/files/calculus-guide.pdf',
      file_type: 'pdf',
      created_at: new Date().toISOString(),
      subject: 'Mathematics'
    },
    {
      id: '2',
      title: 'Physics Problem Set',
      description: 'Practice problems for mechanics',
      file_url: '/files/physics-problems.pdf',
      file_type: 'pdf',
      created_at: new Date().toISOString(),
      subject: 'Physics'
    },
    {
      id: '3',
      title: 'Programming Exercises',
      description: 'Coding exercises for beginners',
      file_url: '/files/programming-exercises.zip',
      file_type: 'zip',
      created_at: new Date().toISOString(),
      subject: 'Computer Science'
    }
  ]);
  
  // Filter resources based on search term and selected subject
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });
  
  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
  };
  
  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would upload the file to a storage service
    // and save the metadata to the database
    setShowUploadForm(false);
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'zip':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Educational Resources
          </h2>
          <button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="text-xs bg-white text-indigo-700 px-3 py-1 rounded hover:bg-gray-100 flex items-center"
          >
            <Plus className="h-3 w-3 mr-1" />
            {showUploadForm ? 'Cancel' : 'Add Resource'}
          </button>
        </div>
        
        <div className="p-6">
          {showUploadForm ? (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-4">Upload New Resource</h3>
              <form onSubmit={handleUploadResource} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    id="subject"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a subject</option>
                    {profile.subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, PPT, XLS, ZIP up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upload Resource
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">All Subjects</option>
                    {profile.subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {filteredResources.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Resource</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Added</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredResources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          {getFileIcon(resource.file_type)}
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{resource.title}</div>
                            <div className="text-gray-500">{resource.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {resource.subject}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(resource.created_at).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No resources found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
