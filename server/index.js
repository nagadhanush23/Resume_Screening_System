const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5015;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const analyzeRoute = require('./routes/analyze');
app.use('/api/analyze', analyzeRoute);

app.get('/', (req, res) => {
    res.send('Resume Screening API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
