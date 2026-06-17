const pool = require('../config/db.js')
 const getAllAdminsService = async () => {
    const result = await pool.query("SELECT * FROM admins");
    return result.rows
}

 const getAdminsByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM admins WHERE id = $1", [id]);
    return result.rows[0]
}

 const createAdminService = async (name, email, password_hash) => {
    const result = await pool.query("INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *", [name, email, password_hash]);
    return result.rows[0]
}

 const updateAdminService = async (id, name, email, password_hash) => {
    const result = await pool.query("UPDATE admins SET name=$1, email=$2, password_hash=$3 WHERE id=$4 RETURNING *", [name, email, password_hash, id]);
    return result.rows[0]
}


 const deleteAdminService = async (id) => {
    const result = await pool.query("DELETE FROM admins WHERE id=$1 RETURNING *", [id]);
    return result.rows[0]
}

 const getAdminByEmailService = async (email) => {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    return result.rows[0];
}

module.exports = {getAllAdminsService, getAdminsByIdService, getAdminByEmailService, createAdminService, deleteAdminService, updateAdminService}