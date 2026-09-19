import api from './api'; 
export const generateInterviewQuestions = async (applicationId) => {
  const response = await api.post('/ai/interview-questions', { applicationId });
  return response.data;
};

export const evaluateAnswer = async (interviewId, questionId, userAnswer) => {
  const response = await api.post('/ai/evaluate-answer', { 
    interviewId, 
    questionId, 
    userAnswer 
  });
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interviews');
  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
};