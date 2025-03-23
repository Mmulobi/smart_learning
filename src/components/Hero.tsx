import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Learn from the best tutors, anytime, anywhere
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with experienced tutors for personalized learning. Book sessions, track your progress, and achieve your academic goals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/auth/student"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              I'm a Student
            </Link>
            <Link
              to="/auth/tutor"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-gray-50"
            >
              I'm a Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}