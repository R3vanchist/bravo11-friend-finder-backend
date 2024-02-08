import pool from '../server/database.js';

const updateUseCase = async (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).send('Error connecting to the database');
        }

        // Assuming the data is sent directly in the body without nesting under params.use_case_object
        const { 
            id, 
            title, 
            pocName, 
            pocDiscordName, 
            company, 
            desiredDeliverable, 
            hasData, 
            desiredSkillsets, 
            classificationLevel, 
            location, 
            image,
            useCaseCode
        } = req.body;

        if (!useCaseCode) {
            connection.release();
            return res.status(400).send('Use-Case code is required');
        }

        const getCodeQuery = `SELECT * FROM usecases WHERE useCaseCode = ?`;
        
        connection.query(getCodeQuery, [useCaseCode], (codeError, codeResults) => {
            if (codeError) {
                console.error('Error fetching use case code: ', codeError);
                connection.release();
                return res.status(500).send('Error fetching use case code');
            }

            if (codeResults.length === 0 || codeResults[0].id != id) {
                connection.release();
                return res.status(403).send('Invalid use case code');
            }

            // Prepare SQL query parts and values dynamically
            const updates = [];
            const values = [];

            if (title !== undefined) {
                updates.push("title = ?");
                values.push(title);
            }
            if (pocName !== undefined) {
                updates.push("pocName = ?");
                values.push(pocName);
            }
            if (pocDiscordName !== undefined) {
                updates.push("pocDiscordName = ?");
                values.push(pocDiscordName);
            }
            if (company !== undefined) {
                updates.push("company = ?");
                values.push(company);
            }
            if (desiredDeliverable !== undefined) {
                updates.push("desiredDeliverable = ?");
                values.push(desiredDeliverable);
            }
            if (hasData !== undefined) {
                updates.push("hasData = ?");
                values.push(hasData);
            }
            if (desiredSkillsets !== undefined) {
                updates.push("desiredSkillsets = ?");
                values.push(desiredSkillsets);
            }
            if (classificationLevel !== undefined) {
                updates.push("classificationLevel = ?");
                values.push(classificationLevel);
            }
            if (location !== undefined) {
                updates.push("location = ?");
                values.push(location);
            }
            if (image !== undefined) {
                updates.push("image = ?");
                values.push(image);
            }

            // Ensure there's something to update
            if (updates.length === 0) {
                connection.release();
                return res.status(400).send("No fields provided for update.");
            }

            values.push(id); // For WHERE clause

            const sqlQuery = `
                UPDATE useCases
                SET ${updates.join(", ")}
                WHERE id = ?
            `;

            connection.query(sqlQuery, values, (error, results) => {
                // Release the connection back to the pool
                connection.release();

                if (error) {
                    console.error('Error executing SQL query:', error);
                    return res.status(500).send('Error updating data in the database');
                }

                if (results.affectedRows === 0) {
                    // If no rows were affected, it means no record was found with the given ID
                    return res.status(404).send('Use case not found.');
                }

                console.log('Updated data in the use-case table:', results);
                return res.send('Use case updated successfully.');
            });
        });
    });
};

export default updateUseCase;
