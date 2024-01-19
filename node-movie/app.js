require('dotenv').config();
const express = require('express');
const userRoute = require('./routes/user');
const cors = require('cors');

const app = express();

// Setting middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Setting routes
app.use('/user', userRoute);

// Export the app for testing
module.exports = app;

// Start server only if running this file directly (not when imported via require)
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, function () {
        console.log('Server running on port ' + PORT);
    });
}