const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractTextFromPDF } = require('../services/pdfService');
const { analyzeResume } = require('../services/groqService');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        console.log(`Processing resume: ${file.originalname}`);

        // 1. Extract Text
        let resumeText = '';
        if (file.mimetype === 'application/pdf') {
            resumeText = await extractTextFromPDF(file.buffer);
        } else {
            // For now, only PDF is supported for text extraction
            // We could add docx support later or just treat as text if plain text
            return res.status(400).json({ error: 'Only PDF files are supported at this time.' });
        }

        // 2. Analyze with Groq
        const analysisResult = await analyzeResume(resumeText, jobDescription);

        // 3. Return Result
        res.json({
            id: Date.now(),
            fileName: file.originalname,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            extractedText: resumeText.substring(0, 500) + "...", // Snippet
            ...analysisResult
        });

    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
