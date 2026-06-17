const express = require("express")
const {getAllVolunteers, getVolunteersById, createVolunteer, deleteVolunteer, updateVolunteer} = require("../controllers/volunteerController")
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router()

// GET all volunteers
router.get("/",verifyToken, getAllVolunteers)

// GET  volunteers by id
router.get("/:id",verifyToken, getVolunteersById)

// POST new volunteer
router.post("/", createVolunteer)

// DELETE volunteer by id
router.delete("/:id",verifyToken, deleteVolunteer)

// UPDATE volunteer by id
router.put("/:id",verifyToken, updateVolunteer)

module.exports = router