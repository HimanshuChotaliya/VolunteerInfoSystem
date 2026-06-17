const express = require("express")
const {getAllAdmins, getAdminsById, createAdmin, deleteAdmin, updateAdmin} = require("../controllers/adminController.js")
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router()

// GET all volunteers
router.get("/",verifyToken, getAllAdmins)

// GET  volunteers by id
router.get("/:id",verifyToken, getAdminsById)

// POST new volunteer
router.post("/", createAdmin)

// DELETE volunteer by id
router.delete("/:id",verifyToken, deleteAdmin)

// UPDATE volunteer by id
router.put("/:id",verifyToken, updateAdmin)

module.exports = router