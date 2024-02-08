import pool from '../server/database.js';

const signUpForUseCase = async (req, res) => {
    const { captainCode, useCaseTitle } = req.body;

    // Validate captainCode
    const validateCaptainCodeQuery = 'SELECT id, teamName FROM teams WHERE captainCode = ?';
    pool.query(validateCaptainCodeQuery, [captainCode], (error, results) => {
        if (error) {
            console.error('Error validating captain code:', error);
            return res.status(500).send('Error validating captain code');
        }

        if (results.length === 0) {
            return res.status(404).send('Team not found with provided captain code');
        }

        const teamId = results[0].id;
        const teamName = results[0].team;

        // Update teamId in usecases table
        const updateUseCaseQuery = 'UPDATE usecases SET teamId = ? WHERE title = ?';
        pool.query(updateUseCaseQuery, [teamId, useCaseTitle], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error updating usecase:', updateError);
                return res.status(500).send('Error updating usecase');
            }

            if (updateResults.affectedRows === 0) {
                return res.status(404).send('Use case not found with provided title');
            }

            // Update useCase column in teams table
            const updateTeamQuery = 'UPDATE teams SET useCase = ? WHERE id = ?';
            pool.query(updateTeamQuery, [useCaseTitle, teamId], (teamUpdateError, teamUpdateResults) => {
                if (teamUpdateError) {
                    console.error('Error updating team:', teamUpdateError);
                    return res.status(500).send('Error updating team');
                }

                console.log('Use case signed up successfully');
                res.send(`Use case "${useCaseTitle}" signed up successfully for team "${teamName}"`);
            });
        });
    });
};

export default signUpForUseCase;
