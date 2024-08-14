import Room from "../models/Room.js";

export default {

    getAllRooms: async (ctx) => {
        const rooms = await Room.find({});
        ctx.body = rooms;
    },

    createRoom: async (ctx) => {
        const newRoom = new Room(ctx.request.body);
        await newRoom.save();
        ctx.body = newRoom;
    },

    getRoomById: async (ctx) => {
        const room = await Room.findById(ctx.params.id);
        ctx.body = room;
    },

    updateRoom: async (ctx) => {
        const updatedRoom = await Room.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedRoom;
    },

    deleteRoom: async (ctx) => {
        await Room.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },

}