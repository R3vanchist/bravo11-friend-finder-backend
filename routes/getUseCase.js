import pool from "../server/database.js";

function getUseCase(req, res) {
  const id = req.params.id; // Correctly capture the team ID from the request body

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting a database connection:", err);
      return res.status(500).send("Error connecting to the database");
    }

    connection.query(
      "SELECT id, title, pocName, pocDiscordName, company, desiredDeliverable, hasData, desiredSkillsets, description, classificationLevel, location, teamId FROM usecases WHERE id = ?",
      [id],
      (queryErr, results) => {
        // Always release the connection back to the pool
        connection.release();

        if (queryErr) {
          console.error("Error querying the database:", queryErr);
          return res.status(500).send("Error querying the database");
        }

        // Send the query results back to the client
        console.log(results);
        res.json(results);
      }
    );
  });
}

export default getUseCase;
