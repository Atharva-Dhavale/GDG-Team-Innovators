'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { useToast } from './Toast';

interface AssignmentUploadProps {
  assignmentId: string;
  onUploadComplete?: (result: {
    score: number;
    feedback: string;
    content: string;
  }) => void;
}

export default function AssignmentUpload({ assignmentId, onUploadComplete }: AssignmentUploadProps) {
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Only accept text files
    if (!selectedFile.type.match('text/plain') && 
        !selectedFile.type.match('application/pdf') && 
        !selectedFile.name.endsWith('.doc') && 
        !selectedFile.name.endsWith('.docx')) {
      addToast('Please upload a text document (.txt, .pdf, .doc, .docx)', 'error');
      return;
    }

    setFile(selectedFile);

    // For demo purposes, we'll just extract text from .txt files
    // In a real app, you'd use libraries to extract text from various file types
    if (selectedFile.type.match('text/plain')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
      };
      reader.readAsText(selectedFile);
    } else {
      // For non-text files in this demo, we'll just use the filename as placeholder
      setFileContent(`[Content from ${selectedFile.name}]`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Only accept text files
      if (!droppedFile.type.match('text/plain') && 
          !droppedFile.type.match('application/pdf') && 
          !droppedFile.name.endsWith('.doc') && 
          !droppedFile.name.endsWith('.docx')) {
        addToast('Please upload a text document (.txt, .pdf, .doc, .docx)', 'error');
        return;
      }
      
      setFile(droppedFile);
      
      // For demo purposes, we'll just extract text from .txt files
      if (droppedFile.type.match('text/plain')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setFileContent(text);
        };
        reader.readAsText(droppedFile);
      } else {
        // For non-text files in this demo, we'll just use the filename as placeholder
        setFileContent(`[Content from ${droppedFile.name}]`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle submission
  const handleSubmit = async () => {
    // Check if there's content to submit
    const submissionContent = fileContent || content;
    
    if (!submissionContent.trim()) {
      addToast('Please enter text or upload a file', 'error');
      return;
    }

    setIsUploading(true);

    try {
      // Call the mock API
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          content: submissionContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to grade assignment');
      }

      const data = await response.json();
      
      // Call the onUploadComplete callback with the results
      if (onUploadComplete) {
        onUploadComplete({
          score: data.score,
          feedback: data.feedback,
          content: submissionContent,
        });
      }

      addToast('Assignment graded successfully!', 'success');
      
      // Reset the form
      setContent('');
      setFile(null);
      setFileContent('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error grading assignment:', error);
      addToast('Failed to grade assignment. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Submit Your Assignment</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter your work directly or upload a file
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Text area for direct input */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Your Answer
          </label>
          <textarea
            id="content"
            rows={6}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Type your answer here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!!file}
          ></textarea>
        </div>
        
        {/* File upload area */}
        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Or Upload a File</span>
          
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="space-y-1 text-center">
              {!file ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept=".txt,.pdf,.doc,.docx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">TXT, PDF, DOC up to 10MB</p>
                </>
              ) : (
                <div className="text-left w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-indigo-500 mr-2" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {fileContent && (
                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500">File Preview:</span>
                      <div className="mt-1 text-sm text-gray-700 max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                        {fileContent}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSubmit}
            disabled={isUploading || (!content && !fileContent)}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                <span>Grading...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 