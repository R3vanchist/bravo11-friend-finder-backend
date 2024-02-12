import pool from '../server/database.js';

const addTeam = async (req, res) => {
  // Extract team data from request body
  const {
    teamName,
    useCase,
    captainDiscordName,
    captainCode,
    gitRepoUrl,
    location,
    preferredTimeToWork,
    classificationLevel,
    preferredSkillsets,
    image
  } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting a database connection:', err);
      return res.status(500).send('Error connecting to the database');
    }

    // Construct SQL query to insert a new team
    const teamQuery = `
      INSERT INTO teams (
        teamName, 
        useCase, 
        captainDiscordName, 
        captainCode, 
        gitRepoUrl, 
        location, 
        preferredTimeToWork, 
        classificationLevel, 
        preferredSkills, 
        image 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const teamValues = [
      teamName,
      useCase,
      captainDiscordName,
      captainCode,
      gitRepoUrl,
      location,
      preferredTimeToWork,
      classificationLevel,
      preferredSkillsets,
      image
    ];

    connection.query(teamQuery, teamValues, (error, teamResults) => {
      if (error) {
        console.error('Error inserting team data:', error);
        // Release the connection back to the pool
        connection.release();
        return res.status(500).send('Error inserting team data into the database');
      }

      console.log('Inserted data into the teams table:', teamResults);

      // Retrieve the auto-generated primary key ID of the newly inserted team
      const teamId = teamResults.insertId;

      // Extract captain data from request body
      const { captainName, captainSkillset } = req.body;

      // Construct SQL query to insert the captain as a member
      const insertCaptainMemberQuery = `
        INSERT INTO members (name, discordName, skillsets, teamId)
        VALUES (?, ?, ?, ?)
      `;

      // Insert the captain as a member into the members table
      connection.query(insertCaptainMemberQuery, [captainName, captainDiscordName, captainSkillset, teamId], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error inserting captain member data:', insertError);
          // Release the connection back to the pool
          connection.release();
          return res.status(500).send('Error inserting captain member data into the database');
        }

        console.log('Inserted data into the members table:', insertResults);

        // Construct SQL query to insert teamId into team_members table
        const insertTeamMemberQuery = `
          INSERT INTO team_members (teamId, memberId)
          VALUES (?, ?)
        `;

        // Retrieve the auto-generated primary key ID of the newly inserted captain
        const memberId = insertResults.insertId;

        // Insert the teamId and memberId into the team_members table
        connection.query(insertTeamMemberQuery, [teamId, memberId], (teamMemberError, teamMemberResults) => {
          if (teamMemberError) {
            console.error('Error inserting team member data:', teamMemberError);
            // Release the connection back to the pool
            connection.release();
            return res.status(500).send('Error inserting team member data into the database');
          }

          console.log('Inserted data into the team_members table:', teamMemberResults);

          // Release the connection back to the pool
          connection.release();

          // Send success response
          return res.send('Data inserted successfully');
        });
      });
    });
  });
};

export default addTeam;
