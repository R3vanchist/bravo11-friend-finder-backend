import pool from '../server/database.js';

function getUseCases(req, res) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        connection.query('SELECT id, title, pocName, pocDiscordName, company, desiredDeliverable, hasData, desiredSkillsets, description, classificationLevel, location, teamId FROM usecases', (queryErr, results) => {
            // Always release the connection back to the pool
            connection.release();

            if (queryErr) {
                console.error('Error querying the database:', queryErr);
                return res.status(500).send('Error querying the database');
            }

            // Send the query results back to the client
            console.log(results)
            res.json(results);
        });
    });
}

export default getUseCases;
