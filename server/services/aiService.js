const Groq = require('groq-sdk');

// Automatically picks up GROQ_API_KEY from your environment variables
const groq = new Groq();
const MODEL_NAME = 'openai/gpt-oss-120b';
const callWithRetry = async (apiCall, maxRetries = 5) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      const status = error.status || error.statusCode;
      const isTransientError = status === 429 || (status >= 500 && status < 600);
      
      if (isTransientError && attempt < maxRetries) {
        const delay = 1500 * Math.pow(2, attempt - 1);
        console.warn(`[Groq AI] Server busy or rate limited (${status}). Retrying attempt ${attempt + 1}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

const analyzeApplicationMatch = async (resumeText, jobTitle, jobDescription) => {
  if (!resumeText || !jobTitle) {
    throw new Error('Resume text and Job Title are required for AI analysis.');
  }

  const prompt = `
    You are an expert technical recruiter and career coach.
    Analyze the provided Candidate Resume against the target Job Title and Job Description.
    Provide a highly accurate, objective evaluation strictly based on the provided text.
    Do not hallucinate skills or experiences not present in the resume.
    
    Target Job Title: ${jobTitle}
    Job Description: ${jobDescription || "No detailed description provided. Base your evaluation strictly on the job title."}
    
    Candidate Resume Text:
    ${resumeText}

    You must respond ONLY with valid JSON matching this exact structure:
    {
      "matchScore": <integer 0-100>,
      "matchedSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3", "skill4"],
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "recommendations": ["rec1", "rec2"]
    }
  `;

  try {
    const response = await callWithRetry(() => 
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: MODEL_NAME,
        response_format: { type: 'json_object' }
      })
    );

    const rawData = JSON.parse(response.choices[0].message.content);

    if (!Number.isInteger(rawData.matchScore) || rawData.matchScore < 0 || rawData.matchScore > 100) {
      throw new Error('Validation Error: matchScore must be an integer between 0 and 100.');
    }

    const arrayFields = ['matchedSkills', 'missingSkills', 'strengths', 'weaknesses', 'recommendations'];
    for (const field of arrayFields) {
      if (!Array.isArray(rawData[field])) throw new Error(`Validation Error: ${field} must be an array.`);
    }

    return rawData;
  } catch (error) {
    console.error('[AI Service Analysis Error]:', error);
    throw new Error('Failed to generate AI analysis due to an unexpected error.');
  }
};

const generateInterviewQuestions = async (resumeText, jobTitle, jobDescription, analysisData) => {
  if (!resumeText || !jobTitle || !jobDescription || !jobDescription.trim() || !analysisData) {
    throw new Error('Resume text, Job Title, Job Description, and Analysis Data are strictly required.');
  }

  const prompt = `
    You are an expert technical interviewer and hiring manager.
    Generate EXACTLY 5 custom interview questions for a candidate applying for the role of ${jobTitle}.
    
    You must generate exactly one question for each of the following 5 categories without duplication:
    1. Technical Knowledge
    2. Experience & Projects
    3. Skill Gap / Weakness
    4. Behavioral
    5. Role-Specific Requirement
    
    Use the provided Resume and Match Analysis to make the questions highly specific to this candidate. 
    For 'strategyHint', provide a concise tip on what the interviewer is looking for, but DO NOT write the answer.

    Target Job Title: ${jobTitle}
    Job Description: ${jobDescription}
    Candidate Resume Text: ${resumeText}
    Analysis - Strengths: ${analysisData.strengths.join(', ')}
    Analysis - Weaknesses/Gaps: ${analysisData.weaknesses.join(', ')} / ${analysisData.missingSkills.join(', ')}

    You must respond ONLY with valid JSON matching this exact structure:
    {
      "questions": [
        {
          "question": "The interview question targeted to the candidate",
          "category": "Exact category name from the list above",
          "strategyHint": "Hint on how to structure the answer"
        }
      ]
    }
  `;

  try {
    const response = await callWithRetry(() => 
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: MODEL_NAME,
        response_format: { type: 'json_object' }
      })
    );

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const rawQuestions = parsedResponse.questions; // Extract array from JSON object root

    if (!Array.isArray(rawQuestions) || rawQuestions.length !== 5) {
      throw new Error(`Validation Error: The AI returned invalid questions instead of exactly 5.`);
    }

    return rawQuestions;
  } catch (error) {
    console.error('[AI Service Interview Prep Error]:', error);
    throw new Error('Failed to generate interview questions due to an unexpected error.');
  }
};

const evaluateInterviewAnswer = async (question, strategyHint, userAnswer, jobTitle) => {
  if (!question || !userAnswer || !jobTitle) {
    throw new Error('Question, User Answer, and Job Title are strictly required for evaluation.');
  }

  const prompt = `
    You are an expert technical interviewer evaluating a candidate for the role of ${jobTitle}.
    
    Interview Question: ${question}
    Intended Strategy / Expected Focus: ${strategyHint || 'General evaluation'}
    Candidate's Answer: ${userAnswer}
    
    Evaluate the candidate's answer based on clarity, technical accuracy, relevance to the role, and alignment with the intended strategy.
    
    You must respond ONLY with valid JSON matching this exact structure:
    {
      "score": <integer 0-10>,
      "strengths": ["strong point 1", "strong point 2"],
      "weaknesses": ["weak point 1", "weak point 2"],
      "feedback": "Constructive feedback paragraph"
    }
  `;

  try {
    const response = await callWithRetry(() => 
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: MODEL_NAME,
        response_format: { type: 'json_object' }
      })
    );

    const rawEvaluation = JSON.parse(response.choices[0].message.content);

    if (!Number.isInteger(rawEvaluation.score) || rawEvaluation.score < 0 || rawEvaluation.score > 10) {
      throw new Error('Validation Error: score must be an integer between 0 and 10.');
    }

    return rawEvaluation;
  } catch (error) {
    console.error('[AI Service Evaluation Error]:', error);
    throw new Error('Failed to evaluate the answer due to an unexpected error.');
  }
};

module.exports = {
  analyzeApplicationMatch,
  generateInterviewQuestions,
  evaluateInterviewAnswer 
};