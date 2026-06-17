const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getAllAdminsService, getAdminsByIdService, getAdminByEmailService, createAdminService, deleteAdminService, updateAdminService} = require('../models/adminModel.js')

const handleResponse = (res, status, message, data= null)=> {
    res.status(status).json({
        status,
        message,
        data
    })
}

const getAllAdmins =async (req, res, next) => {
    try{
        const users =await getAllAdminsService()
        handleResponse(res, 200, "Admin fetched successfully", users)
    }catch(error) {
        next(error)
    }
}

const getAdminsById =async (req, res, next) => {
    try{
        const { id } = req.params;
        const user =await getAdminsByIdService(id)
        if (!user) return handleResponse(res, 404, "Admin not found")
        handleResponse(res, 200, "Admin fetched successfully", user)
    }catch(error) {
        next(error)
    }
}

const createAdmin =async (req, res, next) => {
    const {name, email, password} = req.body
    try{
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const user =await createAdminService(name, email, password_hash)
        handleResponse(res, 201, "Admin created successfully", user)
    }catch(error) {
        next(error)
    }
}

const loginAdmin = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const admin = await getAdminByEmailService(email);
        if(!admin) return handleResponse(res, 404, "Invalid credentials")
        
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if(!isMatch) return handleResponse(res, 401, "Invalid credentials")

        const token = jwt.sign(
            { id: admin.id, role: 'admin', email: admin.email }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send user info and token back to frontend
        handleResponse(res, 200, "Logged in successfully", { admin, token })
    } catch (error) {
        next(error)
    }  
}

const deleteAdmin =async (req, res, next) => {
    try{
        const { id } = req.params;
        const user =await deleteAdminService(id)
        if (!user) return handleResponse(res, 404, "Admin not found")
        handleResponse(res, 200, "Admin deleted successfully", user)
    }catch(error) {
        next(error)
    }
}

const updateAdmin =async (req, res, next) => {
    try{
        const { id } = req.params;
        const { name, email, password } = req.body;
        const existing = await getAdminsByIdService(id);
        if (!existing) return handleResponse(res, 404, "Admin not found");

        let password_hash;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password_hash = await bcrypt.hash(password, salt);
        } else {
            password_hash = existing.password_hash;
        }

        const updatedName = name !== undefined ? name : existing.name;
        const updatedEmail = email !== undefined ? email : existing.email;

        const user =await updateAdminService(id, updatedName, updatedEmail, password_hash)
        handleResponse(res, 200, "Admin updated successfully", user)
    }catch(error) {
        next(error)
    }
}

module.exports = {getAllAdmins, getAdminsById, createAdmin, deleteAdmin, updateAdmin, loginAdmin}