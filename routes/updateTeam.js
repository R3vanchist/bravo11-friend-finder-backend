import pool from '../server/database.js';

const updateTeam = async (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        const { 
          id, 
          teamName, 
          useCase,  
          captainDiscordName, 
          gitRepoUrl, 
          location, 
          preferredTimeToWork, 
          classificationLevel, 
          preferredSkillsets, 
          image, 
          captainCode 
        } = req.body;

        // Query the teams table to retrieve the stored captainCode for the specified team
        connection.query('SELECT captainCode FROM teams WHERE id = ?', [id], (queryErr, queryResults) => {
            if (queryErr) {
                console.error('Error querying the database:', queryErr);
                connection.release();
                return res.status(500).send('Error querying the database.');
            }

            // Check if the team exists and if the provided captainCode matches the stored one
            if (queryResults.length > 0 && queryResults[0].captainCode === captainCode) {
                // Proceed with updating the team data

                const sqlQueryParts = [];
                const values = [];

                // Dynamically build the SQL query based on the provided fields
                if (teamName !== undefined) {
                    sqlQueryParts.push('teamName = ?');
                    values.push(teamName);
                }
                if (useCase !== undefined) {
                    sqlQueryParts.push('useCase = ?');
                    values.push(useCase);
                }
                if (captainDiscordName !== undefined) {
                    captainDiscordName.push('captainDiscordName = ?');
                    values.push(captainDiscordName);
                }
                if (gitRepoUrl !== undefined) {
                    sqlQueryParts.push('gitRepoUrl = ?');
                    values.push(gitRepoUrl);
                }
                if (location !== undefined) {
                    sqlQueryParts.push('location = ?');
                    values.push(location);
                }
                if (preferredTimeToWork !== undefined) {
                    sqlQueryParts.push('preferredTimeToWork = ?');
                    values.push(preferredTimeToWork);
                }
                if (classificationLevel !== undefined) {
                    sqlQueryParts.push('classificationLevel = ?');
                    values.push(classificationLevel);
                }
                if (preferredSkillsets !== undefined) {
                    sqlQueryParts.push('preferredSkillsets = ?');
                    values.push(preferredSkillsets);
                }
                if (image !== undefined) {
                    sqlQueryParts.push('image = ?');
                    values.push(image);
                }

                if (sqlQueryParts.length === 0) {
                    connection.release();
                    return res.status(400).send('No fields provided for update.');
                }

                const sqlQuery = `
                    UPDATE teams
                    SET ${sqlQueryParts.join(', ')}
                    WHERE id = ?
                `;
                values.push(id); // Add the team ID to the values array

                connection.query(sqlQuery, values, (updateErr, updateResults) => {
                    connection.release();

                    if (updateErr) {
                        console.error('Error executing SQL query:', updateErr);
                        return res.status(500).send('Error updating data in the database');
                    }

                    if (updateResults.affectedRows === 0) {
                        return res.status(404).send('Team not found.');
                    }

                    console.log('Updated data in the teams table:', updateResults);
                    return res.send('Team updated successfully.');
                });
            } else {
                // Invalid captainCode or team ID
                connection.release();
                return res.status(403).send('Unauthorized. Invalid captainCode or team ID.');
            }
        });
    });
};

export default updateTeam;
