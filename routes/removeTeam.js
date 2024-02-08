import pool from '../server/database.js';

function removeTeam(req, res) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        const { id, captainCode } = req.body; // Now also capturing the captainCode from the request body

        // First, fetch the captainCode for the team to verify it
        connection.query('SELECT captainCode FROM teams WHERE id = ?', [id], (fetchErr, results) => {
            if (fetchErr) {
                console.error('Error fetching team:', fetchErr);
                connection.release(); // Release the connection if there's an error
                return res.status(500).send('Error fetching team data.');
            }

            // Check if the team was found and the captainCode matches
            if (results.length > 0 && results[0].captainCode === captainCode) {
                // Proceed with deletion since the captainCode matches
                connection.query('DELETE FROM teams WHERE id = ?', [id], (deleteErr, deleteResults) => {
                    connection.release(); // Always release the connection back to the pool

                    if (deleteErr) {
                        console.error('Error deleting the team:', deleteErr);
                        return res.status(500).send('Error deleting the team.');
                    }

                    // Check if rows were affected to determine if the delete was successful
                    if (deleteResults.affectedRows > 0) {
                        console.log("Team has been deleted", id);
                        res.send(`Team with ID ${id} has been deleted successfully.`);
                    } else {
                        console.log("No team found with that ID", id);
                        res.status(404).send(`No team found with ID ${id}.`);
                    }
                });
            } else {
                // Either the team wasn't found, or the captainCode doesn't match
                connection.release(); // Release the connection as no further action will be taken
                res.status(403).send('Incorrect captainCode or no such team exists.');
            }
        });
    });
}

export default removeTeam;