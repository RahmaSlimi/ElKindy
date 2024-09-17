const express = require("express");
const router = express.Router();
const multer = require('multer');
const Exam = require('../Models/Exam');

const {createExam, getExam, getAllExam, deleteExam,sendVerificationCode, updateExam, getExamsByClass,getExamsByClientGrade,getExamsByProfId} = require("../Controllers/ExamController");


  router.post("/", createExam);
  router.get("/:id", getExam);
  router.get("/", getAllExam);
  router.delete("/:id", deleteExam);
  router.put("/:id", updateExam);

  router.get("/byclass/:level", getExamsByClass);

  router.get("/:schoolGrade", getExamsByClientGrade);
  router.post('/verificationCode', sendVerificationCode)
  router.get('/exams/prof', getExamsByProfId);
  module.exports = router