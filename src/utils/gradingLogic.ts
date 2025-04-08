/**
 * Mock grading logic that simulates AI-powered assignment grading
 */

/**
 * Grade an assignment based on text content
 * This is a mock function that returns a random score between 60-100
 */
export function gradeAssignment(text: string): number {
  // In a real system, this would connect to an AI service
  // For demo purposes, we'll use a simple algorithm based on text length and complexity
  
  // Base score between 60-80
  let score = 60 + Math.floor(Math.random() * 21);
  
  // Add points for longer submissions (indicating more detail)
  if (text.length > 200) score += 5;
  if (text.length > 500) score += 5;
  
  // Add points for using subject-specific keywords
  const keywords = [
    "equation", "formula", "calculation", "solve",  // Math
    "cell", "organism", "structure", "function",    // Science
    "analysis", "theme", "character", "evidence",   // English
    "event", "historical", "timeline", "impact"     // History
  ];
  
  let keywordCount = 0;
  keywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) {
      keywordCount++;
    }
  });
  
  // Add up to 10 points for keywords
  score += Math.min(keywordCount * 2, 10);
  
  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Check if a submission is likely plagiarized
 * This is a mock function for demo purposes
 */
export function checkPlagiarism(text: string): boolean {
  // In a real system, this would use comparison algorithms or services
  // For demo, we'll just randomly flag a few submissions
  return Math.random() < 0.05; // 5% chance of being flagged
}

/**
 * Calculate letter grade from numerical score
 */
export function getLetterGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Calculate class average from array of scores
 */
export function calculateClassAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 10) / 10; // Round to 1 decimal place
} 