const pool = require('../config/db.js')
 const getAllRegistrationsService = async (event_id) => {
    const result = await pool.query("SELECT * FROM registrations WHERE event_id = $1", [event_id]);
    return result.rows
}

 const createRegistrationService = async (event_id, volunteer_id, registered_at) => {
    const result = await pool.query("INSERT INTO registrations (event_id, volunteer_id, registered_at) VALUES ($1, $2, $3) RETURNING *", [event_id, volunteer_id, registered_at]);
    return result.rows[0]
}

 const deleteRegistrationService = async (id) => {
    const result = await pool.query("DELETE FROM registrations WHERE id=$1 RETURNING *", [id]);
    return result.rows[0]
}

 const updateRegistrationService = async (id, volunteer_id, event_id, registered_at) => {
    const result = await pool.query("UPDATE registrations SET volunteer_id=$1, event_id=$2, registered_at=$3 WHERE id=$4 RETURNING *", [volunteer_id, event_id, registered_at, id]);
    return result.rows[0]
}

module.exports = {getAllRegistrationsService, createRegistrationService, deleteRegistrationService, updateRegistrationService}