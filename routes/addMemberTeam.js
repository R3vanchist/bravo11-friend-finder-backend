import pool from '../server/database.js';

const addMemberTeam = async (req, res) => {
    const { 
        name, 
        discordName, 
        skillset, 
        teamId 
    } = req.body;

    try {
        // Add the new member to the 'members' table
        const insertMemberQuery = `
            INSERT INTO members (name, discordName, skillsets, teamId)
            VALUES (?, ?, ?, ?)
        `;
        
        await new Promise((resolve, reject) => {
            pool.query(insertMemberQuery, [name, discordName, skillset, teamId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        // Update the 'team_members' table to associate the member with the team
        const updateTeamMembersQuery = `
            INSERT INTO team_members (teamId, memberId)
            VALUES (?, LAST_INSERT_ID())
        `;

        await new Promise((resolve, reject) => {
            pool.query(updateTeamMembersQuery, [teamId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        res.json({ success: true, message: "Member added successfully." });
    } catch (error) {
        console.error("Error adding new member:", error);
        res.status(500).json({ message: "Error adding new member", error: error.message });
    }
};

export default addMemberTeam;