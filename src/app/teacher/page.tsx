'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useToast } from '@/components/Toast';
import { 
  mockPerformanceData, 
  mockSubmissions, 
  mockStudents, 
  mockAssignments,
  mockStudentProgress
} from '@/lib/mockData';
import { getLetterGrade } from '@/utils/gradingLogic';

export default function TeacherDashboard() {
  const { addToast } = useToast();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'submissions' | 'students'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Calculate overall class metrics
  const allScores = mockSubmissions.filter(sub => sub.score).map(sub => sub.score as number);
  const averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  const highestScore = Math.max(...allScores);

  // Get student details if selected
  const studentDetails = selectedStudent 
    ? mockStudents.find(s => s.id === selectedStudent) 
    : null;
  
  // Get student submissions if selected
  const studentSubmissions = selectedStudent
    ? mockSubmissions.filter(sub => sub.studentId === selectedStudent)
    : [];

  // Send message handler (mock)
  const sendMessage = () => {
    if (!message.trim() || !selectedStudent) return;
    
    addToast(`Message sent to ${studentDetails?.name}`, 'success');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">EduAssist</Link>
            <span className="ml-2 text-sm text-gray-500">Teacher Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Demo Version
            </span>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                T
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Dr. Wilson</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl">
                  <span>SW</span>
                </div>
                <h3 className="mt-2 font-semibold text-gray-900">Dr. Sarah Wilson</h3>
                <p className="text-sm text-gray-500">Mathematics Teacher</p>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Students</span>
                  <span className="font-medium">{mockStudents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Assignments</span>
                  <span className="font-medium">{mockAssignments.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Submissions</span>
                  <span className="font-medium">{mockSubmissions.length}</span>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${selectedTab === 'overview' ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('overview')}
              >
                <BarChart3 className={`mr-3 h-5 w-5 ${selectedTab === 'overview' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'overview' ? 'text-indigo-600' : 'text-gray-600'}`}>Overview</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${selectedTab === 'submissions' ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('submissions')}
              >
                <FileText className={`mr-3 h-5 w-5 ${selectedTab === 'submissions' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'submissions' ? 'text-indigo-600' : 'text-gray-600'}`}>Submissions</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${selectedTab === 'students' ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('students')}
              >
                <Users className={`mr-3 h-5 w-5 ${selectedTab === 'students' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedTab === 'students' ? 'text-indigo-600' : 'text-gray-600'}`}>Students</span>
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Class Average</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-3xl font-semibold text-gray-900">{averageScore.toFixed(1)}</p>
                      <p className="ml-2 text-sm font-medium text-gray-500">/ 100</p>
                    </div>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {getLetterGrade(averageScore)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Highest Score</h3>
                    <p className="text-3xl font-semibold text-gray-900">{highestScore}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {getLetterGrade(highestScore)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Submissions</h3>
                    <p className="text-3xl font-semibold text-gray-900">{mockSubmissions.length}</p>
                    <p className="mt-2 text-sm text-gray-500">From {mockSubmissions.filter((s, i, a) => a.findIndex(t => t.studentId === s.studentId) === i).length} students</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockPerformanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageScore" name="Average Score" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Student Progress Over Time</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockStudentProgress}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[60, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          name="Average Score" 
                          stroke="#6366f1" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'submissions' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-4 py-5 sm:px-6 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Recent Submissions</h3>
                  <p className="mt-1 text-sm text-gray-500">Review student work and AI-generated feedback</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockSubmissions.map((submission) => {
                        const student = mockStudents.find(s => s.id === submission.studentId);
                        const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
                        return (
                          <tr key={submission.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStudent(submission.studentId)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                  {student?.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                                  <div className="text-sm text-gray-500">{student?.grade}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{assignment?.title}</div>
                              <div className="text-sm text-gray-500">{assignment?.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                (submission.score || 0) >= 90 ? 'bg-green-100 text-green-800' :
                                (submission.score || 0) >= 80 ? 'bg-blue-100 text-blue-800' :
                                (submission.score || 0) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {submission.score}/100
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="truncate max-w-xs">{submission.feedback?.substring(0, 50)}...</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'students' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-4 py-5 sm:px-6 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Students</h3>
                  <p className="mt-1 text-sm text-gray-500">Click on a student to view their details</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockStudents.map((student) => {
                        const studentSubmissions = mockSubmissions.filter(s => s.studentId === student.id);
                        const avgScore = studentSubmissions.length > 0 
                          ? studentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / studentSubmissions.length 
                          : 0;
                        
                        return (
                          <tr key={student.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStudent(student.id)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  {student.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.grade}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {studentSubmissions.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {studentSubmissions.length > 0 ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  avgScore >= 90 ? 'bg-green-100 text-green-800' :
                                  avgScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                  avgScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {avgScore.toFixed(1)}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">No submissions</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student.id);
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Student details drawer - shows when a student is selected */}
            {selectedStudent && (
              <div className="fixed inset-0 overflow-hidden z-40" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                       onClick={() => setSelectedStudent(null)}></div>
                  
                  <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-md">
                      <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                              Student Details
                            </h2>
                            <div className="ml-3 h-7 flex items-center">
                              <button
                                type="button"
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={() => setSelectedStudent(null)}
                              >
                                <span className="sr-only">Close panel</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 relative flex-1 px-4 sm:px-6">
                          <div className="flex flex-col items-center mb-6">
                            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-semibold">
                              {studentDetails?.name.charAt(0)}
                            </div>
                            <h3 className="mt-3 text-xl font-medium text-gray-900">{studentDetails?.name}</h3>
                            <p className="text-sm text-gray-500">{studentDetails?.grade} Grade</p>
                          </div>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                              <p className="text-sm text-gray-500">Submissions</p>
                              <p className="text-2xl font-semibold text-gray-900">{studentSubmissions.length}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                              <p className="text-sm text-gray-500">Avg. Score</p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {studentSubmissions.length > 0 
                                  ? (studentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / studentSubmissions.length).toFixed(1)
                                  : '-'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Recent Submissions */}
                          <div className="mb-6">
                            <h4 className="text-base font-medium text-gray-900 mb-3">Recent Submissions</h4>
                            <div className="space-y-3">
                              {studentSubmissions.length > 0 ? (
                                studentSubmissions.map(submission => {
                                  const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
                                  return (
                                    <div key={submission.id} className="bg-white border rounded-lg p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-900">{assignment?.title}</h5>
                                          <p className="text-xs text-gray-500">{assignment?.subject}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          (submission.score || 0) >= 90 ? 'bg-green-100 text-green-800' :
                                          (submission.score || 0) >= 80 ? 'bg-blue-100 text-blue-800' :
                                          (submission.score || 0) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {submission.score}/100
                                        </span>
                                      </div>
                                      <div className="mt-2">
                                        <h6 className="text-xs font-medium text-gray-700">Submission:</h6>
                                        <p className="text-xs text-gray-600 mt-1">{submission.content.substring(0, 100)}...</p>
                                      </div>
                                      <div className="mt-2">
                                        <h6 className="text-xs font-medium text-gray-700">Feedback:</h6>
                                        <p className="text-xs text-gray-600 mt-1">{submission.feedback}</p>
                                      </div>
                                      <div className="mt-2 text-xs text-gray-500">
                                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-gray-500">No submissions yet.</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Message student (mock feature) */}
                          <div className="mt-6">
                            <h4 className="text-base font-medium text-gray-900 mb-3">Send Message</h4>
                            <div className="mt-1">
                              <textarea
                                rows={3}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Type a message to the student..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                              ></textarea>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={sendMessage}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 