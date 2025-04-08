import { 
  Student, 
  Teacher, 
  Assignment, 
  Submission,
  PerformanceData,
  StudentProgress,
  LearningResource
} from '@/types';

// Mock Students
export const mockStudents: Student[] = [
  { id: "s1", name: "Arjun Sharma", grade: "10th", avatarUrl: "https://i.pravatar.cc/150?u=arjun" },
  { id: "s2", name: "Priya Patel", grade: "10th", avatarUrl: "https://i.pravatar.cc/150?u=priya" },
  { id: "s3", name: "Rahul Verma", grade: "10th", avatarUrl: "https://i.pravatar.cc/150?u=rahul" },
  { id: "s4", name: "Aisha Khan", grade: "10th", avatarUrl: "https://i.pravatar.cc/150?u=aisha" },
  { id: "s5", name: "Vikram Singh", grade: "10th", avatarUrl: "https://i.pravatar.cc/150?u=vikram" },
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  { id: "t1", name: "Dr. Neha Gupta", subject: "Mathematics", avatarUrl: "https://i.pravatar.cc/150?u=neha" },
  { id: "t2", name: "Prof. Rajesh Kumar", subject: "Science", avatarUrl: "https://i.pravatar.cc/150?u=rajesh" },
  { id: "t3", name: "Ms. Anjali Desai", subject: "English", avatarUrl: "https://i.pravatar.cc/150?u=anjali" },
  { id: "t4", name: "Mr. Anand Joshi", subject: "History", avatarUrl: "https://i.pravatar.cc/150?u=anand" },
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Quadratic Equations",
    subject: "Mathematics",
    description: "Solve the following quadratic equations and show your work.",
    dueDate: "2023-05-15",
    maxScore: 100,
  },
  {
    id: "a2",
    title: "Cell Structure Essay",
    subject: "Science",
    description: "Write a 500-word essay on the structure and function of animal cells.",
    dueDate: "2023-05-18",
    maxScore: 100,
  },
  {
    id: "a3",
    title: "Literary Analysis",
    subject: "English",
    description: "Analyze the main themes in 'To Kill a Mockingbird' with textual evidence.",
    dueDate: "2023-05-20",
    maxScore: 100,
  },
  {
    id: "a4",
    title: "World War II Timeline",
    subject: "History",
    description: "Create a timeline of major events during World War II with brief descriptions.",
    dueDate: "2023-05-22",
    maxScore: 100,
  },
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: "sub1",
    studentId: "s1",
    assignmentId: "a1",
    content: "I solved the equations by factoring and using the quadratic formula. For x^2 + 5x + 6 = 0, I got x = -2 and x = -3.",
    submittedAt: "2023-05-10T14:30:00Z",
    score: 85,
    feedback: "Good work on factoring! Make sure to check your solutions by substituting back into the original equation. You've shown a solid understanding of the quadratic formula."
  },
  {
    id: "sub2",
    studentId: "s2",
    assignmentId: "a2",
    content: "Animal cells are eukaryotic cells with a nucleus and organelles. The cell membrane controls what enters and exits the cell. The nucleus contains DNA and acts as the cell's control center.",
    submittedAt: "2023-05-12T10:15:00Z",
    score: 92,
    feedback: "Excellent description of animal cell structure. Your explanation of the function of each organelle is clear and accurate. Consider including more about the endoplasmic reticulum in future responses."
  },
  {
    id: "sub3",
    studentId: "s3",
    assignmentId: "a3",
    content: "In 'To Kill a Mockingbird', Harper Lee explores themes of racial injustice through the trial of Tom Robinson. The character of Atticus Finch represents moral integrity in the face of societal prejudice.",
    submittedAt: "2023-05-14T16:45:00Z",
    score: 78,
    feedback: "Good identification of themes. Your analysis could be strengthened with more specific textual evidence and quotes. Try to connect the themes to the historical context of the novel."
  },
  {
    id: "sub4",
    studentId: "s4",
    assignmentId: "a4",
    content: "September 1, 1939: Germany invades Poland, starting WWII. December 7, 1941: Japan attacks Pearl Harbor. June 6, 1944: D-Day invasion of Normandy. August 6, 1945: Atomic bomb dropped on Hiroshima.",
    submittedAt: "2023-05-16T09:20:00Z",
    score: 88,
    feedback: "Very good timeline with key events identified. Your chronology is accurate. To improve, consider adding brief explanations of why each event was significant to the overall course of the war."
  },
  {
    id: "sub5",
    studentId: "s5",
    assignmentId: "a1",
    content: "For the equation 2x^2 - 7x + 3 = 0, I used the quadratic formula: x = [7 ± √(49-24)]/4. This gives x = 3 and x = 0.5.",
    submittedAt: "2023-05-11T11:50:00Z",
    score: 75,
    feedback: "Your approach using the quadratic formula is correct, but there's an error in your calculation. Double-check your work with the discriminant. Review the steps for applying the quadratic formula."
  },
];

// Performance data for analytics
export const mockPerformanceData: PerformanceData[] = [
  { subject: "Mathematics", averageScore: 82, submissions: 25 },
  { subject: "Science", averageScore: 78, submissions: 22 },
  { subject: "English", averageScore: 85, submissions: 28 },
  { subject: "History", averageScore: 79, submissions: 20 },
];

// Student performance over time
export const mockStudentProgress: StudentProgress[] = [
  { month: "January", score: 72 },
  { month: "February", score: 75 },
  { month: "March", score: 79 },
  { month: "April", score: 83 },
  { month: "May", score: 88 },
];

// Learning resources
export const mockLearningResources: LearningResource[] = [
  { 
    id: "r1", 
    title: "Khan Academy: Quadratic Equations", 
    type: "Video", 
    url: "#", 
    subject: "Mathematics",
    recommendedFor: [70, 85] // score range
  },
  { 
    id: "r2", 
    title: "Cell Biology Fundamentals", 
    type: "Article", 
    url: "#", 
    subject: "Science",
    recommendedFor: [65, 90]
  },
  { 
    id: "r3", 
    title: "Literary Analysis Techniques", 
    type: "PDF", 
    url: "#", 
    subject: "English",
    recommendedFor: [60, 80]
  },
  { 
    id: "r4", 
    title: "World History Interactive Timeline", 
    type: "Interactive", 
    url: "#", 
    subject: "History",
    recommendedFor: [75, 95]
  },
]; 