import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateInterviewQuestions } from '../services/interviewService';

const PracticeInterviewButton = ({ application }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!application.jobDescription || !application.jobDescription.trim()) {
      setError("A Job Description is required to generate questions.");
      return;
    }
    if (!application.analysis) {
      setError("Please run the AI Match Analysis on this application first.");
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await generateInterviewQuestions(application._id);
      
      const newInterviewId = response.data._id;
      navigate(`/interview/${newInterviewId}`);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(163,230,53,0.12)] transition-all duration-200 hover:bg-lime-300 hover:shadow-[0_0_35px_rgba(163,230,53,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none sm:w-auto"      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Questions...
          </>
        ) : (
          'Practice Interview'
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
    </div>
  );
};

export default PracticeInterviewButton;