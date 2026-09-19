const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  score: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  feedback: {
    type: String,
    required: true
  }
}, { _id: false }); 

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technical Knowledge', 
      'Experience & Projects', 
      'Skill Gap / Weakness', 
      'Behavioral', 
      'Role-Specific Requirement'
    ]
  },
  strategyHint: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: null 
  },
  evaluation: {
    type: evaluationSchema,
    default: null 
  }
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(val) {
        return val.length === 5;
      },
      message: 'An interview must contain exactly 5 questions.'
    }
  },
  overallScore: {
    type: Number,
    default: null
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Interview', interviewSchema);