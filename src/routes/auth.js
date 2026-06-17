const express = require("express")
const {loginVolunteer} = require("../controllers/volunteerController.js")
const {loginAdmin} = require("../controllers/adminController.js")
const router = express.Router()

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
};



router.post("/volunteer", loginVolunteer)

router.post("/admin", loginAdmin)

router.post('/logout', logout);

module.exports = router