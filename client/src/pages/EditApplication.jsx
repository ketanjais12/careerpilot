import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as applicationService from '../services/applicationService';
import ApplicationForm from '../components/ApplicationForm';
import AIAnalysis from '../components/AIAnalysis';
import PracticeInterviewButton from '../components/PracticeInterviewButton';
import { Loader2, AlertCircle } from 'lucide-react';

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await applicationService.getApplication(id);
        setApplication(data.data);
      } catch (err) {
        setFetchError(
          err.response?.data?.message ||
            'Failed to load application data. It may have been deleted.'
        );
      } finally {
        setIsFetching(false);
      }
    };

    loadApplication();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await applicationService.updateApplication(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          'Failed to update application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
          <p className="text-zinc-400 text-lg font-medium">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center py-8 px-4">
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl max-w-md w-full text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
          <p className="text-rose-400 font-medium">{fetchError}</p>
          <button
            onClick={handleCancel}
            className="mt-6 text-sm font-medium text-rose-400 hover:text-rose-300 underline transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

      <main className="relative z-10 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold text-white">
            Edit Application
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Update your application status and notes for{' '}
            <span className="font-semibold text-white">
              {application?.company}
            </span>
            .
          </p>
        </div>

        {/* Existing CRUD Form */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-backwards">
          <ApplicationForm
            initialData={application}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            error={submitError}
            onCancel={handleCancel}
          />
        </div>

        {/* AI Analysis Integration */}
        <div className="mt-12 border-t border-zinc-800/80 pt-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
          <AIAnalysis
            applicationId={application._id}
            existingAnalysis={application.analysis}
          />
        </div>

        {/* Interview Practice */}
        <div className="mt-12 border-t border-zinc-800/80 pt-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-backwards">
          <PracticeInterviewButton application={application} />
        </div>
      </main>
    </div>
  );
};

export default EditApplication;