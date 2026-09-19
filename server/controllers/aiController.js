const Application = require('../models/Application');
const User = require('../models/User');
const { analyzeApplicationMatch } = require('../services/aiService');

exports.analyzeJobApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.resumeText) {
      return res.status(400).json({ 
        success: false, 
        message: 'No resume found. Please upload a PDF resume in the dashboard first.' 
      });
    }

    const analysisResult = await analyzeApplicationMatch(
      user.resumeText,
      application.jobTitle,
      application.jobDescription
    );

    application.analysis = analysisResult;
    await application.save();

    res.status(200).json({ success: true, data: application.analysis });

  } catch (error) {
    console.error('[AI Controller Error]:', error);
    
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to process AI analysis.' 
    });
  }
};