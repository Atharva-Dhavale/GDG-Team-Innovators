'use client';

import Link from 'next/link';
import { GraduationCap, User, ChevronRight, BookOpen, BarChart, MessageSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const { addToast } = useToast();
  const toastShownRef = useRef(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    if (!toastShownRef.current) {
      const timer = setTimeout(() => {
        addToast('Welcome to EduAssist! Choose a role to get started.', 'info');
        toastShownRef.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [addToast]);

  const features = [
    {
      title: 'AI-Powered Grading',
      description: 'Get instant, accurate feedback on your assignments',
      icon: Sparkles,
    },
    {
      title: 'Personalized Analytics',
      description: 'Track your progress with detailed performance insights',
      icon: BarChart,
    },
    {
      title: 'Interactive Learning',
      description: 'Engage with interactive study materials and resources',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/20 to-white relative overflow-hidden">
      {/* Background texture and gradients */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
      
      <header className="glass-card sticky top-0 z-50 mx-4 mt-4">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <GraduationCap className="h-8 w-8 mr-2 text-indigo-600" />
              EduAssist
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="glass-nav-link">Features</Link>
            <Link href="#about" className="glass-nav-link">About</Link>
            <Link href="#contact" className="glass-nav-link">Contact</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl relative">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Learning Experience</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-8 md:max-w-3xl">
              An intelligent platform that helps teachers grade assignments and provides students with instant, personalized feedback.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <Link
              href="/teacher"
              className="glass-card group relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative p-8 z-10 group-hover:text-white transition-colors duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-100 group-hover:bg-white transition-colors duration-300 mb-6">
                  <GraduationCap className="h-8 w-8 text-indigo-600 group-hover:text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Teacher Portal</h3>
                <p className="text-gray-500 group-hover:text-white/90 mb-4">Access analytics, review submissions, and provide feedback to students.</p>
                
                <div className="mt-6 flex items-center space-x-6">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>Submissions</span>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center text-indigo-600 group-hover:text-white">
                  <span>Enter as Teacher</span>
                  <ChevronRight className="h-5 w-5 ml-2" />
                </div>
              </div>
            </Link>

            <Link
              href="/student"
              className="glass-card group relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative p-8 z-10 group-hover:text-white transition-colors duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-green-100 group-hover:bg-white transition-colors duration-300 mb-6">
                  <User className="h-8 w-8 text-green-600 group-hover:text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Student Portal</h3>
                <p className="text-gray-500 group-hover:text-white/90 mb-4">Submit assignments, view feedback, and track your progress.</p>
                
                <div className="mt-6 flex items-center space-x-6">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>Assignments</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <span>Feedback</span>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center text-green-600 group-hover:text-white">
                  <span>Enter as Student</span>
                  <ChevronRight className="h-5 w-5 ml-2" />
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div id="features" className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`glass-card p-6 transition-all duration-300 cursor-pointer ${
                    activeFeature === index ? 'ring-2 ring-indigo-500 transform scale-105' : 'hover:shadow-xl'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div id="about" className="mt-24 glass-section">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">About EduAssist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  EduAssist is dedicated to revolutionizing the education experience by providing intelligent tools for both teachers and students. Our platform leverages AI to streamline grading, provide instant feedback, and offer personalized learning insights.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3">1</span>
                    <span>Teachers create and assign tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3">2</span>
                    <span>Students submit their work</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3">3</span>
                    <span>AI provides instant feedback and grading</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3">4</span>
                    <span>Teachers review and provide additional feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Get in Touch</h2>
            <div className="glass-section max-w-2xl mx-auto">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="glass-button w-full"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="glass-card mx-4 mb-4 mt-24">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">EduAssist</h3>
              <p className="text-gray-600">
                Transforming education through AI-powered tools and personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/teacher" className="glass-nav-link">Teacher Portal</Link></li>
                <li><Link href="/student" className="glass-nav-link">Student Portal</Link></li>
                <li><Link href="#features" className="glass-nav-link">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: support@eduassist.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 Education St, Learning City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EduAssist. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
