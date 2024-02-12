import pool from '../server/database.js';

const addUseCase = async (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting a database connection:', err);
      return res.status(500).send('Error connecting to the database');
    }

    // Extract team data from request body
    const {
      title,
      description,
      pocName,
      pocDiscordName,
      company,
      desiredDeliverable,
      hasData,
      desiredSkillsets,
      classificationLevel,
      location,
      image
    } = req.body;

    console.log(title)
    // Construct SQL query to insert a new team
    const sqlQuery = `
    INSERT INTO usecases (
      title, 
      description,
      pocName, 
      pocDiscordName, 
      company, 
      desiredDeliverable, 
      hasData, 
      desiredSkillset, 
      classificationLevel, 
      location, 
      image
      ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
      title,
      description,
      pocName,
      pocDiscordName,
      company,
      desiredDeliverable,
      hasData,
      desiredSkillsets,
      classificationLevel,
      location,
      image
    ];

    connection.query(sqlQuery, values, (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).send('Error inserting data into the database');
      }

      console.log('Inserted data into the use-case table:', results);
      return res.send('Data inserted successfully');
    });
  });
};

export default addUseCase;