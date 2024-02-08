import pool from '../server/database.js';

function removeUseCase(req, res) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        const { id, useCaseCode } = req.body; // Correctly capture the use-case ID and useCaseCode from the request body

        if (!useCaseCode) {
            connection.release();
            return res.status(400).send('Use-Case code is required');
        }

        const getCodeQuery = `SELECT * FROM usecases WHERE id = ?`;

        connection.query(getCodeQuery, [id], (codeError, codeResults) => {
            if (codeError) {
                console.error('Error fetching use case code: ', codeError);
                connection.release();
                return res.status(500).send('Error fetching use case code');
            }

            if (codeResults.length === 0 || codeResults[0].useCaseCode != useCaseCode) {
                connection.release();
                return res.status(403).send('Invalid use case code');
            }

            // Correct the usage of parameters in the query method
            connection.query('DELETE FROM usecases WHERE id = ?', [id], (queryErr, results) => {
                connection.release(); // Always release the connection back to the pool

                if (queryErr) {
                    console.error('Error querying the database:', queryErr);
                    return res.status(500).send('Error querying the database');
                }

                // Check if rows were affected to determine if the delete was successful
                if (results.affectedRows > 0) {
                    console.log("Use-Case has been deleted", id);
                    res.send(`Use-Case with ID ${id} has been deleted successfully.`);
                } else {
                    console.log("No Use-Case found with that ID", id);
                    res.status(404).send(`No team found with ID ${id}.`);
                }
            });
        });
    });
}

export default removeUseCase;
