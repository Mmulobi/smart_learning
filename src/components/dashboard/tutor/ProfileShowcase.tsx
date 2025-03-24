import { useState } from 'react';
import { Camera, Edit2, Star, Video } from 'lucide-react';
import type { TutorProfile } from '../../../types/database';
import { supabase } from '../../../lib/supabase';

interface ProfileShowcaseProps {
  profile: TutorProfile;
  darkMode: boolean;
  onUpdateProfile: (profile: Partial<TutorProfile>) => void;
}

export function ProfileShowcase({
  profile,
  darkMode,
  onUpdateProfile,
}: ProfileShowcaseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<TutorProfile>({
    ...profile,
    subjects: profile.subjects || [],
    qualifications: profile.qualifications || [],
    bio: profile.bio || '',
    availability: profile.availability || {},
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleVideoUpload = async (file: File) => {
    try {
      setUploadingVideo(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-intro.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tutor-videos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tutor-videos')
        .getPublicUrl(filePath);

      onUpdateProfile({
        ...profile,
        video_url: publicUrl,
      });
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      
      // For now, let's use a data URL approach as a fallback
      // This will encode the image directly in the profile data
      // Note: This is not ideal for production but will work for demo purposes
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          console.log('Image converted to data URL');
          
          // Update the profile with the data URL
          onUpdateProfile({
            ...profile,
            image_url: dataUrl,
          });
          
          setUploadingImage(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setUploadingImage(false);
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling image:', error);
      setUploadingImage(false);
    }
  };

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={profile.image_url || 'https://via.placeholder.com/100'}
              alt={profile.full_name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <label
              className={`absolute -bottom-1 -right-1 p-1 rounded-full cursor-pointer ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.full_name}</h2>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="ml-1 text-sm">
                {profile.rating.toFixed(1)} ({profile.total_sessions} sessions)
              </span>
            </div>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {isEditing ? (
          <>
            <div>
              <label className="block font-medium mb-2">About Me</label>
              <textarea
                value={editedProfile.bio}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                className={`w-full p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
                rows={4}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Qualifications</label>
              <input
                type="text"
                placeholder="Add qualifications (comma-separated)"
                value={editedProfile.qualifications ? editedProfile.qualifications.join(', ') : ''}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    qualifications: e.target.value.split(',').map((q) => q.trim()).filter(q => q !== ''),
                  })
                }
                className={`w-full p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Subjects</label>
              <input
                type="text"
                placeholder="Add subjects (comma-separated)"
                value={editedProfile.subjects.join(', ')}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    subjects: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className={`w-full p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                value={editedProfile.hourly_rate}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    hourly_rate: parseInt(e.target.value) || 0,
                  })
                }
                className={`w-full p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-medium mb-2">About Me</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {profile.bio || 'No bio provided yet.'}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {(profile.qualifications || []).map((qualification) => (
                  <span
                    key={qualification}
                    className={`text-sm px-3 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {qualification}
                  </span>
                ))}
                {(!profile.qualifications || profile.qualifications.length === 0) && (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No qualifications added yet.
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {(profile.subjects || []).map((subject) => (
                  <span
                    key={subject}
                    className={`text-sm px-3 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {subject}
                  </span>
                ))}
                {(!profile.subjects || profile.subjects.length === 0) && (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No subjects added yet.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Hourly Rate:</h3>
              <span className="text-lg font-semibold text-indigo-600">
                ${profile.hourly_rate}/hr
              </span>
            </div>

            <div>
              <h3 className="font-medium mb-2">Introduction Video</h3>
              {profile.video_url ? (
                <video
                  src={profile.video_url}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <div
                  className={`flex items-center justify-center p-8 rounded-lg border-2 border-dashed ${
                    darkMode
                      ? 'border-gray-700 text-gray-400'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Video className="w-5 h-5" />
                    <span>
                      {uploadingVideo ? 'Uploading...' : 'Upload Introduction Video'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      disabled={uploadingVideo}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {uploadingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
          </div>
        </div>
      )}
    </div>
  );
}
