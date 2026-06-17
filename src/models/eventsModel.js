const pool = require('../config/db.js')
 const getAllEventsService = async () => {
    const result = await pool.query("SELECT * FROM events");
    return result.rows
}

 const getEventsByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    return result.rows[0]
}

 const createEventService = async (title, description, location, date, capacity, status, created_by) => {
    const result = await pool.query("INSERT INTO events (title, description, location, date, capacity, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [title, description, location, date, capacity, status, created_by]);
    return result.rows[0]
}

 const deleteEventService = async (id) => {
    const result = await pool.query("DELETE FROM events WHERE id=$1 RETURNING *", [id]);
    return result.rows[0]
}

 const updateEventService = async (id, title, description, location, date, capacity, status, created_by) => {
    const result = await pool.query("UPDATE events SET title=$1, description=$2, location=$3, date=$4, capacity=$5, status=$6, created_by=$7 WHERE id=$8 RETURNING *", [title, description, location, date, capacity, status, created_by, id]);
    return result.rows[0]
}

module.exports = {getAllEventsService, getEventsByIdService, createEventService, deleteEventService, updateEventService}