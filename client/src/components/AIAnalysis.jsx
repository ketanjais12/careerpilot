import { useState } from 'react';
import { generateAIAnalysis } from '../services/aiService';

const AIAnalysis = ({ applicationId, existingAnalysis }) => {
  const [analysis, setAnalysis] = useState(existingAnalysis || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateAIAnalysis(applicationId);
      setAnalysis(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to generate AI insights. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]';
    if (score >= 60) return 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]';
    return 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]';
  };

  if (!analysis) {
    return (
      <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0b0b0b] p-6 text-center shadow-2xl sm:p-8">
        
        {/* Subtle AI Glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime-400/[0.05] blur-3xl transition-all duration-500 group-hover:bg-lime-400/[0.08]" />
        
        <div className="relative z-10">
          <h2 className="mb-2 text-xl font-semibold text-white">AI Application Analysis</h2>
          
          <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-zinc-400">
            Compare your resume against this job description to reveal your match score, missing skills, and strengths.
          </p>
          
          {error && (
            <div className="mx-auto mb-6 max-w-sm rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
              {error}
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(163,230,53,0.12)] transition-all duration-200 hover:bg-lime-300 hover:shadow-[0_0_35px_rgba(163,230,53,0.2)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Analyzing Application (takes ~5 seconds)...' : '✨ Generate AI Insights'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8">
      
      <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-lime-400/[0.03] blur-3xl" />
      
      <div className="relative z-10">
        {/* Show error here if a RE-EVALUATION fails */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-400">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-6 border-b border-zinc-800/80 pb-6 md:flex-row md:items-center md:justify-between">
          
          {/* Title and Re-evaluate Button */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold text-white">✨ AI Match Analysis</h2>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="text-sm font-medium text-lime-400 underline underline-offset-4 transition-colors hover:text-lime-300 disabled:text-zinc-600"
            >
              {loading ? 'Re-analyzing...' : '↻ Re-evaluate with latest Resume'}
            </button>
          </div>

          {/* Score Display */}
          <div className="text-left md:text-right">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Match Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(analysis.matchScore)}`}>
              {analysis.matchScore}%
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Matched Skills */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <span className="text-emerald-400">✓</span> Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedSkills.length > 0 ? (
                analysis.matchedSkills.map((skill, index) => (
                  <span key={index} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-500">No exact matches found.</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <span className="text-rose-400">⚠</span> Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.length > 0 ? (
                analysis.missingSkills.map((skill, index) => (
                  <span key={index} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-400">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-500">No critical missing skills identified!</span>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Strengths</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-400 marker:text-zinc-600">
              {analysis.strengths.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Potential Weaknesses</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-400 marker:text-zinc-600">
              {analysis.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="mb-3 font-semibold text-white">Actionable Recommendations</h3>
          <ul className="list-disc space-y-2 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-5 pl-8 text-sm leading-relaxed text-sky-200 marker:text-sky-400">
            {analysis.recommendations.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;