const express = require('express');
const router = express.Router();
const { analyzeJobApplication } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware'); 

router.post('/applications/:id/analyze', protect, analyzeJobApplication);

module.exports = router;