import { useState, useEffect } from 'react';
import { 
  Building2, 
  BriefcaseBusiness, 
  Activity, 
  CalendarDays, 
  MapPin, 
  Link as LinkIcon, 
  AlignLeft, 
  StickyNote, 
  AlertCircle, 
  Loader2, 
  ChevronDown
} from 'lucide-react';

const ApplicationForm = ({ 
  initialData = null, 
  onSubmit, 
  isLoading = false, 
  error = null, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    jobDescription: '',
    jobUrl: '',
    location: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        jobDescription: initialData.jobDescription || '',
        jobUrl: initialData.jobUrl || '',
        location: initialData.location || '',
        status: initialData.status || 'Applied',
        applicationDate: initialData.applicationDate 
          ? initialData.applicationDate.split('T')[0] 
          : new Date().toISOString().split('T')[0],
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputBaseClasses = "block w-full rounded-xl border border-zinc-800/80 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-600 transition-all focus:border-lime-400/50 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-lime-400/50";
  const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500";

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-lime-400/[0.03] blur-3xl" />

      {error && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-400 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
        
        {/* Company */}
        <div className="group">
          <label htmlFor="company" className={labelClasses}>Company *</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Building2 className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
            </div>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className={inputBaseClasses}
              placeholder="e.g. TechCorp"
            />
          </div>
        </div>

        {/* Job Title */}
        <div className="group">
          <label htmlFor="jobTitle" className={labelClasses}>Job Title *</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <BriefcaseBusiness className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              className={inputBaseClasses}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
        </div>

        {/* Status */}
        <div className="group">
          <label htmlFor="status" className={labelClasses}>Status</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 z-10">
              <Activity className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputBaseClasses} appearance-none cursor-pointer`}
            >
              <option value="Saved" className="bg-zinc-900 text-zinc-200">Saved</option>
              <option value="Applied" className="bg-zinc-900 text-zinc-200">Applied</option>
              <option value="Assessment" className="bg-zinc-900 text-zinc-200">Assessment</option>
              <option value="Interview" className="bg-zinc-900 text-zinc-200">Interview</option>
              <option value="Selected" className="bg-zinc-900 text-zinc-200">Selected</option>
              <option value="Rejected" className="bg-zinc-900 text-zinc-200">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Application Date */}
        <div className="group">
          <label htmlFor="applicationDate" className={labelClasses}>Application Date *</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <CalendarDays className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
            </div>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              required
              value={formData.applicationDate}
              onChange={handleChange}
              /* [color-scheme:dark] ensures the native browser calendar icon/picker is dark mode */
              className={`${inputBaseClasses} [color-scheme:dark]`}
            />
          </div>
        </div>

        {/* Location */}
        <div className="group">
          <label htmlFor="location" className={labelClasses}>Location</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MapPin className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputBaseClasses}
              placeholder="e.g. Remote, Hybrid, New York"
            />
          </div>
        </div>

        {/* Job URL */}
        <div className="group">
          <label htmlFor="jobUrl" className={labelClasses}>Job Posting URL</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <LinkIcon className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
            </div>
            <input
              type="url"
              id="jobUrl"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className={inputBaseClasses}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="group relative z-10 mb-6">
        <label htmlFor="jobDescription" className={labelClasses}>Job Description</label>
        <div className="relative">
          <div className="pointer-events-none absolute top-3.5 left-0 flex items-center pl-3.5">
            <AlignLeft className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
          </div>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows="4"
            value={formData.jobDescription}
            onChange={handleChange}
            className={`${inputBaseClasses} pl-11 resize-y`}
            placeholder="Paste key responsibilities or requirements here..."
          />
        </div>
      </div>

      {/* Personal Notes */}
      <div className="group relative z-10 mb-10">
        <label htmlFor="notes" className={labelClasses}>Personal Notes</label>
        <div className="relative">
          <div className="pointer-events-none absolute top-3.5 left-0 flex items-center pl-3.5">
            <StickyNote className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-lime-400" />
          </div>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className={`${inputBaseClasses} pl-11 resize-y`}
            placeholder="Interview prep, recruiter name, salary expectations, etc."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col-reverse items-center justify-end gap-3 border-t border-zinc-800/80 pt-6 sm:flex-row sm:gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full rounded-xl border border-zinc-800 bg-transparent px-6 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white disabled:opacity-50 disabled:pointer-events-none sm:w-auto"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(163,230,53,0.12)] transition-all duration-200 hover:bg-lime-300 hover:shadow-[0_0_35px_rgba(163,230,53,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Application'
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;