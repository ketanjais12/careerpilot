import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterviewById, evaluateAnswer } from '../services/interviewService';
import { Loader2 } from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [evaluating, setEvaluating] = useState(false);

 useEffect(() => {
    const fetchInterview = async () => {
      try {
        const data = await getInterviewById(id);
        
        // ADD THIS LINE to actually update the state!
        // (Note: If you are using Axios, you might need to use 'data.data' depending on how your service is set up)
        setInterview(data.data || data); 

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load interview session.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  useEffect(() => {
    if (interview && interview.questions[currentQuestionIndex]) {
      setAnswerText(interview.questions[currentQuestionIndex].answer || '');
    }
  }, [currentQuestionIndex, interview]);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    
    setEvaluating(true);
    setError('');
    const questionId = interview.questions[currentQuestionIndex]._id;

    try {
      const result = await evaluateAnswer(interview._id, questionId, answerText);
      
      setInterview((prev) => {
        const updatedQuestions = prev.questions.map((q) => 
          q._id === result.data.questionId 
            ? { ...q, answer: answerText, evaluation: result.data.evaluation } 
            : q
        );
        return { 
          ...prev, 
          questions: updatedQuestions, 
          overallScore: result.data.overallScore !== undefined ? result.data.overallScore : prev.overallScore 
        };
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        <div className="text-zinc-400 text-lg font-medium">Loading interview session...</div>
      </div>
    </div>
  );
  
  if (error && !interview) return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center">
      <div className="p-8 text-center text-rose-400">{error}</div>
    </div>
  );
  
  if (!interview) return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center">
      <div className="p-8 text-center text-zinc-400">Interview not found.</div>
    </div>
  );

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isAnswered = !!currentQuestion.evaluation;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-lime-400/30 overflow-x-hidden">
      
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-lime-400/[0.035] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 sm:py-10">
        
        {/* Header & Overall Score */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Practice Interview</h1>
            <p className="text-zinc-400 text-sm sm:text-base">Role: <span className="font-semibold text-zinc-200">{interview.applicationId?.jobTitle}</span></p>
          </div>
          {interview.overallScore !== null && (
            <div className="bg-lime-400/10 border border-lime-400/20 text-lime-400 px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide">
              Overall Score: {interview.overallScore} / 10
            </div>
          )}
        </div>

        {/* Question Navigation Tabs */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 scrollbar-hide animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-backwards">
          {interview.questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                currentQuestionIndex === idx
                  ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                  : q.evaluation 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              Q{idx + 1}: {q.category.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Question Card */}
        <div className="relative overflow-hidden bg-[#0b0b0b] rounded-3xl shadow-2xl border border-zinc-800/80 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
          
          <div className="mb-6">
            <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] px-2.5 py-1 rounded-md uppercase tracking-[0.1em] font-semibold mb-3">
              {currentQuestion.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">{currentQuestion.question}</h2>
          </div>

          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-200/90 rounded-r-xl">
            <span className="font-bold text-amber-400">Strategy Hint: </span>{currentQuestion.strategyHint}
          </div>

          {error && <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-400">{error}</div>}

          {/* Answer Input Area */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Your Answer</label>
            <textarea
              rows="6"
              className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:ring-1 focus:ring-lime-400/50 focus:border-lime-400/50 focus:bg-zinc-900 focus:outline-none disabled:bg-zinc-900/30 disabled:text-zinc-500 disabled:border-zinc-800/50 transition-all resize-y"
              placeholder="Type your answer here..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={isAnswered || evaluating}
            />
          </div>

          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={evaluating || !answerText.trim()}
              className="w-full bg-lime-400 hover:bg-lime-300 text-black font-semibold py-3.5 px-4 rounded-xl disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 shadow-[0_0_30px_rgba(163,230,53,0.12)] hover:shadow-[0_0_35px_rgba(163,230,53,0.2)] active:scale-[0.98]"
            >
              {evaluating ? 'Analyzing your answer...' : 'Submit Answer for Evaluation'}
            </button>
          ) : (
            /* Evaluation Results Area */
            <div className="mt-8 border-t pt-8 border-zinc-800/80">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">AI Evaluation</h3>
                <span className={`text-sm font-black px-3 py-1.5 rounded-lg border tracking-wide ${
                  currentQuestion.evaluation.score >= 7 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  currentQuestion.evaluation.score >= 4 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  Score: {currentQuestion.evaluation.score} / 10
                </span>
              </div>
              
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/80">
                <span className="font-semibold block mb-2 text-zinc-100">Feedback:</span>
                {currentQuestion.evaluation.feedback}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                  <h4 className="font-bold text-emerald-400 mb-3 uppercase tracking-wider text-xs">Strengths</h4>
                  <ul className="list-disc pl-5 text-emerald-200/80 space-y-2 marker:text-emerald-500/50">
                    {currentQuestion.evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl">
                  <h4 className="font-bold text-rose-400 mb-3 uppercase tracking-wider text-xs">Areas to Improve</h4>
                  <ul className="list-disc pl-5 text-rose-200/80 space-y-2 marker:text-rose-500/50">
                    {currentQuestion.evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Navigation */}
        <div className="mt-8 flex justify-between items-center px-2 animate-in fade-in duration-700 delay-500">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-zinc-500 hover:text-lime-400 font-medium transition-colors text-sm"
          >
            &larr; Back to Dashboard
          </button>
          {currentQuestionIndex < 4 && isAnswered && (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="text-lime-400 hover:text-lime-300 font-semibold transition-colors text-sm"
            >
              Next Question &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;