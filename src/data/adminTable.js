const pool = require("../config/db.js")

const createadminTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
    `;
    try{
        await pool.query(queryText);
        console.log("event table created if not exist")
    }catch(error){
        console.log("============>something unexpected happened",error)

    }    

    }
module.exports = createadminTable