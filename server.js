import express from 'express';
import cors from 'cors';
import routes from './routes/index.js'; // Importing aggregated routes

const app = express();
const port = 3000;

// Apply general middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // For enabling CORS

// Use the aggregated routes from the routes module
app.use('/', routes);

// General error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});