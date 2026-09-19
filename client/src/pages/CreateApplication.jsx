import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as applicationService from '../services/applicationService';
import ApplicationForm from '../components/ApplicationForm';

const CreateApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await applicationService.createApplication(formData);
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 'Failed to create application. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

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

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Add New Application</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 sm:text-base">
            Track a new job opportunity to keep your job search organized.
          </p>
        </div>
        
        {/* 
          We pass the state and handlers down to the Presentational Component.
          Notice we don't pass initialData, so the form will start empty.
        */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-backwards">
          <ApplicationForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            error={error} 
            onCancel={handleCancel} 
          />
        </div>

      </main>
    </div>
  );
};

export default CreateApplication;