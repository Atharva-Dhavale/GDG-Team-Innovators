'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { BookOpen, Brain, BarChart2, Compass, ArrowUpRight } from 'lucide-react';
import { getLetterGrade } from '@/utils/gradingLogic';
import { mockSubmissions, mockAssignments } from '@/lib/mockData';

interface PersonalizedAnalyticsProps {
  studentId: string;
  studentName: string;
}

// Types for our analytics data
interface SubjectScore {
  subject: string;
  score: number;
  color: string;
}

interface SkillData {
  skill: string;
  score: number;
  fullMark: 100;
}

interface GrowthData {
  month: string;
  score: number;
}

export default function PersonalizedAnalytics({ studentId, studentName }: PersonalizedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filter submissions for this student
  const studentSubmissions = mockSubmissions.filter(sub => sub.studentId === studentId);
  
  // Calculate overall average score
  const averageScore = studentSubmissions.length > 0 
    ? Math.round(studentSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / studentSubmissions.length) 
    : 0;
  
  // Calculate subject-wise performance
  const subjectPerformance: SubjectScore[] = [];
  const subjects = [...new Set(mockAssignments.map(a => a.subject))];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
  
  subjects.forEach((subject, index) => {
    const subjectSubmissions = studentSubmissions.filter(sub => {
      const assignment = mockAssignments.find(a => a.id === sub.assignmentId);
      return assignment?.subject === subject;
    });
    
    if (subjectSubmissions.length > 0) {
      const averageSubjectScore = Math.round(
        subjectSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / subjectSubmissions.length
      );
      
      subjectPerformance.push({
        subject,
        score: averageSubjectScore,
        color: colors[index % colors.length]
      });
    }
  });
  
  // Simulate growth data over time
  const growthData: GrowthData[] = [
    { month: 'January', score: 65 },
    { month: 'February', score: 68 },
    { month: 'March', score: 72 },
    { month: 'April', score: 75 },
    { month: 'May', score: 79 },
    { month: 'June', score: 84 },
  ];
  
  // Simulate skill breakdown data
  const skillsData: SkillData[] = [
    { skill: 'Problem Solving', score: 80, fullMark: 100 },
    { skill: 'Critical Thinking', score: 75, fullMark: 100 },
    { skill: 'Creativity', score: 85, fullMark: 100 },
    { skill: 'Communication', score: 70, fullMark: 100 },
    { skill: 'Research', score: 65, fullMark: 100 },
    { skill: 'Time Management', score: 60, fullMark: 100 },
  ];
  
  // Personalized recommendations based on performance
  const getRecommendations = () => {
    const weakestSubject = subjectPerformance.sort((a, b) => a.score - b.score)[0];
    const strongestSubject = subjectPerformance.sort((a, b) => b.score - a.score)[0];
    
    return {
      improvementArea: weakestSubject,
      strengths: strongestSubject,
      generalTips: [
        "Set aside dedicated study time each day for consistent progress",
        "Break down large assignments into smaller, manageable tasks",
        "Use active recall techniques rather than passive reading",
        "Teach concepts to others to solidify your understanding"
      ],
      subjectSpecificTips: {
        Mathematics: [
          "Practice solving different types of problems regularly",
          "Focus on understanding concepts rather than memorizing formulas",
          "Create a formula sheet for quick reference",
          "Watch video tutorials for complex topics"
        ],
        Science: [
          "Create diagrams and visual aids to understand concepts",
          "Connect theoretical knowledge with real-world examples",
          "Perform simple experiments when possible",
          "Use mnemonic devices for remembering scientific terminology"
        ],
        English: [
          "Read diverse materials to improve vocabulary and comprehension",
          "Practice writing regularly and seek feedback",
          "Use mind maps for analyzing literary works",
          "Participate in discussions to develop critical thinking"
        ],
        History: [
          "Create timelines to understand chronological relationships",
          "Focus on causes and effects rather than just dates",
          "Use storytelling techniques to remember historical events",
          "Connect historical events to present-day scenarios"
        ]
      }
    };
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Personalized Learning Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Overall Performance</h3>
          <div className="flex items-end">
            <span className="text-4xl font-bold">{averageScore}</span>
            <span className="ml-2 text-xl">/100</span>
          </div>
          <p className="mt-2 text-indigo-100">Grade: {getLetterGrade(averageScore)}</p>
          <div className="mt-4 pt-4 border-t border-indigo-300 border-opacity-30">
            <p className="text-sm">Keep pushing your boundaries, {studentName.split(' ')[0]}!</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Strongest Subject</h3>
          <div className="flex items-end">
            <span className="text-4xl font-bold">{recommendations.strengths?.subject || "N/A"}</span>
          </div>
          <p className="mt-2 text-emerald-100">Score: {recommendations.strengths?.score || 0}/100</p>
          <div className="mt-4 pt-4 border-t border-emerald-300 border-opacity-30">
            <p className="text-sm">You&apos;re excelling in this area!</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Focus Area</h3>
          <div className="flex items-end">
            <span className="text-4xl font-bold">{recommendations.improvementArea?.subject || "N/A"}</span>
          </div>
          <p className="mt-2 text-amber-100">Score: {recommendations.improvementArea?.score || 0}/100</p>
          <div className="mt-4 pt-4 border-t border-amber-300 border-opacity-30">
            <p className="text-sm">With a little more focus, you&apos;ll improve!</p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <TabsTrigger 
            value="overview" 
            className={`flex items-center justify-center py-2 px-4 flex-1 rounded ${
              activeTab === 'overview' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="subjects" 
            className={`flex items-center justify-center py-2 px-4 flex-1 rounded ${
              activeTab === 'subjects' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Subjects</span>
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className={`flex items-center justify-center py-2 px-4 flex-1 rounded ${
              activeTab === 'skills' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="h-4 w-4 mr-2" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className={`flex items-center justify-center py-2 px-4 flex-1 rounded ${
              activeTab === 'recommendations' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass className="h-4 w-4 mr-2" />
            <span>Guidance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Over Time</h3>
            <div className="h-80 bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Average Score" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-900 mb-2">Performance Insights</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowUpRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                <span className="text-indigo-800">Your scores have improved by {growthData[growthData.length - 1].score - growthData[0].score} points since {growthData[0].month}.</span>
              </li>
              <li className="flex items-start">
                <ArrowUpRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                <span className="text-indigo-800">You&apos;re performing above average in {subjectPerformance.filter(s => s.score > 70).length} subjects.</span>
              </li>
              <li className="flex items-start">
                <ArrowUpRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                <span className="text-indigo-800">Your strongest month was {growthData.sort((a, b) => b.score - a.score)[0].month} with a score of {growthData.sort((a, b) => b.score - a.score)[0].score}.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Performance</h3>
            <div className="h-80 bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {subjectPerformance.map((subject) => (
              <div 
                key={subject.subject} 
                className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: '4px', borderLeftColor: subject.color }}
              >
                <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ width: `${subject.score}%`, backgroundColor: subject.color }}
                    ></div>
                  </div>
                  <span className="ml-4 text-gray-700 font-medium">{subject.score}%</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {subject.score >= 90 
                    ? "Excellent mastery of this subject!"
                    : subject.score >= 80
                    ? "Good understanding with room for improvement."
                    : subject.score >= 70
                    ? "Solid foundation, keep practicing."
                    : "Needs attention and more focused study."}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Assessment</h3>
            <div className="h-80 bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Skills" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
            <h3 className="text-lg font-medium text-purple-900 mb-4">Skills Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillsData.map((skill) => (
                <div key={skill.skill} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-purple-800">{skill.skill}</span>
                    <span className="text-sm font-medium text-purple-800">{skill.score}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-purple-700">
                    {skill.score >= 80 
                      ? "Excellent" 
                      : skill.score >= 70 
                      ? "Good" 
                      : skill.score >= 60 
                      ? "Average" 
                      : "Needs improvement"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-900 mb-4">General Learning Tips</h3>
              <ul className="space-y-3">
                {recommendations.generalTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 mt-0.5 text-xs">
                      {index + 1}
                    </div>
                    <span className="text-blue-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100">
              <h3 className="text-lg font-medium text-emerald-900 mb-4">Focus Area: {recommendations.improvementArea?.subject}</h3>
              <ul className="space-y-3">
                {recommendations.subjectSpecificTips[recommendations.improvementArea?.subject as keyof typeof recommendations.subjectSpecificTips]?.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-3 mt-0.5 text-xs">
                      {index + 1}
                    </div>
                    <span className="text-emerald-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-amber-50 rounded-lg p-6 border border-amber-100">
            <h3 className="text-lg font-medium text-amber-900 mb-4">Personalized Learning Path</h3>
            <p className="text-amber-800 mb-4">
              Based on your performance, we recommend focusing on strengthening your {recommendations.improvementArea?.subject} skills while continuing to develop your {recommendations.strengths?.subject} knowledge.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
                <h4 className="font-medium text-amber-900 mb-2">Short-term Goal</h4>
                <p className="text-sm text-amber-800">
                  Improve your {recommendations.improvementArea?.subject} score by at least 5 points in the next assignment.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
                <h4 className="font-medium text-amber-900 mb-2">Mid-term Goal</h4>
                <p className="text-sm text-amber-800">
                  Achieve a consistent score of 80+ across all subjects within two months.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
                <h4 className="font-medium text-amber-900 mb-2">Long-term Goal</h4>
                <p className="text-sm text-amber-800">
                  Develop balanced proficiency across all subjects and core skills by the end of the term.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 