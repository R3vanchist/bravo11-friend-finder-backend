import pool from '../server/database.js';

function getTeams(req, res) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        connection.query('SELECT id, teamName, useCase, captainDiscordName, gitRepoUrl, location, preferredTimeToWork, classificationLevel, preferredSkillsets FROM teams', (queryErr, results) => {
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

export default getTeams;
