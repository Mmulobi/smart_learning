import { useState } from 'react';
import { Upload, File, Check, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Resource {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded: boolean;
}

interface ResourceUploadProps {
  darkMode: boolean;
  onUploadComplete: (resources: Resource[]) => void;
}

export function ResourceUpload({ darkMode, onUploadComplete }: ResourceUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploading(true);

    const files = Array.from(e.dataTransfer.files);
    const newResources: Resource[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `resources/${fileName}`;

        const { data, error } = await supabase.storage
          .from('tutor-resources')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('tutor-resources')
          .getPublicUrl(filePath);

        newResources.push({
          id: data.path,
          name: file.name,
          url: publicUrl,
          type: file.type,
          uploaded: true,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setResources((prev) => [...prev, ...newResources]);
    onUploadComplete(newResources);
    setUploading(false);
  };

  const removeResource = async (resourceId: string) => {
    try {
      await supabase.storage.from('tutor-resources').remove([resourceId]);
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (error) {
      console.error('Error removing resource:', error);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Resource Upload</h2>
        <Upload className="text-indigo-500" size={24} />
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : darkMode
            ? 'border-gray-700 bg-gray-700'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p>Uploading resources...</p>
          </div>
        ) : (
          <>
            <Upload
              size={40}
              className={isDragging ? 'text-indigo-500' : 'text-gray-400'}
            />
            <p className="mt-2 text-sm">
              Drag and drop your files here, or{' '}
              <span className="text-indigo-500 cursor-pointer">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: PDF, Word, PowerPoint, Images, Videos
            </p>
          </>
        )}
      </div>

      {resources.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium">Uploaded Resources</h3>
          {resources.map((resource) => (
            <div
              key={resource.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <File size={20} className="text-indigo-500" />
                <span className="text-sm">{resource.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {resource.uploaded && (
                  <span
                    className={`flex items-center text-xs px-2 py-1 rounded-full ${
                      darkMode ? 'bg-green-900/50' : 'bg-green-100'
                    } text-green-600`}
                  >
                    <Check size={12} className="mr-1" />
                    Shared
                  </span>
                )}
                <button
                  onClick={() => removeResource(resource.id)}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
