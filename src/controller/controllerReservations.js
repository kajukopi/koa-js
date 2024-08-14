import Reservation from "../models/Reservation.js";

export default {
    getAllReservations: async (ctx) => {
        const reservations = await Reservation.find({});
        ctx.body = reservations;
    },

    createReservation: async (ctx) => {
        const newReservation = new Reservation(ctx.request.body);
        await newReservation.save();
        ctx.body = newReservation;
    },

    getReservationById: async (ctx) => {
        const reservation = await Reservation.findById(ctx.params.id);
        ctx.body = reservation;
    },

    updateReservation: async (ctx) => {
        const updatedReservation = await Reservation.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedReservation;
    },

    deleteReservation: async (ctx) => {
        await Reservation.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },

}