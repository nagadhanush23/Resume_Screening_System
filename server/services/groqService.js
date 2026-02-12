const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const analyzeResume = async (resumeText, jobDescription) => {
    try {
        const prompt = `
        You are an expert AI Resume Screener. Your task is to analyze the provided Resume Text against the Job Description.
        
        Job Description:
        "${jobDescription}"

        Resume Text:
        "${resumeText}"

        Provide a strict JSON response with the following structure:
        {
            "matchScore": <number between 0-100>,
            "classification": "<Highly Suitable | Moderate | Low Suitability>",
            "summary": "<Brief summary of why this candidate fits or doesnt fit>",
            "keywordMatches": [
                { "keyword": "<Skill/Keyword from JD>", "found": <true/false>, "importance": "<high/medium/low>" }
            ],
            "interviewQuestions": {
                "level1": ["<Basic Question 1>", "<Basic Question 2>"],
                "level2": ["<Intermediate Question 1>", "<Intermediate Question 2>"],
                "level3": ["<Advanced Question 1>", "<Advanced Question 2>"],
                "dsa": [
                    { "difficulty": "Easy", "question": "<DSA Question>" },
                    { "difficulty": "Medium/Hard", "question": "<DSA Question>" }
                ]
            }
        }
        
        Do not include any markdown formatting (like \`\`\`json). Return ONLY the raw JSON string.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile', // Updated to user preference
            temperature: 0.2, // Low temperature for consistent JSON
        });

        const content = chatCompletion.choices[0]?.message?.content || '{}';

        // Clean up markdown code blocks if present, just in case
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanContent);

    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to analyze resume with AI");
    }
};

module.exports = { analyzeResume };
