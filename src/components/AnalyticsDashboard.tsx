'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockPerformanceData, mockStudentProgress } from '@/lib/mockData';

interface AnalyticsDashboardProps {
  submissions: Array<{
    id: string;
    studentId: string;
    assignmentId: string;
    score?: number;
  }>;
}

export default function AnalyticsDashboard({ submissions }: AnalyticsDashboardProps) {
  // Calculate grade distribution
  const gradeDistribution = [
    { name: 'A (90-100)', value: 0 },
    { name: 'B (80-89)', value: 0 },
    { name: 'C (70-79)', value: 0 },
    { name: 'D (60-69)', value: 0 },
    { name: 'F (0-59)', value: 0 },
  ];
  
  submissions.forEach(submission => {
    const score = submission.score || 0;
    if (score >= 90) gradeDistribution[0].value++;
    else if (score >= 80) gradeDistribution[1].value++;
    else if (score >= 70) gradeDistribution[2].value++;
    else if (score >= 60) gradeDistribution[3].value++;
    else gradeDistribution[4].value++;
  });
  
  // Colors for pie chart
  const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f97316', '#f43f5e'];
  
  // Calculate overall stats
  const submissionsWithScores = submissions.filter(s => s.score !== undefined);
  const averageScore = submissionsWithScores.length > 0
    ? submissionsWithScores.reduce((sum, s) => sum + (s.score || 0), 0) / submissionsWithScores.length
    : 0;
  
  const highestScore = submissionsWithScores.length > 0
    ? Math.max(...submissionsWithScores.map(s => s.score || 0))
    : 0;
    
  const lowestScore = submissionsWithScores.length > 0
    ? Math.min(...submissionsWithScores.map(s => s.score || 0))
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Class Performance Analytics</h3>
        
        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Submissions</h4>
            <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Average Score</h4>
            <p className="text-3xl font-bold text-gray-900">{averageScore.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Score Range</h4>
            <p className="text-3xl font-bold text-gray-900">{lowestScore} - {highestScore}</p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Grade distribution pie chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Grade Distribution</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Subject performance */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Subject Performance</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockPerformanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
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
          
          {/* Progress over time */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Progress Over Time</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockStudentProgress}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
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
        
        {/* Insights section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h5 className="font-medium text-indigo-800 mb-2">Subject Strengths</h5>
              <p className="text-sm text-indigo-700">
                {(() => {
                  const bestSubject = [...mockPerformanceData].sort((a, b) => b.averageScore - a.averageScore)[0];
                  return `Students are performing best in ${bestSubject.subject} with an average score of ${bestSubject.averageScore}.`;
                })()}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h5 className="font-medium text-amber-800 mb-2">Areas for Improvement</h5>
              <p className="text-sm text-amber-700">
                {(() => {
                  const worstSubject = [...mockPerformanceData].sort((a, b) => a.averageScore - b.averageScore)[0];
                  return `Focus more attention on ${worstSubject.subject} where students have an average of ${worstSubject.averageScore}.`;
                })()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h5 className="font-medium text-green-800 mb-2">Progress Trend</h5>
              <p className="text-sm text-green-700">
                {(() => {
                  const firstMonth = mockStudentProgress[0];
                  const lastMonth = mockStudentProgress[mockStudentProgress.length - 1];
                  const change = lastMonth.score - firstMonth.score;
                  return `Overall scores have ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} points since ${firstMonth.month}.`;
                })()}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h5 className="font-medium text-blue-800 mb-2">Participation Rate</h5>
              <p className="text-sm text-blue-700">
                {(() => {
                  // This would normally calculate based on class size vs submissions
                  const totalStudents = 5; // From our mock data
                  const participatingStudents = new Set(submissions.map(s => s.studentId)).size;
                  const participationRate = (participatingStudents / totalStudents) * 100;
                  return `${participationRate}% of students have submitted assignments this term.`;
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 