import pool from '../server/database.js';

function getNoTeamUseCase(req, res) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        connection.query("SELECT DISTINCT teams.id, teams.teamName, teams.useCase, teams.captainDiscordName, teams.gitRepoUrl, teams.location, teams.preferredTimeToWork,teams.classificationLevel, teams.preferredSkillsets FROM teams LEFT JOIN members ON teams.id = members.teamId AND teams.captainDiscordName <> members.discordName WHERE teams.id NOT IN (SELECT teams.id FROM teams JOIN members ON teams.id = members.teamId WHERE teams.captainDiscordName = members.discordName) AND (members.teamId IS NULL OR members.teamId = '')", (queryErr, results) => {
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

export default getNoTeamUseCase;
