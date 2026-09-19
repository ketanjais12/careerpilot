const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  jobTitle: {
    type: String,
    required: [true, 'Please add a job title']
  },
  jobDescription: {
    type: String
  },
  jobUrl: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Selected'],
    default: 'Saved'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  } ,
  analysis: {
    type: Object,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);