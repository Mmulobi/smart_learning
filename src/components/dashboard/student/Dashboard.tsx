import { StudentProfile, Session } from '../../../types/database';
import { UpcomingLessons } from './UpcomingLessons';
import { EnrolledCourses } from './EnrolledCourses';
import { PerformanceAnalytics } from './PerformanceAnalytics';

interface DashboardProps {
  profile: StudentProfile;
  sessions: Session[];
}

export function Dashboard({ profile, sessions }: DashboardProps) {
  // Get upcoming sessions (scheduled sessions in the future)
  const now = new Date();
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate > now && session.status === 'scheduled';
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  // Mock performance data (in a real app, this would come from the database)
  const performanceData = {
    subjects: profile.subjects,
    progress: profile.subjects.map(() => Math.floor(Math.random() * 100)),
    scores: profile.subjects.map(() => Math.floor(Math.random() * 40) + 60), // Scores between 60-100
    sessionsCompleted: sessions.filter(s => s.status === 'completed').length,
    totalHours: sessions.filter(s => s.status === 'completed')
      .reduce((total, session) => {
        const startTime = new Date(session.start_time);
        const endTime = new Date(session.end_time);
        const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        return total + durationHours;
      }, 0)
  };
  
  return (
    <div className="space-y-6">
      {/* Top row - Upcoming Lessons and Enrolled Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingLessons 
          sessions={upcomingSessions} 
          studentName={profile.name} 
        />
        <EnrolledCourses subjects={profile.subjects} />
      </div>
      
      {/* Performance Analytics */}
      <div className="bg-white shadow rounded-lg p-6">
        <PerformanceAnalytics data={performanceData} />
      </div>
    </div>
  );
}
