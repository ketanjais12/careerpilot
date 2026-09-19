const Application = require('../models/Application');
const User = require('../models/User');
const Interview = require('../models/Interview');
const { generateInterviewQuestions, evaluateInterviewAnswer } = require('../services/aiService');
// @desc    Generate 5 custom interview questions for an application
// @route   POST /api/ai/interview-questions
exports.createInterviewSession = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ success: false, message: 'applicationId is required.' });
    }

    // 1. Verify the application exists and belongs to the authenticated user
    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user.id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });
    }

    // 2. Enforce strict data requirements for generating a quality interview
    if (!application.jobDescription || !application.jobDescription.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'A detailed Job Description is required to generate interview questions. Please edit your application to add one.' 
      });
    }

    if (!application.analysis) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please generate the AI Match Analysis for this application first.' 
      });
    }

    // 3. Find the user's current resume
    const user = await User.findById(req.user.id);
    if (!user || !user.resumeText) {
      return res.status(400).json({ 
        success: false, 
        message: 'No resume found. Please upload a PDF resume in the dashboard first.' 
      });
    }

    // 4. Call the AI Service with the combined context
    const generatedQuestions = await generateInterviewQuestions(
      user.resumeText,
      application.jobTitle,
      application.jobDescription,
      application.analysis
    );

    // 5. Create and save the new Interview document
    const newInterview = new Interview({
      userId: req.user.id,
      applicationId: application._id,
      questions: generatedQuestions
    });

    await newInterview.save();

    // 6. Return the created interview session
    res.status(201).json({ 
      success: true, 
      data: newInterview 
    });

  } catch (error) {
    console.error('[Interview Controller Error]:', error);
    
    // Send back the safe, granular error messages thrown by aiService
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to generate interview questions.' 
    });
  }
};

// @desc    Get all interview sessions for the logged-in user
// @route   GET /api/interviews
exports.getInterviews = async (req, res) => {
  try {
    // Fetch interviews and populate the application details (company, jobTitle) for the UI
    const interviews = await Interview.find({ userId: req.user.id })
      .populate('applicationId', 'company jobTitle status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    console.error('[Interview Controller Error]:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get a single interview session by ID
// @route   GET /api/interviews/:id
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id // Strict ownership check
    }).populate('applicationId', 'company jobTitle jobDescription');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('[Interview Controller Error]:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}; 

exports.evaluateAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, userAnswer } = req.body;

    if (!interviewId || !questionId || !userAnswer) {
      return res.status(400).json({ success: false, message: 'interviewId, questionId, and userAnswer are required.' });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.user.id
    }).populate('applicationId', 'jobTitle');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found or unauthorized.' });
    }

    const question = interview.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found in this interview session.' });
    }

    const evaluation = await evaluateInterviewAnswer(
      question.question,
      question.strategyHint,
      userAnswer,
      interview.applicationId.jobTitle
    );

    question.answer = userAnswer;
    question.evaluation = evaluation;

    const allAnswered = interview.questions.every(q => q.evaluation !== null);
    if (allAnswered) {
      const totalScore = interview.questions.reduce((sum, q) => sum + q.evaluation.score, 0);
      interview.overallScore = parseFloat((totalScore / interview.questions.length).toFixed(1));
    }

    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        questionId: question._id,
        evaluation: question.evaluation,
        overallScore: interview.overallScore 
      }
    });

  } catch (error) {
    console.error('[Interview Evaluation Error]:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to evaluate answer.' 
    });
  }
};