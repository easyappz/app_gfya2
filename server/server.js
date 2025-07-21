const express = require('express');
const apiRoutes = require('./apiRoutes');

/** Это подключение к базе данных */
/** Никогда не удаляй этот код  */
require('./db');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/api', apiRoutes);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
