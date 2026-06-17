const  {getAllRegistrationsService, createRegistrationService, deleteRegistrationService, updateRegistrationService} = require("../models/registerModel")
const handleResponse = (res, status, message, data= null)=> {
    res.status(status).json({
        status,
        message,
        data
    })
}

const getAllRegistrations =async (req, res, next) => {
    try{
        const { event_id } = req.params;
        const registrations =await getAllRegistrationsService(event_id)
        handleResponse(res, 200, "Registrations fetched successfully", registrations)
    }catch(error) {
        next(error)
    }
}

const createRegistration =async (req, res, next) => {
    try{
        const { event_id } = req.params;
        const volunteer_id = req.user.id; // from verifyToken middleware
        const registered_at = new Date();
        const registration =await createRegistrationService(event_id, volunteer_id, registered_at)
        handleResponse(res, 201, "Registrations created successfully", registration)
    }catch(error) {
        next(error)
    }
}

const deleteRegistration =async (req, res, next) => {
    try{
        const { reg_id } = req.params;
        const registration =await deleteRegistrationService(reg_id)
        if (!registration) return handleResponse(res, 404, "Registration not found")
        handleResponse(res, 200, "Registrations deleted successfully", registration)
    }catch(error) {
        next(error)
    }
}

const updateRegistration =async (req, res, next) => {
    try{
        const { reg_id, event_id } = req.params;
        const { volunteer_id } = req.body;
        const registered_at = new Date();
        const registration =await updateRegistrationService(reg_id, volunteer_id, event_id, registered_at)
        if (!registration) return handleResponse(res, 404, "Registration not found")
        handleResponse(res, 200, "Registrations updated successfully", registration)
    }catch(error) {
        next(error)
    }
}

module.exports = {getAllRegistrations, createRegistration, deleteRegistration, updateRegistration}