const express = require("express")
const requireAdmin = require('../middlewares/requireAdmin.js');
const verifyToken = require('../middlewares/verifyToken.js');


const {getAllEvents, getEventsById, createEvent, deleteEvent, updateEvent} = require('../controllers/eventController')
const {getAllRegistrations, createRegistration, deleteRegistration, updateRegistration}= require("../controllers/registrationController")
const router = express.Router()

// Event routes

// GET all events
router.get("/", getAllEvents)

// GET  events by id
router.get("/:id", getEventsById)

// POST new event
router.post("/", requireAdmin, createEvent)

// DELETE event by id
router.delete("/:id", requireAdmin, deleteEvent)

// UPDATE event by id
router.put("/:id", requireAdmin, updateEvent)

// Registration routes

// GET all registrations on a particular event
router.get("/registration/:event_id", getAllRegistrations)


// POST new registration
router.post("/registration/:event_id", createRegistration)

// DELETE registration by id
router.delete("/registration/:event_id/:reg_id", deleteRegistration)

// UPDATE registration by id
router.put("/registration/:event_id/:reg_id", updateRegistration)

module.exports = router