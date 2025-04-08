import { NextRequest, NextResponse } from 'next/server';
import { gradeAssignment } from '@/utils/gradingLogic';
import { generateFeedback } from '@/utils/feedbackGenerator';
import { mockAssignments } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract submission data
    const { content, assignmentId } = body;
    
    if (!content || !assignmentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find the assignment
    const assignment = mockAssignments.find(a => a.id === assignmentId);
    
    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }
    
    // Generate score using mock grading logic
    const score = gradeAssignment(content);
    
    // Generate feedback using mock feedback generator
    const feedback = generateFeedback(content, score, assignment.subject);
    
    // Return the graded assignment with a delay to simulate processing
    return NextResponse.json({ 
      score,
      feedback,
      submittedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 