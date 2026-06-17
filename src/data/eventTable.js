const pool = require("../config/db.js")

const createEventTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date TIMESTAMP NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
    `;
    try{
        await pool.query(queryText);
        console.log("event table created if not exist")
    }catch(error){
        console.log("something unexpected happened",error)

    }    

    }
module.exports = createEventTable