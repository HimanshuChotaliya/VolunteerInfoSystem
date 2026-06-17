require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');


const volunteerRoutes = require("./routes/volunteer.js")
const adminRoutes = require("./routes/admin.js")
const eventRoutes = require("./routes/events.js")
const authRoutes = require("./routes/auth.js")

const express = require("express")
const createadminTable = require("./data/adminTable")
const createvolunteerTable = require("./data/volunteerTable")
const createEventTable = require("./data/eventTable")
const createregistrationTable = require("./data/registerTable")

const verifyToken = require('./middlewares/verifyToken.js');
const app = express()

console.log(process.env.DB_PASSWORD); // should print your password, not undefined

const port  = process.env.PORT
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth',     authRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/events', verifyToken, eventRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express Error Handler:", err);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error"
  });
});

const startServer = async () => {

  try {
    await createadminTable();
    await createvolunteerTable();
    await createEventTable();
    await createregistrationTable();
    console.log("volunteer management table verified/created sequentially ✅");
  } catch (err) {
    console.error("Critical: Database table creation failed:", err);
  }
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
}
startServer()    