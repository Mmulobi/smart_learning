import { useState, useEffect } from 'react';
import { TutorProfile, Resource } from '../../../types/database';
import { FileText, Upload, Download, Trash2, Search, Plus } from 'lucide-react';
import { DatabaseService } from '../../../services/database';
import { RealtimeService } from '../../../services/realtime';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface ResourcesProps {
  profile: TutorProfile;
}

export function Resources({ profile }: ResourcesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    subject: '',
    file: null as File | null,
    is_public: false
  });

  useEffect(() => {
    loadResources();
    subscribeToResourceUpdates();
    return () => {
      RealtimeService.unsubscribeFromChannel('resource-updates');
    };
  }, [profile.id]);

  const loadResources = async () => {
    try {
      const tutorResources = await DatabaseService.getTutorResources(profile.id);
      setResources(tutorResources);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error('Failed to load resources');
    }
  };

  const subscribeToResourceUpdates = () => {
    RealtimeService.subscribeToResources(
      profile.id,
      'tutor',
      (updatedResource) => {
        setResources(prevResources => {
          const existingIndex = prevResources.findIndex(r => r.id === updatedResource.id);
          if (existingIndex >= 0) {
            const updatedResources = [...prevResources];
            updatedResources[existingIndex] = updatedResource;
            return updatedResources;
          } else {
            return [...prevResources, updatedResource];
          }
        });
      }
    );
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Allowed types: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName; // Simplified path structure

      console.log('Uploading file:', {
        fileName,
        filePath,
        fileType: file.type,
        fileSize: file.size,
        tutorId: profile.id
      });

      // First, try to upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tutor-resources')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Then, get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tutor-resources')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      return {
        file_url: publicUrl,
        file_type: fileExt || ''
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newResource.file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!newResource.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!newResource.subject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setUploading(true);
      const { file_url, file_type } = await handleFileUpload(newResource.file);

      const resource = await DatabaseService.createResource({
        tutor_id: profile.id,
        title: newResource.title.trim(),
        description: newResource.description.trim(),
        subject: newResource.subject,
        file_url,
        file_type,
        is_public: newResource.is_public
      });

      setResources([resource, ...resources]);
    setShowUploadForm(false);
      setNewResource({
        title: '',
        description: '',
        subject: '',
        file: null,
        is_public: false
      });
      toast.success('Resource uploaded successfully');
    } catch (error) {
      console.error('Error creating resource:', error);
      toast.error('Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      await DatabaseService.deleteResource(id);
      setResources(resources.filter(resource => resource.id !== id));
      toast.success('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  return (
    <div className="space-y-6 relative">
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
                    name="title"
                    value={newResource.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newResource.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={newResource.subject}
                    onChange={handleInputChange}
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
                          <input 
                            id="file-upload" 
                            name="file" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {newResource.file ? newResource.file.name : 'PDF, DOC, PPT, XLS, ZIP up to 10MB'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_public"
                    name="is_public"
                    checked={newResource.is_public}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                    Make this resource public
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Resource'}
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
          
          {resources.length > 0 ? (
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
                  {resources.map((resource) => (
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
                          <a
                            href={resource.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Download className="h-4 w-4" />
                          </a>
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
