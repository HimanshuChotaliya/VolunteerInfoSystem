const pool = require("../config/db.js")

const createregistrationTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(volunteer_id, event_id)
);
    `;
    try{
        await pool.query(queryText);
        console.log("registration table created if not exist")
    }catch(error){
        console.log("something unexpected happened",error)

    }    

    }
module.exports = createregistrationTable