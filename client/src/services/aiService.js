import api from './api';

export const generateAIAnalysis = async (applicationId) => {
  const response = await api.post(`/ai/applications/${applicationId}/analyze`);
  return response.data;
};