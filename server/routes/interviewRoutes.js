const express = require('express');
const router = express.Router();
const { 
  createInterviewSession, 
  getInterviews, 
  getInterviewById ,
  evaluateAnswer
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');


router.post('/ai/interview-questions', protect, createInterviewSession);
router.post('/ai/evaluate-answer', protect, evaluateAnswer);
router.get('/interviews', protect, getInterviews);
router.get('/interviews/:id', protect, getInterviewById);

module.exports = router;