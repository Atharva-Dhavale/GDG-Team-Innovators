'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { mockAssignments, mockStudents, mockSubmissions } from '@/lib/mockData';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { gradeAssignment } from '@/utils/gradingLogic';
import { generateFeedback, generateLearningRecommendations } from '@/utils/feedbackGenerator';
import { useToast } from '@/components/Toast';
import FeedbackCard from '@/components/FeedbackCard';
import { Assignment } from '@/types';

export default function StudentAssignments() {
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [feedback, setFeedback] = useState<{
    score: number;
    feedback: string;
    submittedAt: string;
  } | null>(null);

  // Using first student as the active one
  const activeStudent = mockStudents[0];
  
  // Get student's submissions
  const studentSubmissions = mockSubmissions.filter(sub => sub.studentId === activeStudent.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment || !content.trim()) {
      addToast('Please select an assignment and enter your work.', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to grade assignment');
      }

      const data = await response.json();
      
      setFeedback({
        score: data.score,
        feedback: data.feedback,
        submittedAt: data.submittedAt
      });
      
      setSubmitted(true);
      addToast('Assignment submitted and graded successfully!', 'success');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      
      // Fallback to client-side grading if API fails
      const score = gradeAssignment(content);
      const feedbackText = generateFeedback(content, score, selectedAssignment.subject);
      
      setFeedback({
        score,
        feedback: feedbackText,
        submittedAt: new Date().toISOString()
      });
      
      setSubmitted(true);
      addToast('Assignment graded using offline mode (API unavailable).', 'info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setSelectedAssignment(null);
    setSubmitted(false);
    setFeedback(null);
    addToast('Ready to submit a new assignment', 'info');
  };

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Submit Assignment</h2>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="assignment" className="block text-sm font-medium text-gray-700">
                  Select Assignment
                </label>
                <select
                  id="assignment"
                  value={selectedAssignment?.id || ''}
                  onChange={(e) => {
                    const assignmentId = e.target.value;
                    const assignment = mockAssignments.find(a => a.id === assignmentId) || null;
                    setSelectedAssignment(assignment);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select an assignment</option>
                  {mockAssignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title} - {assignment.subject}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAssignment && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-900">{selectedAssignment.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedAssignment.subject}</p>
                  <p className="text-sm text-gray-700 mt-2">{selectedAssignment.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Your Answer
                </label>
                <textarea
                  id="content"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  placeholder="Type your answer here..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Submit Assignment
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Assignment Submitted!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your assignment has been graded by our AI system.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {feedback && selectedAssignment && (
                <div className="mt-6">
                  <FeedbackCard
                    score={feedback.score}
                    feedback={feedback.feedback}
                    subject={selectedAssignment.subject}
                    assignmentTitle={selectedAssignment.title}
                    submittedAt={feedback.submittedAt}
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Submit Another Assignment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Submission History</h2>
          
          {studentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {studentSubmissions.map((submission) => {
                const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
                if (!assignment) return null;
                
                return (
                  <div key={submission.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Score: {submission.score || 'Pending'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {submission.feedback && (
                      <p className="mt-2 text-sm text-gray-600">{submission.feedback}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No previous submissions found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
} 