'use client';

import { MessageSquare, Award, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { generateLearningRecommendations } from '@/utils/feedbackGenerator';
import { getLetterGrade } from '@/utils/gradingLogic';

interface FeedbackCardProps {
  score: number;
  feedback: string;
  subject: string;
  assignmentTitle: string;
  submittedAt?: string;
}

export default function FeedbackCard({
  score,
  feedback,
  subject,
  assignmentTitle,
  submittedAt
}: FeedbackCardProps) {
  // Get recommendations based on score and subject
  const recommendations = generateLearningRecommendations(score, subject);
  
  // Determine score category for styling
  const getScoreCategory = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'needsImprovement';
  };
  
  const scoreCategory = getScoreCategory(score);
  
  // Get appropriate icon and color based on score category
  const getScoreBadge = () => {
    switch (scoreCategory) {
      case 'excellent':
        return { 
          icon: <Award className="h-5 w-5" />, 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'good':
        return { 
          icon: <CheckCircle className="h-5 w-5" />, 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'average':
        return { 
          icon: <TrendingUp className="h-5 w-5" />, 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'needsImprovement':
        return { 
          icon: <AlertTriangle className="h-5 w-5" />, 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return { 
          icon: <MessageSquare className="h-5 w-5" />, 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };
  
  const badge = getScoreBadge();

  return (
    <div className={`rounded-lg border ${badge.borderColor} overflow-hidden`}>
      {/* Header with score */}
      <div className={`${badge.bgColor} ${badge.textColor} px-4 py-3 flex justify-between items-center`}>
        <div className="flex items-center">
          {badge.icon}
          <h3 className="ml-2 font-medium">{assignmentTitle}</h3>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-lg font-bold">{score}</span>
            <span className="text-sm ml-1">/ 100</span>
          </div>
          <span className="text-xs">Grade: {getLetterGrade(score)}</span>
        </div>
      </div>
      
      {/* Feedback content */}
      <div className="p-4 bg-white">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
          <p className="text-sm text-gray-600">{feedback}</p>
        </div>
        
        {/* Recommendations */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="inline-block h-4 w-4 mr-2 mt-0.5 text-indigo-500">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Timestamp */}
        {submittedAt && (
          <div className="mt-4 text-xs text-gray-500">
            Assessed on {new Date(submittedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
} 