const mongoose = require('mongoose');

// ── Sub-schemas ──────────────────────────────────────────────────
const experienceSchema = new mongoose.Schema({
  company:     { type: String, required: true },
  role:        { type: String, required: true },
  location:    { type: String, default: '' },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: 'Present' },
  current:     { type: Boolean, default: false },
  description: { type: String, default: '' },
}, { _id: true });

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree:      { type: String, required: true },
  field:       { type: String, default: '' },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: '' },
  grade:       { type: String, default: '' },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  techStack:   [String],
  liveUrl:     { type: String, default: '' },
  githubUrl:   { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: true });

const certificationSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  issuer:       { type: String, default: '' },
  issueDate:    { type: String, default: '' },
  expiryDate:   { type: String, default: '' },
  credentialUrl:{ type: String, default: '' },
}, { _id: true });

// ── Main Resume Schema ───────────────────────────────────────────
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'My Resume',
    },
    template: {
      type: String,
      enum: ['minimal', 'corporate', 'modern', 'creative', 'dark'],
      default: 'minimal',
    },
    personal: {
      fullName:    { type: String, default: '' },
      email:       { type: String, default: '' },
      phone:       { type: String, default: '' },
      location:    { type: String, default: '' },
      linkedin:    { type: String, default: '' },
      github:      { type: String, default: '' },
      portfolio:   { type: String, default: '' },
      summary:     { type: String, default: '' },
    },
    experience:     [experienceSchema],
    education:      [educationSchema],
    skills:         [String],
    projects:       [projectSchema],
    certifications: [certificationSchema],
    languages:      [String],
    achievements:   [String],

    atsScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    atsHistory: [
      {
        score:     Number,
        checkedAt: { type: Date, default: Date.now },
      },
    ],
    shareableSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);