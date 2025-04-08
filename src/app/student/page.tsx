'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  FileText, 
  Trophy, 
  Upload, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { mockAssignments, mockStudents, mockSubmissions, mockLearningResources } from '@/lib/mockData';
import { getLetterGrade } from '@/utils/gradingLogic';
import { generateFeedback } from '@/utils/feedbackGenerator';
import Chatbot from '@/components/Chatbot';
import PersonalizedAnalytics from '@/components/PersonalizedAnalytics';

export default function StudentDashboard() {
  const { addToast } = useToast();
  const welcomeShown = useRef(false);
  const [selectedTab, setSelectedTab] = useState('assignments');
  const [submissionText, setSubmissionText] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<{
    assignmentId: string;
    content: string;
    score: number;
    feedback: string;
  } | null>(null);

  const [activeStudent] = useState(mockStudents[0]);
  
  // Show welcome toast only once
  useEffect(() => {
    if (!welcomeShown.current) {
      const timer = setTimeout(() => {
        addToast(`Namaste, ${activeStudent.name}! Welcome back to your learning journey.`, 'info');
        welcomeShown.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeStudent.name, addToast]);
  
  // Get student's submissions
  const studentSubmissions = mockSubmissions.filter(sub => sub.studentId === activeStudent.id);
  
  // Recommended resources based on student's scores
  const recommendedResources = mockLearningResources.filter(resource => {
    const [min, max] = resource.recommendedFor;
    const subjectSubmissions = studentSubmissions.filter(sub => {
      const assignment = mockAssignments.find(a => a.id === sub.assignmentId);
      return assignment?.subject === resource.subject;
    });
    
    if (subjectSubmissions.length === 0) return false;
    
    const avgScore = subjectSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / subjectSubmissions.length;
    return avgScore >= min && avgScore <= max;
  });

  // Handle assignment submission
  const handleSubmit = async () => {
    if (!selectedAssignment || !submissionText.trim()) {
      addToast('Please select an assignment and enter your work.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the selected assignment details
    const assignment = mockAssignments.find(a => a.id === selectedAssignment);
    
    if (!assignment) {
      setIsSubmitting(false);
      addToast('Assignment not found', 'error');
      return;
    }
    
    // Mock grading
    const score = Math.floor(Math.random() * 31) + 70; // Random score between 70-100
    const feedback = generateFeedback(submissionText, score, assignment.subject);
    
    setCurrentSubmission({
      assignmentId: selectedAssignment,
      content: submissionText,
      score,
      feedback
    });
    
    setIsSubmitting(false);
    addToast('Assignment graded successfully!', 'success');
  };

  // Simulate assignments completion status
  const getCompletionStatus = (assignmentId: string) => {
    const found = studentSubmissions.find(sub => sub.assignmentId === assignmentId);
    if (found) return 'completed';
    
    const assignment = mockAssignments.find(a => a.id === assignmentId);
    if (!assignment) return 'pending';
    
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    
    if (dueDate < today) return 'overdue';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">EduAssist</Link>
            <span className="ml-2 text-sm text-gray-500">विद्यार्थी पोर्टल</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white text-lg font-medium">
                {activeStudent.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{activeStudent.name}</p>
                <p className="text-xs text-gray-500">{activeStudent.grade} Grade</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col items-center mb-4">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl font-bold">
                  {activeStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{activeStudent.name}</h3>
                <p className="text-sm text-gray-500">{activeStudent.grade} Grade</p>
                <div className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active Student
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Assignments</span>
                  <span className="text-sm font-medium">{mockAssignments.length} total</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Completed</span>
                  <span className="text-sm font-medium">{studentSubmissions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Avg. Score</span>
                  <span className="text-sm font-medium">
                    {studentSubmissions.length > 0 
                      ? (studentSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / studentSubmissions.length).toFixed(1)
                      : '-'}
                  </span>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button 
                className={`w-full flex items-center px-4 py-3 ${selectedTab === 'assignments' ? 'bg-green-50 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('assignments')}
              >
                <BookOpen className={`mr-3 h-5 w-5 ${selectedTab === 'assignments' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'assignments' ? 'text-green-600' : 'text-gray-600'}`}>Assignments</span>
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 ${selectedTab === 'feedback' ? 'bg-green-50 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('feedback')}
              >
                <MessageSquare className={`mr-3 h-5 w-5 ${selectedTab === 'feedback' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'feedback' ? 'text-green-600' : 'text-gray-600'}`}>Feedback</span>
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 ${selectedTab === 'analytics' ? 'bg-green-50 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('analytics')}
              >
                <FileText className={`mr-3 h-5 w-5 ${selectedTab === 'analytics' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'analytics' ? 'text-green-600' : 'text-gray-600'}`}>Analytics</span>
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 ${selectedTab === 'resources' ? 'bg-green-50 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('resources')}
              >
                <Play className={`mr-3 h-5 w-5 ${selectedTab === 'resources' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'resources' ? 'text-green-600' : 'text-gray-600'}`}>Resources</span>
              </button>
            </nav>
            
            {/* Daily Motivation */}
            <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 text-white">
              <h3 className="font-medium mb-1">Today&apos;s Motivation</h3>
              <p className="text-sm text-purple-100">
                &quot;Education is the passport to the future, for tomorrow belongs to those who prepare for it today.&quot;
              </p>
              <p className="text-xs mt-2 text-purple-200">- Malcolm X</p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Assignments Tab */}
            {selectedTab === 'assignments' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Assignments</h2>
                
                {/* Assignment list */}
                <div className="mb-8 space-y-4">
                  {mockAssignments.map(assignment => {
                    const status = getCompletionStatus(assignment.id);
                    
                    return (
                      <div 
                        key={assignment.id} 
                        className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedAssignment === assignment.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          // Only update if it's different to avoid unnecessary re-renders
                          if (selectedAssignment !== assignment.id) {
                            setSelectedAssignment(assignment.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">{assignment.subject}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              status === 'completed' ? 'bg-green-100 text-green-800' :
                              status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {status === 'completed' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </>
                              ) : status === 'overdue' ? (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{assignment.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <p className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">Max Score: {assignment.maxScore}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Assignment submission form */}
                {selectedAssignment && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Your Work</h3>
                    
                    <div className="mb-4">
                      <label htmlFor="assignmentContent" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Answer
                      </label>
                      <textarea
                        id="assignmentContent"
                        rows={6}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Type your answer here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submission result */}
                {currentSubmission && (
                  <div className="mt-8 border border-green-200 rounded-lg p-6 bg-green-50">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-lg font-medium text-green-800">Assignment Graded</h3>
                        </div>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Your Score</span>
                        <span className="text-sm font-medium text-gray-900">{currentSubmission.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${currentSubmission.score}%` }}></div>
                      </div>
                      <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">{currentSubmission.feedback}</p>
                        </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSubmission(null);
                          setSubmissionText('');
                          setSelectedAssignment(null);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Tab */}
            {selectedTab === 'feedback' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment Feedback & Analysis</h2>
                
                {studentSubmissions.length > 0 ? (
                  <div className="space-y-6">
                    {studentSubmissions.map(submission => {
                      const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
                      if (!assignment) return null;
                      
                      return (
                        <div key={submission.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                              <p className="text-sm text-gray-500">{assignment.subject}</p>
                            </div>
                            <div className="text-right">
                            <div className="flex items-center">
                                <span className="text-lg font-bold text-gray-900">{submission.score}</span>
                                <span className="text-sm text-gray-500 ml-1">/100</span>
                              </div>
                              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {getLetterGrade(submission.score || 0)}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Submission</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mb-4 whitespace-pre-line">
                              {submission.content}
                            </p>
                                
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Feedback</h4>
                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                  <p className="text-sm text-blue-800 whitespace-pre-line">{submission.feedback}</p>
                                </div>
                          </div>
                          
                          <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Analysis</h4>
                                <div className="space-y-4">
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Strengths</h5>
                                    <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
                                      <li>Clear understanding of core concepts</li>
                                      <li>Well-structured responses</li>
                                      <li>Good use of examples</li>
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h5>
                                    <ul className="list-disc list-inside text-sm text-amber-600 space-y-1">
                                      <li>More detailed explanations needed</li>
                                      <li>Could include more real-world applications</li>
                                      <li>Work on time management</li>
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h5>
                                    <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                                      <li>Review chapter 3 for better understanding</li>
                                      <li>Practice with additional exercises</li>
                                      <li>Attend the upcoming workshop on this topic</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                  Submitted on {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString()}
                                </div>
                                <button
                                  onClick={() => {
                                    // Add functionality to download feedback
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Download Feedback
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start by submitting your first assignment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {selectedTab === 'analytics' && (
              <PersonalizedAnalytics 
                studentId={activeStudent.id}
                studentName={activeStudent.name}
              />
            )}
            
            {/* Resources Tab */}
            {selectedTab === 'resources' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Resources</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recommended for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedResources.map(resource => (
                      <a 
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-gray-200 hover:border-indigo-300 hover:shadow rounded-lg p-4 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-indigo-100 text-indigo-600 mr-3">
                            {resource.type === 'Video' ? (
                              <Play className="h-5 w-5" />
                            ) : resource.type === 'Article' ? (
                              <FileText className="h-5 w-5" />
                            ) : resource.type === 'Interactive' ? (
                              <Trophy className="h-5 w-5" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </span>
                          <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {resource.subject}
                                  </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">{resource.type}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">All Subjects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Mathematics', 'Science', 'English', 'History'].map(subject => (
                      <div key={subject} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900">{subject}</h4>
                                  </div>
                        <div className="p-4">
                          <ul className="space-y-3">
                            {mockLearningResources
                              .filter(resource => resource.subject === subject)
                              .slice(0, 3)
                              .map(resource => (
                                <li key={resource.id} className="flex items-start">
                                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2 mt-0.5 text-xs">
                                    {resource.type.charAt(0)}
                                  </div>
                          <a 
                            href={resource.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                                    {resource.title}
                          </a>
                                </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Chatbot */}
      <Chatbot studentName={activeStudent.name} />
    </div>
  );
} 