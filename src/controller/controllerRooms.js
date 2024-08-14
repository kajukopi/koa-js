const Room = require('../models/Room');

exports.getAllRooms = async (ctx) => {
    const rooms = await Room.find({});
    ctx.body = rooms;
};

exports.createRoom = async (ctx) => {
    const newRoom = new Room(ctx.request.body);
    await newRoom.save();
    ctx.body = newRoom;
};

exports.getRoomById = async (ctx) => {
    const room = await Room.findById(ctx.params.id);
    ctx.body = room;
};

exports.updateRoom = async (ctx) => {
    const updatedRoom = await Room.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = updatedRoom;
};

exports.deleteRoom = async (ctx) => {
    await Room.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
};
