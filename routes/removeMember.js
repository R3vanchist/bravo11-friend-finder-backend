import pool from '../server/database.js';

const deleteMemberFromTeam = async (req, res) => {
    const { memberId, teamId, captainCode } = req.body;

    try {
        // Check if the provided captainCode matches the captainCode stored in the teams table
        const checkCaptainCodeQuery = `
            SELECT captainCode
            FROM teams
            WHERE id = ?;
        `;

        const captainCodeResult = await new Promise((resolve, reject) => {
            pool.query(checkCaptainCodeQuery, [teamId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (captainCodeResult.length === 0 || captainCodeResult[0].captainCode !== captainCode) {
            return res.status(403).json({ message: "Incorrect captainCode or no such team exists." });
        }

        // Delete the member from the 'members' table
        const deleteMemberQuery = `
            DELETE FROM members 
            WHERE id = ? AND teamId = ?
        `;

        await new Promise((resolve, reject) => {
            pool.query(deleteMemberQuery, [memberId, teamId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        // Delete the association from the 'team_members' table
        const deleteTeamMemberQuery = `
            DELETE FROM team_members 
            WHERE memberId = ? AND teamId = ?
        `;

        await new Promise((resolve, reject) => {
            pool.query(deleteTeamMemberQuery, [memberId, teamId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        res.json({ success: true, message: "Member deleted successfully." });
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({ message: "Error deleting member", error: error.message });
    }
};

export default deleteMemberFromTeam;
