const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getAllVolunteersService, getVolunteersByIdService, getVolunteerByEmailService, createVolunteerService, deleteVolunteerService, updateVolunteerService} = require('../models/volunteersModel')

const handleResponse = (res, status, message, data= null)=> {
    res.status(status).json({
        status,
        message,
        data
    })
}

const getAllVolunteers =async (req, res, next) => {
    try{
        const users =await getAllVolunteersService()
        handleResponse(res, 200, "Users fetched successfully", users)
    }catch(error) {
        next(error)
    }
}

const getVolunteersById =async (req, res, next) => {
    try{
        const { id } = req.params;
        const user =await getVolunteersByIdService(id)
        if (!user) return handleResponse(res, 404, "User not found")
        handleResponse(res, 200, "User fetched successfully", user)
    }catch(error) {
        next(error)
    }
}

const createVolunteer =async (req, res, next) => {
    const {name, email, password} = req.body
    try{
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const user =await createVolunteerService(name, email, password_hash)
        
        const token = jwt.sign(
            { email: user.email, id: user.id, role: 'volunteer' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        handleResponse(res, 201, "User created successfully", { user, token })
    }catch(error) {
        next(error)
    }
}
    
const loginVolunteer = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const user = await getVolunteerByEmailService(email);
        if(!user) return handleResponse(res, 404, "Invalid credentials")
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) return handleResponse(res, 401, "Invalid credentials")

        // Generate JWT Token
        const token = jwt.sign(
            { email: user.email, id: user.id, role: 'volunteer' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Set HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send user info and token back to frontend
        handleResponse(res, 200, "Logged in successfully", { user, token })
    } catch (error) {
        next(error)
    }    
}

const deleteVolunteer =async (req, res, next) => {
    try{
        const { id } = req.params;
        const user =await deleteVolunteerService(id)
        if (!user) return handleResponse(res, 404, "User not found")
        handleResponse(res, 200, "User deleted successfully", user)
    }catch(error) {
        next(error)
    }
}

const updateVolunteer =async (req, res, next) => {
    try{
        const { id } = req.params;
        const { name, email, password } = req.body;
        const existing = await getVolunteersByIdService(id);
        if (!existing) return handleResponse(res, 404, "User not found");

        let password_hash;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password_hash = await bcrypt.hash(password, salt);
        } else {
            password_hash = existing.password_hash;
        }

        const updatedName = name !== undefined ? name : existing.name;
        const updatedEmail = email !== undefined ? email : existing.email;

        const user =await updateVolunteerService(id, updatedName, updatedEmail, password_hash)
        handleResponse(res, 200, "User updated successfully", user)
    }catch(error) {
        next(error)
    }
}

module.exports = {getAllVolunteers, getVolunteersById, createVolunteer, deleteVolunteer, updateVolunteer, loginVolunteer}