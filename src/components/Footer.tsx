export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 text-gray-300 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Smart Learning. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#subjects" className="hover:text-white">Subjects</a>
          <a href="#ai-assistant" className="hover:text-white">AI Assistant</a>
          <a href="#tutors" className="hover:text-white">Tutors</a>
        </div>
      </div>
    </footer>
  );
}


