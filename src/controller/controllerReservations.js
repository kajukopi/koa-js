import Reservation from "../models/Reservation.js";

export default {
    getAllReservations: async (ctx) => {
        const reservations = await Reservation.find({});
        await ctx.render("reservations", { data: reservations, title: "Reservations" })
    },

    createReservation: async (ctx) => {
        const newReservation = new Reservation(ctx.request.body);
        await newReservation.save();
        await ctx.render("reservations", { data: newReservation, title: "Reservations" })
    },

    getReservationById: async (ctx) => {
        const reservation = await Reservation.findById(ctx.params.id);
        await ctx.render("reservations", { data: reservation, title: "Reservations" })
    },

    updateReservation: async (ctx) => {
        const updatedReservation = await Reservation.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("reservations", { data: updatedReservation, title: "Reservations" })
    },

    deleteReservation: async (ctx) => {
        await Reservation.findByIdAndDelete(ctx.params.id);
        await ctx.render("reservations", { data: "deleted", title: "Reservations" })
    },

}