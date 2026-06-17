const {getAllEventsService, getEventsByIdService, createEventService, deleteEventService, updateEventService} = require("../models/eventsModel")
const handleResponse = (res, status, message, data= null)=> {
    res.status(status).json({
        status,
        message,
        data
    })
}

const getAllEvents =async (req, res, next) => {
    try{
        const events =await getAllEventsService()
        handleResponse(res, 200, "Events fetched successfully", events)
    }catch(error) {
        next(error)
    }
}

const getEventsById =async (req, res, next) => {
    try{
        const { id } = req.params;
        const event =await getEventsByIdService(id)
        if (!event) return handleResponse(res, 404, "Event not found")
        handleResponse(res, 200, "Event fetched successfully", event)
    }catch(error) {
        next(error)
    }
}

const createEvent =async (req, res, next) => {
    try{
        const { title, description, location, date, capacity, status } = req.body;
        const created_by = req.user.id; // from verifyToken middleware
        const event =await createEventService(title, description, location, date, capacity, status || 'upcoming', created_by)
        handleResponse(res, 201, "Event created successfully", event)
    }catch(error) {
        next(error)
    }
}

const deleteEvent =async (req, res, next) => {
    try{
        const { id } = req.params;
        const event =await deleteEventService(id)
        if (!event) return handleResponse(res, 404, "Event not found")
        handleResponse(res, 200, "Event deleted successfully", event)
    }catch(error) {
        next(error)
    }
}

const updateEvent =async (req, res, next) => {
    try{
        const { id } = req.params;
        const { title, description, location, date, capacity, status } = req.body;
        const existing = await getEventsByIdService(id);
        if (!existing) return handleResponse(res, 404, "Event not found");

        const event =await updateEventService(
            id,
            title !== undefined ? title : existing.title,
            description !== undefined ? description : existing.description,
            location !== undefined ? location : existing.location,
            date !== undefined ? date : existing.date,
            capacity !== undefined ? capacity : existing.capacity,
            status !== undefined ? status : existing.status,
            existing.created_by
        )
        handleResponse(res, 200, "Event updated successfully", event)
    }catch(error) {
        next(error)
    }
}

module.exports = {getAllEvents, getEventsById, createEvent, deleteEvent, updateEvent}