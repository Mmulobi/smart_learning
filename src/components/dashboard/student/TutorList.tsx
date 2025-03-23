import { TutorProfile } from '../../../types/database';

interface TutorListProps {
  tutors: TutorProfile[];
  onSelectTutor: (tutor: TutorProfile) => void;
  selectedTutorId?: string;
}

export function TutorList({ tutors, onSelectTutor, selectedTutorId }: TutorListProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Tutors</h2>
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <button
              key={tutor.id}
              onClick={() => onSelectTutor(tutor)}
              className={`w-full text-left p-4 rounded-lg border ${
                selectedTutorId === tutor.id
                  ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50'
                  : 'border-gray-200 hover:border-indigo-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{tutor.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{tutor.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${tutor.hourly_rate}/hr</p>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm text-gray-500">Rating:</span>
                    <span className="ml-1 text-sm font-medium text-indigo-600">{tutor.rating}/5</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
