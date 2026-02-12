const pdf = require('pdf-parse');

const extractTextFromPDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parse Error:", error);
        throw new Error("Failed to extract text from PDF");
    }
};

module.exports = { extractTextFromPDF };
