const pool = require('../config/db.js')

 const getAllVolunteersService = async () => {
    const result = await pool.query("SELECT * FROM volunteers");
    return result.rows
}

 const getVolunteersByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM volunteers WHERE id = $1", [id]);
    return result.rows[0]
}

 const createVolunteerService = async (name, email, password_hash) => {
    const result = await pool.query("INSERT INTO volunteers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *", [name, email, password_hash]);
    return result.rows[0]
}

 const updateVolunteerService = async (id, name, email, password_hash) => {
    const result = await pool.query("UPDATE volunteers SET name=$1, email=$2, password_hash=$3 WHERE id=$4 RETURNING *", [name, email, password_hash, id]);
    return result.rows[0]
}


 const deleteVolunteerService = async (id) => {
    const result = await pool.query("DELETE FROM volunteers WHERE id=$1 RETURNING *", [id]);
    return result.rows[0]
}

 const getVolunteerByEmailService = async (email) => {
    const result = await pool.query("SELECT * FROM volunteers WHERE email = $1", [email]);
    return result.rows[0];
}

module.exports = {getAllVolunteersService, getVolunteersByIdService, getVolunteerByEmailService, createVolunteerService, deleteVolunteerService, updateVolunteerService}