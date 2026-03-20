const express = require("express");

const {applyToJob, getMyapplication,getApplicantsForJob, getApplicationById, updateStatus} = require("../controllers/application.controller")

const {protect} = require("../middlewares/auth.Middleware")

const router = express.Router();

router.post("")