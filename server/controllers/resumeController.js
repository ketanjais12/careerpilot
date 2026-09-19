const User = require('../models/User');
const { uploadToCloudinary, extractTextFromPDF } = require('../services/resumeService');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    
    const resumeText = await extractTextFromPDF(req.file.buffer);

    const resumeUrl = await uploadToCloudinary(req.file.buffer);


    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl, resumeText, resumeFileName: req.file.originalname },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      success: true, 
      message: 'Resume uploaded and parsed successfully.',
     data: {
  resumeUrl: updatedUser.resumeUrl,
  resumeFileName: updatedUser.resumeFileName,
  resumeText: updatedUser.resumeText,
}
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during upload' });
  }
};