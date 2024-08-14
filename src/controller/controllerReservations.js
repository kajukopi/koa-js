const Reservation = require('../models/Reservation');

exports.getAllReservations = async (ctx) => {
    const reservations = await Reservation.find({});
    ctx.body = reservations;
};

exports.createReservation = async (ctx) => {
    const newReservation = new Reservation(ctx.request.body);
    await newReservation.save();
    ctx.body = newReservation;
};

exports.getReservationById = async (ctx) => {
    const reservation = await Reservation.findById(ctx.params.id);
    ctx.body = reservation;
};

exports.updateReservation = async (ctx) => {
    const updatedReservation = await Reservation.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = updatedReservation;
};

exports.deleteReservation = async (ctx) => {
    await Reservation.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
};
