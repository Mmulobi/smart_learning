export function TutorMatch() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Find Your Perfect Tutor</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with expert tutors who can help you excel in your studies. Our matching system finds the best fit for your learning style and goals.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          <div>
            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Personalized Matching</h3>
            <p className="mt-8 border-l border-gray-200 pl-6 text-gray-600">Our AI system analyzes your learning style and goals to find tutors who match your needs perfectly.</p>
          </div>
          <div>
            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Verified Experts</h3>
            <p className="mt-8 border-l border-gray-200 pl-6 text-gray-600">Every tutor is thoroughly vetted for their expertise and teaching ability.</p>
          </div>
          <div>
            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Flexible Scheduling</h3>
            <p className="mt-8 border-l border-gray-200 pl-6 text-gray-600">Book sessions that fit your schedule, with options for both regular and on-demand tutoring.</p>
          </div>
          <div>
            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Quality Guarantee</h3>
            <p className="mt-8 border-l border-gray-200 pl-6 text-gray-600">We ensure every session meets our high standards for educational quality.</p>
          </div>
        </div>
        <div className="mt-16">
          <a
            href="/tutor-search"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Find a Tutor
          </a>
        </div>
      </div>
    </div>
  );
}